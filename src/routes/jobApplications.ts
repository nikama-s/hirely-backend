import { Router } from "express";
import { prisma } from "../utils/db";
import { createJobApplicationSchema } from "../schemas/jobApplication";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET /api/job-applications - Get user's job applications
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userInfo?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in session" });
    }

    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        dateApplied: "desc",
      },
    });
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
});

// POST /api/job-applications - Create a new job application
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userInfo?.sub;
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in session" });
    }

    // Validate request body with Zod
    const validationResult = createJobApplicationSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const validatedData = validationResult.data;

    const application = await prisma.jobApplication.create({
      data: {
        userId: userId,
        company: validatedData.company,
        jobTitle: validatedData.jobTitle,
        status: validatedData.status,
        dateApplied: validatedData.dateApplied
          ? new Date(validatedData.dateApplied)
          : undefined,
        jobPostUrl: validatedData.jobPostUrl,
        notes: validatedData.notes,
        salary_from: validatedData.salary_from,
        salary_to: validatedData.salary_to,
        location: validatedData.location,
      },
    });

    res.status(201).json(application);
  } catch (error: unknown) {
    res.status(500).json({
      message: "Failed to create job application",
      error:
        error instanceof Error
          ? error.message
          : "Failed to create job application",
    });
  }
});

export default router;
