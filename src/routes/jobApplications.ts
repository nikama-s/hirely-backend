import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { JobApplicationController } from "../controllers/jobApplicationController";

const router = Router();

// GET /api/job-applications - Get user's job applications
router.get("/", requireAuth, JobApplicationController.getJobApplications);

// POST /api/job-applications - Create a new job application
router.post("/", requireAuth, JobApplicationController.createJobApplication);

export default router;
