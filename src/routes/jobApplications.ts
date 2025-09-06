import { Router } from "express";
import { prisma } from "../utils/db";
import { createJobApplicationSchema } from "../schemas/jobApplication";

const router = Router();

// GET /api/job-applications - Get all job applications
router.get("/", async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
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
router.post("/", async (req, res) => {
  try {
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
