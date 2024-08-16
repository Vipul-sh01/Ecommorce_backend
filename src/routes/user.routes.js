import { Router } from "express";
import {registerUser, loginUser,loggOutUser, refreshAcessesToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.midd.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// for logOut loggic secured
router.route("/logout").post(verifyJWT, loggOutUser);
router.route("/Refresh-Token").post(refreshAcessesToken);

export default router;
