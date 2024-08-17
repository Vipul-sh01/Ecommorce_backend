import { Router } from 'express';
import { upload } from '../middlewares/multer.midd.js'; 
import { publishProduct } from '../controllers/product.controller.js'; 
import { verifyJWT } from '../middlewares/auth.midd.js'; 
const router = Router();

router.use(verifyJWT);

// Route to publish a product
// router.post('/publish', upload.fields([{ name: 'productImage',maxCount: 1,},]), publishProduct);
router.route('/publish').post(upload.fields([{name: 'productImage', maxCount:1,},],), publishProduct);
// router.route("/logout").post(verifyJWT, loggOutUser);

export default router;
