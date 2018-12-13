import bcrypt from 'bcrypt';
import db from '../store/db';
import queries from '../store/queries';
import tokenizer from '../middleware/tokenizer';

const controller = {
  async signUpUser(req, res) {
    const {
      name, email, phoneNumber, password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const names = name.split(' ');
    const userParams = [
      email,
      names[0],
      names[names.length - 1],
      names.slice(1, names.length - 1).join(' '),
      hashedPassword,
      phoneNumber,
      new Date(),
      email,
    ];
    const dbResponse = await db.sendQuery(queries.addNonAdminQuery(), userParams);
    const user = dbResponse.rows[0];
    const token = await tokenizer.createToken(user);
    delete user.password;
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
    const { user } = req;
    delete user.password;
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
