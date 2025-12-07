import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { AnalyticsController } from "../controllers/analyticsController";

const router = Router();

// GET /api/analytics - Get user's analytics data
router.get("/", requireAuth, AnalyticsController.getAnalytics);

export default router;
