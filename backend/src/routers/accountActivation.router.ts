import { Router } from 'express';
import accountActivationRouter from '../controllers/accountActivation.controller';

const router = Router();

router.use('/', accountActivationRouter);

export default router;
