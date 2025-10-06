import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { JobApplicationService } from "../services/jobApplicationService";

export class JobApplicationController {
  // GET /api/job-applications - Get user's job applications
  static getJobApplications = async (req: Request, res: Response) => {
    try {
      const userId = UserService.getUserIdFromSession(req.session.userInfo);
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in session" });
      }

      const applications = await JobApplicationService.getUserJobApplications(
        userId
      );
      res.json(applications);
    } catch (error: unknown) {
      res.status(500).json({
        message: "Failed to fetch job applications",
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch job applications",
      });
    }
  };

  // POST /api/job-applications - Create a new job application
  static createJobApplication = async (req: Request, res: Response) => {
    try {
      const userId = UserService.getUserIdFromSession(req.session.userInfo);
      if (!userId) {
        return res.status(401).json({ error: "User ID not found in session" });
      }

      const application = await JobApplicationService.createJobApplication(
        userId,
        req.body
      );
      res.status(201).json(application);
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({
          message: error.message,
          errors: error.errors,
        });
      }

      res.status(500).json({
        message: "Failed to create job application",
        error:
          error instanceof Error
            ? error.message
            : "Failed to create job application",
      });
    }
  };
}
