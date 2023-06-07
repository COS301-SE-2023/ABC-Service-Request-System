import { Router } from 'express';
import signupUserRouter from '../controllers/signup.controller';

const router = Router();

router.use('/', signupUserRouter);

export default router;
