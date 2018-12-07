import store from '../store';

const { recordStore } = store;

const recordDoesNotExist = () => ({
  status: 404,
  error: 'Record does not exist',
});

const notAuthorized = action => ({
  status: 403,
  error: `You do not have permissions to ${action} this record`,
});

const controller = {
  getRedFlagRecord: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);
    if (!specificRecord || !specificRecord.isActive || specificRecord.type !== 'red-flag') {
      return res.json(recordDoesNotExist());
    }
    return res.json({
      status: 200,
      data: [specificRecord],
    });
  },
  getAllRedFlagRecords: (req, res) => {
    const allRecords = recordStore.filter(record => record.type === 'red-flag' && record.isActive);
    return res.json({
      status: 200,
      data: allRecords,
    });
  },
  createRedFlagRecord: (req, res) => {
    const {
      latitude, longitude, description, comment, images, video,
    } = req.body;
    const newRecord = {
      id: recordStore.length + 1,
      comment,
      description,
      createdOn: new Date(),
      createdBy: req.user.id,
      type: 'red-flag',
      location: (latitude && longitude) ? `${latitude.trim()} , ${longitude.trim()}` : '',
      isActive: true,
      status: 'pending review',
      feedback: 'No Feedback',
      Images: images ? [...images] : [],
      Videos: video ? [video] : [],
    };
    recordStore.push(newRecord);
    res.json({
      status: 200,
      data: [{
        id: newRecord.id,
        message: 'Created red-flag record',
        newRecord,
      }],
    });
  },
  deleteRedFlagRecord: (req, res) => {
    const redFlagId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === redFlagId);
    if (!specificRecord || !specificRecord.isActive) {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id === specificRecord.createdBy && specificRecord.status === 'pending review') {
      specificRecord.isActive = false;
      return res.json({
        status: 200,
        data: [{
          id: redFlagId,
          message: 'red-flag record has been deleted',
          deletedRecord: specificRecord,
        },
        ],
      });
    }
    return res.json(notAuthorized('delete'));
  },
  updateRedFlagRecordLocation: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);
    if (!specificRecord || !specificRecord.isActive) {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.createdBy || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the location of'));
    }
    specificRecord.location = `${req.body.latitude} , ${req.body.longitude}`;
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated red-flag record’s location',
        updatedRecord: specificRecord,
      }],
    });
  },
  updateRedFlagRecordComment: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);
    if (!specificRecord || !specificRecord.isActive) {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.createdBy || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the comment of'));
    }
    specificRecord.comment = req.body.comment;
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated red-flag record’s comment',
        updatedRecord: specificRecord,
      }],
    });
  },
  getInterventionRecord: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);
    if (!specificRecord || !specificRecord.isActive || specificRecord.type !== 'intervention') {
      return res.json(recordDoesNotExist());
    }
    return res.json({
      status: 200,
      data: [specificRecord],
    });
  },
  getAllInterventionRecords: (req, res) => {
    const allRecords = recordStore.filter(record => record.type === 'intervention' && record.isActive);
    return res.json({
      status: 200,
      data: allRecords,
    });
  },
  createInterventionRecord: (req, res) => {
    const {
      latitude, longitude, description, comment, images, video,
    } = req.body;
    const newRecord = {
      id: recordStore.length + 1,
      comment,
      description,
      createdOn: new Date(),
      createdBy: req.user.id,
      type: 'intervention',
      location: (latitude && longitude) ? `${latitude.trim()} , ${longitude.trim()}` : '',
      isActive: true,
      status: 'pending review',
      feedback: 'No Feedback',
      Images: images ? [...images] : [],
      Videos: video ? [video] : [],
    };
    recordStore.push(newRecord);
    res.json({
      status: 200,
      data: [{
        id: newRecord.id,
        message: 'Created intervention record',
        newRecord,
      }],
    });
  },
  deleteInterventionRecord: (req, res) => {
    const interventionRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === interventionRecordId);
    if (!specificRecord || !specificRecord.isActive) {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id === specificRecord.createdBy && specificRecord.status === 'pending review') {
      specificRecord.isActive = false;
      return res.json({
        status: 200,
        data: [{
          id: interventionRecordId,
          message: 'intervention record has been deleted',
          deletedRecord: specificRecord,
        },
        ],
      });
    }
    return res.json(notAuthorized('delete'));
  },
  updateInterventionRecordLocation: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);
    if (!specificRecord || !specificRecord.isActive) {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.createdBy || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the location of'));
    }
    specificRecord.location = `${req.body.latitude} , ${req.body.longitude}`;
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated intervention record’s location',
        updatedRecord: specificRecord,
      }],
    });
  },
  updateInterventionRecordComment: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);
    if (!specificRecord || !specificRecord.isActive) {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.createdBy || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the comment of'));
    }
    specificRecord.comment = req.body.comment;
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated intervention record’s comment',
        updatedRecord: specificRecord,
      }],
    });
  },
};

export default controller;
