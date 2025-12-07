import { Request, Response } from "express";
import { AnalyticsService } from "../services/analyticsService";

export class AnalyticsController {
  static getAnalytics = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const analytics = await AnalyticsService.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error: unknown) {
      res.status(500).json({
        message: "Failed to fetch analytics",
        error:
          error instanceof Error ? error.message : "Failed to fetch analytics"
      });
    }
  };

  static getUserAnalytics = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const analytics = await AnalyticsService.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error: unknown) {
      res.status(500).json({
        message: "Failed to fetch user analytics",
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user analytics"
      });
    }
  };
}
