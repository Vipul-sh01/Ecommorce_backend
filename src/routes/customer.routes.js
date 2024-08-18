import { Router } from 'express';
import { otpSend, otpVerify } from '../controllers/customer.controller.js';

const router = Router();
router.route('/sendOtp').post(otpSend);
router.route('/otpVerify').post(otpVerify);

export default router;