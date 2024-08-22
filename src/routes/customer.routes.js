import { Router } from 'express';
import { verifyJwt } from '../middlewares/customer.auth.middlewares.js';
import { otpSend, otpVerify, customerlogOut} from '../controllers/customer.controller.js';

const router = Router();
router.route('/sendOtp').post(otpSend);
router.route('/otpVerify').post(otpVerify);

// for logOut loggic secured
router.route('/Customer-logOut').post(verifyJwt, customerlogOut);

export default router;