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
    if (!specificRecord || !specificRecord.isActive) {
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
      latitude, longitude, description, comment, images, videos,
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
      Videos: videos ? [...videos] : [],
    };
    recordStore.push(newRecord);
    res.json({
      status: 200,
      data: [{
        id: newRecord.id,
        message: 'Created red-flag record',
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
      }],
    });
  },
};

export default controller;
