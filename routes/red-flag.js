import { Router } from 'express';
import recordsController from '../controllers/recordsController';
import validator from '../middleware/validator';
import tokenizer from '../middleware/tokenizer';

const redFlagRouter = Router();

redFlagRouter.post('/', tokenizer.verifyToken, validator.validateRecord, recordsController.createRedFlagRecord);
redFlagRouter.delete('/:id', tokenizer.verifyToken, recordsController.deleteRedFlagRecord);

export default redFlagRouter;
