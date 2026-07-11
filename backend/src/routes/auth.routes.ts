import { Router } from 'express';
import { register, login, getMe, updateProfile, logoutUser } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validators/auth.validator';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logoutUser);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);

export default router;