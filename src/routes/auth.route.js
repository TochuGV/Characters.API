import { Router } from "express";
import UserService from "../services/user.service.js";
import AuthController from "../controllers/auth.controller.js";

const router = Router();
const userService = new UserService();
const authController = new AuthController(userService);

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

export default router;