import express from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validation.js';
import { signupSchema, signinSchema } from '../../validators/auth.validation.js';

const router = express.Router();

router.post('/sign-up', validate(signupSchema), authController.signup);
router.post('/sign-in', validate(signinSchema), authController.signin);

export default router;