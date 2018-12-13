import { Router } from 'express';
import recordsController from '../controllers/recordsController';
import validator from '../middleware/validator';
import tokenizer from '../middleware/tokenizer';
import upload from '../middleware/uploader';

const redFlagRouter = Router();

redFlagRouter.get('/mine', tokenizer.verifyToken, recordsController.getMyRedFlagRecords);
redFlagRouter.get('/:id', validator.validateDbGetParams, recordsController.getRedFlagRecord);
redFlagRouter.get('/', recordsController.getAllRedFlagRecords);
redFlagRouter.post('/', tokenizer.verifyToken, validator.validateRecord, recordsController.createRedFlagRecord);
redFlagRouter.delete('/:id', tokenizer.verifyToken, validator.validateDbDeleteParams, recordsController.deleteRedFlagRecord);
redFlagRouter.patch('/:id/location', tokenizer.verifyToken, validator.validateGeolocation, validator.validateDbUpdateParams, recordsController.updateRedFlagRecordLocation);
redFlagRouter.patch('/:id/comment', tokenizer.verifyToken, validator.validateRecord, validator.validateDbUpdateParams, recordsController.updateRedFlagRecordComment);
redFlagRouter.patch('/:id/status', tokenizer.verifyToken, validator.validateStatus, validator.validateDbUpdateParams, recordsController.updateRedFlagRecordStatus);
redFlagRouter.patch('/:id/addImages', tokenizer.verifyToken, validator.validateDbUpdateParams, upload.any('files'), recordsController.updateRedFlagRecordImages);
redFlagRouter.patch('/:id/addVideo', tokenizer.verifyToken, validator.validateDbUpdateParams, recordsController.updateRedFlagRecordVideo);


export default redFlagRouter;
