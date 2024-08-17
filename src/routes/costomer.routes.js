import { Router } from 'express';
import { otpSend } from '../controllers/costomer.controller.js';

const router = Router();
router.route('/sendOtp').get(otpSend);

export default router;