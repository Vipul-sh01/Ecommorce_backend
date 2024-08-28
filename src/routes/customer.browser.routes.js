import { Router } from "express";
import {getAllProduct, searchProducts} from "../controllers/customer.browser.product.js"
import { verifyJwt } from "../middlewares/customer.auth.middlewares.js";
const router = Router();

router.route('/getAllProduct').get(verifyJwt, getAllProduct);
router.route('/search').get(verifyJwt, searchProducts);
export default router;
