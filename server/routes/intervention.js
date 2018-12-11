import { Router } from 'express';
import recordsController from '../controllers/recordsController';
import validator from '../middleware/validator';
import tokenizer from '../middleware/tokenizer';

const interventionRouter = Router();

interventionRouter.get('/:id', validator.validateDbGetParams, recordsController.getInterventionRecord);
interventionRouter.get('/', recordsController.getAllInterventionRecords);
interventionRouter.post('/', tokenizer.verifyToken, validator.validateRecord, recordsController.createInterventionRecord);
interventionRouter.delete('/:id', tokenizer.verifyToken, validator.validateDbDeleteParams, recordsController.deleteInterventionRecord);
interventionRouter.patch('/:id/location', tokenizer.verifyToken, validator.validateGeolocation, validator.validateDbUpdateParams, recordsController.updateInterventionRecordLocation);
interventionRouter.patch('/:id/comment', tokenizer.verifyToken, validator.validateRecord, validator.validateDbUpdateParams, recordsController.updateInterventionRecordComment);
interventionRouter.patch('/:id/status', tokenizer.verifyToken, validator.validateStatus, validator.validateDbUpdateParams, recordsController.updateInterventionRecordStatus);

export default interventionRouter;
