import { Router } from "express";
import { requireAdmin } from "../middleware/adminAuth";
import { requireAuth } from "../middleware/auth"; // Import requireAuth
import { AdminController } from "../controllers/adminController";
import { AdminAnalyticsController } from "../controllers/adminAnalyticsController";

const router = Router();

// All admin routes require admin authentication
// First, ensure the user is authenticated (populates req.user), THEN check admin status
router.get("/users", requireAuth, requireAdmin, AdminController.getUsers);
router.get(
  "/analytics",
  requireAuth,
  requireAdmin,
  AdminAnalyticsController.getAdminAnalytics
);

export default router;
