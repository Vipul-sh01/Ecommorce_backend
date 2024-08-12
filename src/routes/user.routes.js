import { Router } from "express";
import { registerUser, loginUser, loggOutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.midd.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/logIn").post(loginUser);
// for logOut loggic
router.route("/logOut").post(verifyJWT, loggOutUser)

export default router;
