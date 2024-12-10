import { Router } from 'express';
import { upload } from '../middlewares/multer.midd.js'; 
import { publishProduct} from '../controllers/product.controller.js'; 
import { verifyJWT } from '../middlewares/auth.midd.js'; 
const router = Router();

router.use(verifyJWT);

router.route('/publish').post(upload.fields([{name: 'productImage', maxCount:1,},],), publishProduct);

export default router;
