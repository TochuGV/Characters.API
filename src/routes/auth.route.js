import { Router } from "express";
import { authController } from "../container/index.js";

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

export default router;