import { Request, Response } from "express";
import { AdminAnalyticsService } from "../services/adminAnalyticsService";

export class AdminAnalyticsController {
  static async getAdminAnalytics(req: Request, res: Response) {
    try {
      const analytics = await AdminAnalyticsService.getAdminAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
      res.status(500).json({
        error: "Failed to fetch admin analytics"
      });
    }
  }
}

