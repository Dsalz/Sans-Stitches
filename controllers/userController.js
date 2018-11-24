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
    const user = {
      id: Math.ceil(Math.random() * 1000000),
      firstname: names[0],
      lastname: names[names.length - 1],
      othernames: names.slice(1, names.length - 1).join(' '),
      email,
      phoneNumber,
      password,
      username: email,
      registered: Date.now(),
      isAdmin: false,
    };
    return tokenizer.createToken(user, res);
  },
  loginUser: (req, res) => {
    const { email, password } = req.body;
    const user = userStore.find({ email, password });
    return tokenizer.createToken(user, res);
  },
};

export default controller;
