import store from '../store';

const { recordStore } = store;

const controller = {
  createRedFlagRecord: (req, res) => {
    const {
      latitude,
      longitude,
      description,
      title,
    } = req.body;

    const newRecord = {
      id: recordStore.length + 1,
      title,
      description,
      createdOn: new Date(),
      createdBy: req.user.id,
      type: 'red-flag',
      location: `${latitude} , ${longitude}`,
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
};

export default controller;
