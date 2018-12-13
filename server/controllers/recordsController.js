import db from '../store/db';
import queries from '../store/queries';

const controller = {
  async getRedFlagRecord(req, res) {
    const { specificRecord } = req;
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
  async getMyRedFlagRecords(req, res) {
    const dbResponse = await db.sendQuery(queries.getAllRecordsByCreatorQuery(), ['red-flag', req.user.id]);
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
    const { specificRecord } = req;
    const dbResponse = await db.sendQuery(queries.deleteRecordQuery(), [specificRecord.id]);
    const deletedRecord = dbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'red-flag record has been deleted',
        deletedRecord,
      },
      ],
    });
  },
  async updateRedFlagRecordLocation(req, res) {
    const { specificRecord } = req;
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      `${req.body.latitude} , ${req.body.longitude}`, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const dbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = dbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated red-flag record’s location',
        updatedRecord,
      }],
    });
  },
  async updateRedFlagRecordComment(req, res) {
    const { specificRecord } = req;
    const updatedRecordParams = [
      specificRecord.id, req.body.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const secondDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = secondDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated red-flag record’s comment',
        updatedRecord,
      }],
    });
  },
  async updateRedFlagRecordStatus(req, res) {
    const { specificRecord } = req;
    const feedback = (req.body.feedback) ? req.body.feedback : specificRecord.feedback;
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      specificRecord.location, req.body.status,
      feedback, specificRecord.images, specificRecord.videos,
    ];
    const secondDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = secondDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: `Updated red-flag record’s status to ${req.body.status}`,
        updatedRecord,
      }],
    });
  },
  async updateRedFlagRecordImages(req, res) {
    const { specificRecord, files } = req;
    const imagePaths = files.reduce((p, c) => p.concat(c.filename), []);
    const images = [...specificRecord.images, ...imagePaths];
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, images, specificRecord.videos,
    ];
    const secondDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = secondDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated red-flag record’s images',
        updatedRecord,
      }],
    });
  },
  async updateRedFlagRecordVideo(req, res) {
    const { specificRecord } = req;
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, specificRecord.images, [req.body.video],
    ];
    const secondDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = secondDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated red-flag record’s video',
        updatedRecord,
      }],
    });
  },
  async getInterventionRecord(req, res) {
    const { specificRecord } = req;
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
  async getMyInterventionRecords(req, res) {
    const dbResponse = await db.sendQuery(queries.getAllRecordsByCreatorQuery(), ['intervention', req.user.id]);
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
    const { specificRecord } = req;
    const dbResponse = await db.sendQuery(queries.deleteRecordQuery(), [
      specificRecord.id,
    ]);
    const deletedRecord = dbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'intervention record has been deleted',
        deletedRecord,
      },
      ],
    });
  },
  async updateInterventionRecordLocation(req, res) {
    const { specificRecord } = req;
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      `${req.body.latitude} , ${req.body.longitude}`, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const secondDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = secondDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated intervention record’s location',
        updatedRecord,
      }],
    });
  },
  async updateInterventionRecordComment(req, res) {
    const { specificRecord } = req;
    const updatedRecordParams = [
      specificRecord.id, req.body.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, specificRecord.images, specificRecord.videos,
    ];
    const dbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = dbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated intervention record’s comment',
        updatedRecord,
      }],
    });
  },
  async updateInterventionRecordStatus(req, res) {
    const { specificRecord } = req;
    const feedback = (req.body.feedback) ? req.body.feedback : specificRecord.feedback;
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      specificRecord.location, req.body.status,
      feedback, specificRecord.images, specificRecord.videos,
    ];
    const dbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = dbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: `Updated red-flag record’s status to ${req.body.status}`,
        updatedRecord,
      }],
    });
  },
  async updateInterventionRecordImages(req, res) {
    const { specificRecord, files } = req;
    const imagePaths = files.reduce((p, c) => p.concat(c.filename), []);
    const images = [...specificRecord.images, ...imagePaths];
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, images, specificRecord.videos,
    ];
    const secondDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = secondDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated intervention record’s images',
        updatedRecord,
      }],
    });
  },
  async updateInterventionRecordVideo(req, res) {
    const { specificRecord } = req;
    const updatedRecordParams = [
      specificRecord.id, specificRecord.comment, specificRecord.description,
      specificRecord.location, specificRecord.status,
      specificRecord.feedback, specificRecord.images, [req.body.video],
    ];
    const secondDbResponse = await db.sendQuery(queries.updateRecordQuery(), updatedRecordParams);
    const updatedRecord = secondDbResponse.rows[0];
    return res.json({
      status: 200,
      data: [{
        id: specificRecord.id,
        message: 'Updated red-flag record’s video',
        updatedRecord,
      }],
    });
  },
};

export default controller;
