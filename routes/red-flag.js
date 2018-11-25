import { Router } from 'express';
import recordsController from '../controllers/recordsController';
import validator from '../middleware/validator';
import tokenizer from '../middleware/tokenizer';

const redFlagRouter = Router();

redFlagRouter.post('/', tokenizer.verifyToken, validator.validateRecord, recordsController.createRedFlagRecord);
redFlagRouter.delete('/:id', tokenizer.verifyToken, recordsController.deleteRedFlagRecord);
redFlagRouter.patch('/:id/location', tokenizer.verifyToken, validator.validateGeolocation, recordsController.updateRedFlagRecordLocation);
redFlagRouter.patch('/:id/comment', tokenizer.verifyToken, validator.validateRecord, recordsController.updateRedFlagRecordComment);

export default redFlagRouter;
