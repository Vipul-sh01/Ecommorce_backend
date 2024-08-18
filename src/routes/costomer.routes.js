import { Router } from 'express';
import { otpSend } from '../controllers/costomer.controller.js';

const router = Router();
router.route('/sendOtp').post(otpSend);

export default router;