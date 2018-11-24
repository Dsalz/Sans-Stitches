import jwt from 'jsonwebtoken';

const majorKey = process.env.SECRET_KEY || 'peterpiperpickedapeckofpickledpepper';

const tokenizer = {
  createToken: (user, res, successMessage) => {
    jwt.sign({ user }, majorKey, (err, token) => {
      if (err) {
        return res.json({
          status: 500,
          data: [{ message: 'Error Creating Token' }],
        });
      }
      return res.json({
        status: 200,
        data: [{
          user,
          token,
          message: successMessage,
        }],
      });
    });
  },
  verifyToken: (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        status: 401,
        data: [
          {
            message: 'Request has no Token',
          },
        ],
      });
    }

    return jwt.verify(authorization.split(' ')[1], majorKey, (err, data) => {
      if (err) {
        return res.json({
          status: 401,
          data: [{
            message: 'Invalid Token',
          }],
        });
      }
      req.user = data.user;
      return next();
    });
  },
};

export default tokenizer;
