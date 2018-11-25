const invalidField = message => ({
  status: 400,
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

  if (!password.trim()) {
    return res.json(invalidField('Password is Required'));
  }

  return true;
};

const validator = {
  validateRecord: (req, res, next) => {
    const {
      comment,
      description,
      latitude,
      longitude,
    } = req.body;

    if (!comment) {
      return res.json(invalidField('Comment is Required'));
    }
    if (typeof comment !== 'string') {
      return res.json(invalidField('Invalid Comment'));
    }
    if (!comment.trim()) {
      return res.json(invalidField('Comment is Required'));
    }
    if (description && typeof description !== 'string') {
      return res.json(invalidField('Invalid Description'));
    }
    if ((latitude || longitude) && (typeof latitude !== 'string' || typeof longitude !== 'string')) {
      return res.json(invalidField('Invalid Geolocation Data'));
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
    if (!name.trim()) {
      return res.json(invalidField('Name is Required'));
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
  validateGeolocation: (req, res, next) => {
    const {
      latitude,
      longitude,
    } = req.body;

    if (!latitude || !longitude) {
      return res.json(invalidField('Invalid Geolocation Data'));
    }

    if (typeof latitude !== 'string' || typeof longitude !== 'string') {
      return res.json(invalidField('Invalid Geolocation Data'));
    }

    if (!latitude.trim() || !longitude.trim()) {
      return res.json(invalidField('Geolocation Data is Required'));
    }

    return next();
  },
};

export default validator;
