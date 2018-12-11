import db from '../store/db';
import queries from '../store/queries';

const invalidParams = () => ({
  status: 400,
  error: 'Parameters entered are invalid',
});

const recordDoesNotExist = () => ({
  status: 404,
  error: 'Record does not exist',
});

const notAuthorized = action => ({
  status: 403,
  error: `You do not have permissions to ${action} this record`,
});

const trimValues = (body) => {
  const bodyKeys = Object.keys(body);
  const trimmedBody = {};
  for (let i = 0; i < bodyKeys.length; i += 1) {
    trimmedBody[bodyKeys[i]] = body[bodyKeys[i]].trim();
  }
  return trimmedBody;
};

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
    } if ((typeof latitude === 'string' && !latitude.trim()) || (typeof longitude === 'string' && !longitude.trim())) {
      validationMessageArr.push({ geolocation: 'Geolocation Data is Required' });
    }
  } if (latitude || longitude) {
    if (typeof latitude !== 'string' || typeof longitude !== 'string') {
      validationMessageArr.push({ geolocation: 'Invalid Geolocation Data' });
    } if ((typeof latitude === 'string' && !geolocationRegex.test(latitude)) || (typeof longitude === 'string' && !geolocationRegex.test(longitude))) {
      validationMessageArr.push({ geolocation: 'Invalid Geolocation Data' });
    } if ((typeof latitude === 'string' && !Number(latitude)) || (typeof longitude === 'string' && !Number(longitude))) {
      validationMessageArr.push({ geolocation: 'Invalid Geolocation Data' });
    }
  }
  return validationMessageArr;
};

const validator = {
  async validateDbUpdateParams(req, res, next) {
    if (/\D/g.test(req.params.id)) {
      return res.json(invalidParams());
    }
    const specificRecordId = Number(req.params.id);
    const urlContents = req.originalUrl.split('/');
    const type = urlContents.indexOf('red-flags') > -1 ? 'red-flag' : 'intervention';
    let action;
    if (urlContents.indexOf('location') > -1) {
      action = 'location';
    } else if (urlContents.indexOf('comment') > -1) {
      action = 'comment';
    } else if (urlContents.indexOf('status') > -1) {
      action = 'status';
    }
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== type) {
      return res.json(recordDoesNotExist());
    }
    if (action !== 'status') {
      if (req.user.id !== specificRecord.created_by || specificRecord.status !== 'pending review') {
        return res.json(notAuthorized(`update the ${action} of`));
      }
    } else if (action === 'status') {
      if (!req.user.is_admin) {
        return res.json(notAuthorized('update the status of'));
      }
    }
    req.specificRecord = specificRecord;
    return next();
  },
  async validateDbGetParams(req, res, next) {
    if (/\D/g.test(req.params.id)) {
      return res.json(invalidParams());
    }
    const specificRecordId = Number(req.params.id);
    const urlContents = req.originalUrl.split('/');
    const type = urlContents.indexOf('red-flags') > -1 ? 'red-flag' : 'intervention';
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== type) {
      return res.json(recordDoesNotExist());
    }
    req.specificRecord = specificRecord;
    return next();
  },
  async validateDbDeleteParams(req, res, next) {
    if (/\D/g.test(req.params.id)) {
      return res.json(invalidParams());
    }
    const specificRecordId = Number(req.params.id);
    const urlContents = req.originalUrl.split('/');
    const type = urlContents.indexOf('red-flags') > -1 ? 'red-flag' : 'intervention';
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== type) {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.created_by || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('delete'));
    }
    req.specificRecord = specificRecord;
    return next();
  },
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
    req.body = (validationMessageArr.length) ? req.body : trimValues(req.body);
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
  validateStatus: (req, res, next) => {
    const {
      status,
      feedback,
    } = req.body;
    const acceptableStatusVals = ['pending review', 'under investigation', 'rejected', 'resolved'];
    const validationMessageArr = [];
    if (!status || (typeof status === 'string' && !status.trim())) {
      validationMessageArr.push({ status: 'Status is Required' });
    } if (typeof status !== 'string' || acceptableStatusVals.indexOf(status) === -1) {
      validationMessageArr.push({ status: 'Invalid Status' });
    } if (feedback && typeof feedback !== 'string') {
      validationMessageArr.push({ feedback: 'Invalid Feedback' });
    }
    return (validationMessageArr.length) ? res.json(invalidField(validationMessageArr)) : next();
  },
};

export default validator;
