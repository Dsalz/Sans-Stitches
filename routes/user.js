import { Router } from 'express';
import validator from '../middleware/validator';
import userController from '../controllers/userController';


const router = Router();

router.post('/signup', validator.validateUserSignUp, userController.signUpUser);
router.post('/login', validator.validateUserLogin, userController.loginUser);

export default router;
