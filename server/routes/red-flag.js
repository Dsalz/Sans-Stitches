import { Router } from 'express';
import recordsController from '../controllers/recordsController';
import validator from '../middleware/validator';
import tokenizer from '../middleware/tokenizer';

const redFlagRouter = Router();

redFlagRouter.get('/:id', validator.validateDbGetParams, recordsController.getRedFlagRecord);
redFlagRouter.get('/', recordsController.getAllRedFlagRecords);
redFlagRouter.post('/', tokenizer.verifyToken, validator.validateRecord, recordsController.createRedFlagRecord);
redFlagRouter.delete('/:id', tokenizer.verifyToken, validator.validateDbDeleteParams, recordsController.deleteRedFlagRecord);
redFlagRouter.patch('/:id/location', tokenizer.verifyToken, validator.validateGeolocation, validator.validateDbUpdateParams, recordsController.updateRedFlagRecordLocation);
redFlagRouter.patch('/:id/comment', tokenizer.verifyToken, validator.validateRecord, validator.validateDbUpdateParams, recordsController.updateRedFlagRecordComment);
redFlagRouter.patch('/:id/status', tokenizer.verifyToken, validator.validateStatus, validator.validateDbUpdateParams, recordsController.updateRedFlagRecordStatus);

export default redFlagRouter;
