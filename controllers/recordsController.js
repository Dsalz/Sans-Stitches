import store from '../store';

const { recordStore } = store;

const controller = {
  getRedFlagRecord: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);
    if (!specificRecord || !specificRecord.isActive) {
      return res.json({
        status: 404,
        data: [{
          message: 'Record does not exist',
        }],
      });
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
      latitude,
      longitude,
      description,
      comment,
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
      return res.json({
        status: 404,
        data: [{
          message: 'This record does not exist',
        },
        ],
      });
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

    return res.json({
      status: 403,
      data: [{
        message: 'You do not have permissions to delete this record',
      },
      ],
    });
  },
  updateRedFlagRecordLocation: (req, res) => {
    const specificRecordId = Number(req.params.id);
    const specificRecord = recordStore.find(record => record.id === specificRecordId);

    if (!specificRecord) {
      return res.json({
        status: 404,
        data: [{
          message: 'Record does not exist',
        }],
      });
    }
    if (req.user.id !== specificRecord.createdBy) {
      return res.json({
        status: 403,
        data: [{
          message: 'You do not have permissions to update this record',
        }],
      });
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
    if (!specificRecord) {
      return res.json({
        status: 404,
        data: [{
          message: 'Record does not exist',
        }],
      });
    }
    if (req.user.id !== specificRecord.createdBy) {
      return res.json({
        status: 403,
        data: [{
          message: 'You do not have permissions to update this record',
        }],
      });
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
