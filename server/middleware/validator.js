const invalidField = validationMessageArr => ({
  status: 400,
  error: validationMessageArr,
});

const validateEmailAndPassword = (email, password) => {
  const validationMessageArr = [];
  const emailRegex = /\S[@]\S+[.]\S/;
  if (!email) {
    validationMessageArr.push({ email: 'Email is Required' });
  } if (typeof email !== 'string' || !(emailRegex.test(email))) {
    validationMessageArr.push({ email: 'Invalid Email' });
  } if (!password) {
    validationMessageArr.push({ password: 'Password is Required' });
  } if (typeof password !== 'string') {
    validationMessageArr.push({ password: 'Invalid Password' });
  } if (typeof password === 'string' && !password.trim()) {
    validationMessageArr.push({ password: 'Password is Required' });
  }
  return validationMessageArr;
};

const validateLatitudeAndLongitude = (latitude, longitude, areRequired) => {
  const geolocationRegex = /\d[.]\d/;
  const validationMessageArr = [];
  if (areRequired) {
    if (!latitude && !longitude) {
      validationMessageArr.push({ geolocation: 'Geolocation Data is Required' });
    }
    if (!latitude || !longitude) {
      validationMessageArr.push({ geolocation: 'Invalid Geolocation Data' });
    } if ((typeof latitude === 'string' && !latitude.trim()) || (typeof longitude === 'string' && !longitude.trim())) {
      validationMessageArr.push({ geolocation: 'Geolocation Data is Required' });
    }
  } if (latitude || longitude) {
    if (typeof latitude !== 'string' || typeof longitude !== 'string') {
      validationMessageArr.push({ geolocation: 'Invalid Geolocation Data' });
    } if ((typeof latitude === 'string' && !geolocationRegex.test(latitude)) || (typeof longitude === 'string' && !geolocationRegex.test(longitude))) {
      validationMessageArr.push({ geolocation: 'Invalid Geolocation Data' });
    } if (!Number(latitude) || !Number(latitude)) {
      validationMessageArr.push({ geolocation: 'Invalid Geolocation Data' });
    }
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
      validationMessageArr.push({ comment: 'Comment is Required' });
    } if (typeof comment !== 'string') {
      validationMessageArr.push({ comment: 'Invalid Comment' });
    } if (typeof comment === 'string' && !comment.trim()) {
      validationMessageArr.push({ comment: 'Comment is Required' });
    } if (description && typeof description !== 'string') {
      validationMessageArr.push({ description: 'Invalid Description' });
    } validationMessageArr.push(...validateLatitudeAndLongitude(latitude, longitude, false));
    return (validationMessageArr.length) ? res.json(invalidField(validationMessageArr)) : next();
  },

  validateUserSignUp: (req, res, next) => {
    const {
      name, email, phoneNumber, password, confirmPassword,
    } = req.body;
    const validationMessageArr = validateEmailAndPassword(email, password);
    if (password !== confirmPassword) {
      validationMessageArr.push({ password: 'Password and Confirm Password do not match' });
    } if (!name) {
      validationMessageArr.push({ name: 'Name is Required' });
    } if (typeof name !== 'string') {
      validationMessageArr.push({ name: 'Invalid Name' });
    } if (typeof name === 'string' && !name.trim()) {
      validationMessageArr.push({ name: 'Name is Required' });
    } if (!phoneNumber) {
      validationMessageArr.push({ phoneNumber: 'Phone Number is Required' });
    } if (typeof phoneNumber !== 'string' || phoneNumber.length < 10) {
      validationMessageArr.push({ phoneNumber: 'Invalid Phone Number' });
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
    const validationMessageArr = validateLatitudeAndLongitude(latitude, longitude, true);
    return (validationMessageArr.length) ? res.json(invalidField(validationMessageArr)) : next();
  },
};

export default validator;
