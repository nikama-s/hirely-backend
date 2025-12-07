import { Router } from "express";
import { requireAdmin } from "../middleware/adminAuth";
import { requireAuth } from "../middleware/auth"; // Import requireAuth
import { AdminController } from "../controllers/adminController";
import { AdminAnalyticsController } from "../controllers/adminAnalyticsController";
import { AnalyticsController } from "../controllers/analyticsController";

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
router.get(
  "/users/:userId/analytics",
  requireAuth,
  requireAdmin,
  AnalyticsController.getUserAnalytics
);

export default router;
