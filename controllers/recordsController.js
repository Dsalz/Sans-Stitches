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
      createdBy: 1,
      type: 'red-flag',
      location: `${latitude} , ${longitude}`,
      isActive: true,
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
};

export default controller;
