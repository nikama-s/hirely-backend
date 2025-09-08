import { Router } from "express";
import { requireAdmin } from "../middleware/adminAuth";
import { AdminController } from "../controllers/adminController";

const router = Router();

// All admin routes require admin authentication
router.get("/users", requireAdmin, AdminController.getUsers);

export default router;
