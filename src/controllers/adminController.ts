import { Request, Response } from "express";
import { AdminService } from "../services/adminService";

export class AdminController {
  // Get users endpoint
  static getUsers = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const nextToken = req.query.nextToken as string;

      const result = await AdminService.getUsers(limit, nextToken);
      res.json(result);
    } catch (error: any) {
      console.error("Error in AdminController.getUsers:", error);
      res.status(500).json({
        error: "Failed to fetch users",
        message: error.message || "Internal server error",
      });
    }
  };
}
