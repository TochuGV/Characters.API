import { Router } from "express";
import { authController } from "../container/index.js";

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh', authController.refreshUserToken);

export default router;