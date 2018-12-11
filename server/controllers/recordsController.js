import db from '../store/db';
import queries from '../store/queries';

const recordDoesNotExist = () => ({
  status: 404,
  error: 'Record does not exist',
});

const notAuthorized = action => ({
  status: 403,
  error: `You do not have permissions to ${action} this record`,
});

const controller = {
  async getRedFlagRecord(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'red-flag') {
      return res.json(recordDoesNotExist());
    }
    return res.json({
      status: 200,
      data: [specificRecord],
    });
  },
  async getAllRedFlagRecords(req, res) {
    const dbResponse = await db.sendQuery(queries.getAllRecordsByTypeQuery(), ['red-flag']);
    const allRecords = dbResponse.rows;
    return res.json({
      status: 200,
      data: allRecords,
    });
  },
  async createRedFlagRecord(req, res) {
    const {
      latitude, longitude, description, comment, images, video,
    } = req.body;
    const newRecordParams = [
      comment, description, new Date(), req.user.id,
      'red-flag', (latitude && longitude) ? `${latitude.trim()} , ${longitude.trim()}` : '',
      'pending review', 'No Feedback', images ? [...images] : [], video ? [video] : [],
    ];
    const dbResponse = await db.sendQuery(queries.addRecordQuery(), newRecordParams);
    const newRecord = dbResponse.rows[0];
    res.json({
      status: 200,
      data: [{
        id: newRecord.id,
        message: 'Created red-flag record',
        newRecord,
      }],
    });
  },
  async deleteRedFlagRecord(req, res) {
    const redFlagId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [redFlagId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'red-flag') {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id === specificRecord.created_by && specificRecord.status === 'pending review') {
      const secondDbResponse = await db.sendQuery(queries.deleteRecordQuery(), [redFlagId]);
      const deletedRecord = secondDbResponse.rows[0];
      return res.json({
        status: 200,
        data: [{
          id: redFlagId,
          message: 'red-flag record has been deleted',
          deletedRecord,
        },
        ],
      });
    }
    return res.json(notAuthorized('delete'));
  },
  async updateRedFlagRecordLocation(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'red-flag') {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.created_by || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the location of'));
    }
    const updatedRecordParams = [
      specificRecordId, specificRecord.comment, specificRecord.description,
      `${req.body.latitude} , ${req.body.longitude}`, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const scndDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = scndDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated red-flag record’s location',
        updatedRecord,
      }],
    });
  },
  async updateRedFlagRecordComment(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'red-flag') {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.created_by || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the comment of'));
    }
    const updatedRecordParams = [
      specificRecordId, req.body.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const scndDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = scndDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated red-flag record’s comment',
        updatedRecord,
      }],
    });
  },
  async updateRedFlagRecordStatus(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'red-flag') {
      return res.json(recordDoesNotExist());
    }
    if (!req.user.is_admin) {
      return res.json(notAuthorized('update the status of'));
    }
    const feedback = (req.body.feedback) ? req.body.feedback : specificRecord.feedback;
    const updatedRecordParams = [
      specificRecordId, specificRecord.comment, specificRecord.description,
      specificRecord.location, req.body.status,
      feedback, specificRecord.images, specificRecord.videos,
    ];
    const scndDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = scndDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: `Updated red-flag record’s status to ${req.body.status}`,
        updatedRecord,
      }],
    });
  },
  async getInterventionRecord(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'intervention') {
      return res.json(recordDoesNotExist());
    }
    return res.json({
      status: 200,
      data: [specificRecord],
    });
  },
  async getAllInterventionRecords(req, res) {
    const dbResponse = await db.sendQuery(queries.getAllRecordsByTypeQuery(), ['intervention']);
    const allRecords = dbResponse.rows;
    return res.json({
      status: 200,
      data: allRecords,
    });
  },
  async createInterventionRecord(req, res) {
    const {
      latitude, longitude, description, comment, images, video,
    } = req.body;
    const newRecordParams = [
      comment,
      description,
      new Date(),
      req.user.id,
      'intervention',
      (latitude && longitude) ? `${latitude.trim()} , ${longitude.trim()}` : '',
      'pending review',
      'No Feedback',
      images ? [...images] : [],
      video ? [video] : [],
    ];
    const dbResponse = await db.sendQuery(queries.addRecordQuery(), newRecordParams);
    const newRecord = dbResponse.rows[0];
    res.json({
      status: 200,
      data: [{
        id: newRecord.id,
        message: 'Created intervention record',
        newRecord,
      }],
    });
  },
  async deleteInterventionRecord(req, res) {
    const interventionRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [interventionRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'intervention') {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id === specificRecord.created_by && specificRecord.status === 'pending review') {
      const scndDbResponse = await db.sendQuery(queries.deleteRecordQuery(), [
        interventionRecordId,
      ]);
      const deletedRecord = scndDbResponse.rows[0];
      return res.json({
        status: 200,
        data: [{
          id: interventionRecordId,
          message: 'intervention record has been deleted',
          deletedRecord,
        },
        ],
      });
    }
    return res.json(notAuthorized('delete'));
  },
  async updateInterventionRecordLocation(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'intervention') {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.created_by || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the location of'));
    }
    const updatedRecordParams = [
      specificRecordId, specificRecord.comment, specificRecord.description,
      `${req.body.latitude} , ${req.body.longitude}`, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const scndDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = scndDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated intervention record’s location',
        updatedRecord,
      }],
    });
  },
  async updateInterventionRecordComment(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'intervention') {
      return res.json(recordDoesNotExist());
    }
    if (req.user.id !== specificRecord.created_by || specificRecord.status !== 'pending review') {
      return res.json(notAuthorized('update the comment of'));
    }
    const updatedRecordParams = [
      specificRecordId, req.body.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const scndDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = scndDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: 'Updated intervention record’s comment',
        updatedRecord,
      }],
    });
  },
  async updateInterventionRecordStatus(req, res) {
    const specificRecordId = Number(req.params.id);
    const dbResponse = await db.sendQuery(queries.getRecordByIdQuery(), [specificRecordId]);
    const specificRecord = dbResponse.rows[0];
    if (!specificRecord || !specificRecord.is_active || specificRecord.type !== 'intervention') {
      return res.json(recordDoesNotExist());
    }
    if (!req.user.is_admin) {
      return res.json(notAuthorized('update the status of'));
    }
    const feedback = (req.body.feedback) ? req.body.feedback : specificRecord.feedback;
    const updatedRecordParams = [
      specificRecordId, specificRecord.comment, specificRecord.description,
      specificRecord.location, req.body.status,
      feedback, specificRecord.images, specificRecord.videos,
    ];
    const scndDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = scndDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecordId,
        message: `Updated red-flag record’s status to ${req.body.status}`,
        updatedRecord,
      }],
    });
  },
};

export default controller;
