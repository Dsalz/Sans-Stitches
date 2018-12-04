const invalidField = message => ({
  status: 400,
  error: message,
});

const validateEmailAndPassword = (email, password) => {
  let message = 'Valid Fields';
  if (!email) {
    message = 'Email is Required';
  } else if (typeof email !== 'string' || !(/['@']/g.test(email))) {
    message = 'Invalid Email';
  } else if (!password) {
    message = 'Password is Required';
  } else if (typeof password !== 'string') {
    message = 'Invalid Password';
  } else if (!password.trim()) {
    message = 'Password is Required';
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
    let validationMessage = '';
    if (!comment) {
      validationMessage = 'Comment is Required';
    } else if (typeof comment !== 'string') {
      validationMessage = 'Invalid Comment';
    } else if (!comment.trim()) {
      validationMessage = 'Comment is Required';
    } else if (description && typeof description !== 'string') {
      validationMessage = 'Invalid Description';
    } else if ((latitude || longitude) && (typeof latitude !== 'string' || typeof longitude !== 'string')) {
      validationMessage = 'Invalid Geolocation Data';
    }
    return (validationMessage) ? res.json(invalidField(validationMessage)) : next();
  },

  validateUserSignUp: (req, res, next) => {
    const {
      name, email, phoneNumber, password, confirmPassword,
    } = req.body;
    let validationMessage = '';
    const externalValidationMessage = validateEmailAndPassword(email, password);
    if (externalValidationMessage !== 'Valid Fields') {
      validationMessage = externalValidationMessage;
    } else if (password !== confirmPassword) {
      validationMessage = 'Password and Confirm Password do not match';
    } else if (!name) {
      validationMessage = 'Name is Required';
    } else if (typeof name !== 'string') {
      validationMessage = 'Invalid Name';
    } else if (!name.trim()) {
      validationMessage = 'Name is Required';
    } else if (!phoneNumber) {
      validationMessage = 'Phone Number is Required';
    } else if (typeof phoneNumber !== 'string' || phoneNumber.length < 10) {
      validationMessage = 'Invalid Phone Number';
    }
    return (validationMessage) ? res.json(invalidField(validationMessage)) : next();
  },

  validateUserLogin: (req, res, next) => {
    const {
      email,
      password,
    } = req.body;
    let validationMessage = '';
    const externalValidationMessage = validateEmailAndPassword(email, password);
    if (externalValidationMessage !== 'Valid Fields') {
      validationMessage = externalValidationMessage;
    }

    return (validationMessage) ? res.json(invalidField(validationMessage)) : next();
  },

  validateGeolocation: (req, res, next) => {
    const {
      latitude,
      longitude,
    } = req.body;
    let validationMessage = '';
    if (!latitude || !longitude) {
      validationMessage = 'Invalid Geolocation Data';
    } else if (typeof latitude !== 'string' || typeof longitude !== 'string') {
      validationMessage = 'Invalid Geolocation Data';
    } else if (!latitude.trim() || !longitude.trim()) {
      validationMessage = 'Geolocation Data is Required';
    }

    return (validationMessage) ? res.json(invalidField(validationMessage)) : next();
  },
};

export default validator;
