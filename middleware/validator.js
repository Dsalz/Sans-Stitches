const invalidField = message => ({
  status: 400,
  error: message,
});

const validateEmailAndPassword = (email, password) => {
  let message = 'Valid Fields';
  if (!email) {
    message = 'Email is Required';
    return message;
  }
  if (typeof email !== 'string' || !(/['@']/g.test(email))) {
    message = 'Invalid Email';
    return message;
  }
  if (!password) {
    message = 'Password is Required';
    return message;
  }
  if (typeof password !== 'string') {
    message = 'Invalid Password';
    return message;
  }
  if (!password.trim()) {
    message = 'Password is Required';
    return message;
  }
  return message;
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
      name, email, phoneNumber, password, confirmPassword,
    } = req.body;
    const validationMessage = validateEmailAndPassword(email, password);
    if (validationMessage !== 'Valid Fields') {
      return res.json(invalidField(validationMessage));
    }
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

    const validationMessage = validateEmailAndPassword(email, password);
    if (validationMessage !== 'Valid Fields') {
      return res.json(invalidField(validationMessage));
    }

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
