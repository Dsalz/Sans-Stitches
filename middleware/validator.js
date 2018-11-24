const invalidField = message => ({
  status: 500,
  data: [{
    message,
  },
  ],
});

const validateEmailAndPassword = (email, password, res) => {
  if (!email) {
    return res.json(invalidField('Email is Required'));
  }
  if (typeof email !== 'string' || !(/['@']/g.test(email))) {
    return res.json(invalidField('Invalid Email'));
  }
  if (!password) {
    return res.json(invalidField('Password is Required'));
  }
  if (typeof password !== 'string') {
    return res.json(invalidField('Invalid Password'));
  }

  return true;
};

const validator = {
  validateRecord: (req, res, next) => {
    const {
      title,
      description,
      latitude,
      longitude,
    } = req.body;

    if (!title) {
      return res.json(invalidField('Title is Required'));
    }
    if (typeof title !== 'string') {
      return res.json(invalidField('Invalid Title'));
    }
    if (description) {
      if (typeof description !== 'string') {
        return res.json(invalidField('Invalid Description'));
      }
    }
    if (latitude || longitude) {
      if (typeof latitude !== 'string' || typeof longitude !== 'string') {
        return res.json(invalidField('Invalid Geolocation Data'));
      }
    }
    return next();
  },
  validateUserSignUp: (req, res, next) => {
    const {
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    validateEmailAndPassword(email, password, res);
    if (password !== confirmPassword) {
      return res.json(invalidField('Password and Confirm Password do not match'));
    }
    if (!name) {
      return res.json(invalidField('Name is Required'));
    }
    if (typeof name !== 'string') {
      return res.json(invalidField('Invalid Name'));
    }
    if (!phoneNumber) {
      return res.json(invalidField('Phone Number is Required'));
    }
    if (typeof phoneNumber !== 'string' || phoneNumber.length < 10) {
      return res.json(invalidField('Invalid Phone Number'));
    }
    return next();
  },
  validateUserLogin: (req, res, next) => {
    const {
      email,
      password,
    } = req.body;

    validateEmailAndPassword(email, password, res);

    return next();
  },
};

export default validator;
