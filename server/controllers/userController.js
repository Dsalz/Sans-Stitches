import db from '../store/db';
import queries from '../store/queries';
import tokenizer from '../middleware/tokenizer';

const controller = {
  async signUpUser(req, res) {
    const {
      name, email, phoneNumber, password,
    } = req.body;
    const names = name.split(' ');
    const dbResponse = await db.sendQuery(queries.getUserByEmailQuery(), [email]);
    const emailExists = dbResponse.rows.length > 0;
    if (emailExists) {
      return res.json({
        status: 409,
        error: 'Email already Exists',
      });
    }
    const userParams = [
      email,
      names[0],
      names[names.length - 1],
      names.slice(1, names.length - 1).join(' '),
      password,
      phoneNumber,
      new Date(),
      email,
    ];
    const scndDbResponse = await db.sendQuery(queries.addNonAdminQuery(), userParams);
    const user = scndDbResponse.rows[0];
    const token = await tokenizer.createToken(user);
    return res.json({
      status: 200,
      data: [{
        user,
        token,
        message: 'Succesful Sign Up',
      }],
    });
  },

  async loginUser(req, res) {
    const { email, password } = req.body;
    const dbResponse = await db.sendQuery(queries.getUserByEmailAndPasswordQuery(), [
      email, password,
    ]);
    const user = dbResponse.rows[0];

    if (!user) {
      return res.json({
        status: 404,
        error: 'User Not Found',
      });
    }

    const token = await tokenizer.createToken(user);

    return res.json({
      status: 200,
      data: [{
        user,
        token,
        message: 'Succesful Login',
      }],
    });
  },
};

export default controller;
