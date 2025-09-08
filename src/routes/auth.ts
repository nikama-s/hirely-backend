import { Router } from "express";
import { checkAuth } from "../middleware/auth";
import { AuthController } from "../controllers/authController";

const router = Router();

// Home route with authentication check
router.get("/", checkAuth, AuthController.getHome);

// Login route
router.get("/login", AuthController.login);

// Callback route
router.get("/api/auth/callback", AuthController.callback);

// Logout route
router.get("/logout", AuthController.logout);

// API logout route
router.get("/api/auth/logout", AuthController.apiLogout);

export default router;
