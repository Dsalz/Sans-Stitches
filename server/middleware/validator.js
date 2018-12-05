const invalidField = validationMessageArr => ({
  status: 400,
  error: validationMessageArr,
});

const validateEmailAndPassword = (email, password) => {
  const validationMessageArr = [];
  if (!email) {
    validationMessageArr.push('Email is Required');
  } if (typeof email !== 'string' || !(/['@']/g.test(email))) {
    validationMessageArr.push('Invalid Email');
  } if (!password) {
    validationMessageArr.push('Password is Required');
  } if (typeof password !== 'string') {
    validationMessageArr.push('Invalid Password');
  } if (typeof password === 'string' && !password.trim()) {
    validationMessageArr.push('Password is Required');
  }
  return validationMessageArr;
};

const validator = {
  validateRecord: (req, res, next) => {
    const {
      comment,
      description,
      latitude,
      longitude,
    } = req.body;
    const validationMessageArr = [];
    if (!comment) {
      validationMessageArr.push('Comment is Required');
    } if (typeof comment !== 'string') {
      validationMessageArr.push('Invalid Comment');
    } if (typeof comment === 'string' && !comment.trim()) {
      validationMessageArr.push('Comment is Required');
    } if (description && typeof description !== 'string') {
      validationMessageArr.push('Invalid Description');
    } if ((latitude || longitude) && (typeof latitude !== 'string' || typeof longitude !== 'string')) {
      validationMessageArr.push('Invalid Geolocation Data');
    }
    return (validationMessageArr.length) ? res.json(invalidField(validationMessageArr)) : next();
  },

  validateUserSignUp: (req, res, next) => {
    const {
      name, email, phoneNumber, password, confirmPassword,
    } = req.body;
    const validationMessageArr = validateEmailAndPassword(email, password);
    if (password !== confirmPassword) {
      validationMessageArr.push('Password and Confirm Password do not match');
    } if (!name) {
      validationMessageArr.push('Name is Required');
    } if (typeof name !== 'string') {
      validationMessageArr.push('Invalid Name');
    } if (typeof name === 'string' && !name.trim()) {
      validationMessageArr.push('Name is Required');
    } if (!phoneNumber) {
      validationMessageArr.push('Phone Number is Required');
    } if (typeof phoneNumber !== 'string' || phoneNumber.length < 10) {
      validationMessageArr.push('Invalid Phone Number');
    }
    return (validationMessageArr.length) ? res.json(invalidField(validationMessageArr)) : next();
  },

  validateUserLogin: (req, res, next) => {
    const {
      email,
      password,
    } = req.body;
    const validationMessageArr = validateEmailAndPassword(email, password);
    return (validationMessageArr.length) ? res.json(invalidField(validationMessageArr)) : next();
  },

  validateGeolocation: (req, res, next) => {
    const {
      latitude,
      longitude,
    } = req.body;
    const validationMessageArr = [];
    if (!latitude || !longitude) {
      validationMessageArr.push('Invalid Geolocation Data');
    } else if (typeof latitude !== 'string' || typeof longitude !== 'string') {
      validationMessageArr.push('Invalid Geolocation Data');
    } else if ((typeof latitude === 'string' && !latitude.trim()) || (typeof longitude === 'string' && !longitude.trim())) {
      validationMessageArr.push('Geolocation Data is Required');
    }

    return (validationMessageArr.length) ? res.json(invalidField(validationMessageArr)) : next();
  },
};

export default validator;
