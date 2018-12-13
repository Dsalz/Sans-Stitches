import { Router } from 'express';
import recordsController from '../controllers/recordsController';
import validator from '../middleware/validator';
import tokenizer from '../middleware/tokenizer';
import upload from '../middleware/uploader';

const interventionRouter = Router();

interventionRouter.get('/mine', tokenizer.verifyToken, recordsController.getMyInterventionRecords);
interventionRouter.get('/:id', validator.validateDbGetParams, recordsController.getInterventionRecord);
interventionRouter.get('/', recordsController.getAllInterventionRecords);
interventionRouter.post('/', tokenizer.verifyToken, validator.validateRecord, recordsController.createInterventionRecord);
interventionRouter.delete('/:id', tokenizer.verifyToken, validator.validateDbDeleteParams, recordsController.deleteInterventionRecord);
interventionRouter.patch('/:id/location', tokenizer.verifyToken, validator.validateGeolocation, validator.validateDbUpdateParams, recordsController.updateInterventionRecordLocation);
interventionRouter.patch('/:id/comment', tokenizer.verifyToken, validator.validateRecord, validator.validateDbUpdateParams, recordsController.updateInterventionRecordComment);
interventionRouter.patch('/:id/status', tokenizer.verifyToken, validator.validateStatus, validator.validateDbUpdateParams, recordsController.updateInterventionRecordStatus);
interventionRouter.patch('/:id/addImages', tokenizer.verifyToken, validator.validateDbUpdateParams, upload.any('files'), recordsController.updateInterventionRecordImages);
interventionRouter.patch('/:id/addVideo', tokenizer.verifyToken, validator.validateDbUpdateParams, recordsController.updateInterventionRecordVideo);

export default interventionRouter;
