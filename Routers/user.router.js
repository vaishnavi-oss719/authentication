import express from 'express';
import {
    loginUser,
    registerUser,
    getUser,
    forgotPassword,
    verifyResetToken,
    resetPassword,
} from '../Controllers/user.controller.js';
import authMiddleware from '../Middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getuser', authMiddleware, getUser);

router.post('/forgot-password', forgotPassword);
router.get('/reset-password/verify/:token', verifyResetToken);
router.post('/reset-password', resetPassword);

export default router;