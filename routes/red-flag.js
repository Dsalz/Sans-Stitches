import { Router } from 'express';
import recordsController from '../controllers/recordsController';
import validator from '../middleware/validator';

const redFlagRouter = Router();

redFlagRouter.post('/', validator.validateRecord, recordsController.createRedFlagRecord);

export default redFlagRouter;
