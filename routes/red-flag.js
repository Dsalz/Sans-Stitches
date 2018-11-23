import { Router } from 'express';
import recordsController from '../controllers/recordsController'

const redFlagRouter = Router();


redFlagRouter.post('/',  recordsController.createRedFlagRecord);