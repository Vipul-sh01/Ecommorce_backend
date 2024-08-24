import { Router } from 'express';
import { addCategory } from "../controllers/category.contrller.js"
import { verifyJWT } from '../middlewares/auth.midd.js'; 
const router = Router();

// router.use(verifyJWT);

router.route("/addCategory").post(verifyJWT, addCategory);

export default router;
