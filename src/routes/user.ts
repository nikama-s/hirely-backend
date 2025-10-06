import { Router } from "express";
import { checkAuth } from "../middleware/auth";
import { UserController } from "../controllers/userController";

const router = Router();

// Get user endpoint - returns user info if authenticated, null if not
router.get("/get-user", checkAuth, UserController.getUser);

export default router;
