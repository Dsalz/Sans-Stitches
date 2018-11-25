import store from '../store';
import tokenizer from '../middleware/tokenizer';

const { userStore } = store;

const controller = {
  signUpUser: (req, res) => {
    const {
      name,
      email,
      phoneNumber,
      password,
    } = req.body;

    const names = name.split(' ');
    if (userStore.find(user => user.email === email)) {
      return res.json({
        status: 409,
        data: [{
          message: 'Email already Exists',
        }],
      });
    }
    const user = {
      id: Math.ceil(Math.random() * 1000000),
      firstname: names[0],
      lastname: names[names.length - 1],
      othernames: names.slice(1, names.length - 1).join(' '),
      email,
      phoneNumber,
      password,
      username: email,
      registered: new Date(),
      isAdmin: false,
    };

    userStore.push(user);

    return tokenizer.createToken(user, res, 'Succesful Sign Up');
  },

  loginUser: (req, res) => {
    const { email, password } = req.body;

    const userLoggingIn = userStore.find(user => (
      user.email === email && user.password === password
    ));

    if (!userLoggingIn) {
      return res.json({
        status: 404,
        data: [{
          message: 'User Not Found',
        }],
      });
    }

    return tokenizer.createToken(userLoggingIn, res, 'Succesful Login');
  },
};

export default controller;
