import { Router } from 'express';
import { RegisterController } from '../controllers/RegisterController'
import { LoginController } from '../controllers/LoginController';

const router = Router();

router.post('/register', RegisterController);
router.post('/login', LoginController);

export default router;
