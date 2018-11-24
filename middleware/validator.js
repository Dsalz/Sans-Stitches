const invalidField = (fieldname, res) => res.json({
  status: 500,
  data: [{
    message: `Invalid ${fieldname}`,
  },
  ],
});

const requiredField = (fieldname, res) => res.json({
  status: 500,
  data: [{
    message: `${fieldname} is Required`,
  },
  ],
});

const validator = {
  validateRecord: (req, res, next) => {
    const {
      title,
      description,
      latitude,
      longitude,
    } = req.body;

    if (!title) {
      return requiredField('Title', res);
    }
    if (typeof title !== 'string') {
      return invalidField('Title', res);
    }
    if (description) {
      if (typeof description !== 'string') {
        return invalidField('Description', res);
      }
    }
    if (latitude || longitude) {
      if (typeof latitude !== 'string' || typeof longitude !== 'string') {
        return invalidField('Geolocation Data', res);
      }
    }
    return next();
  },
};

export default validator;
