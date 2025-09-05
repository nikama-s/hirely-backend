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
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch job applications",
      error: error.message,
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
        dateApplied: new Date(validatedData.dateApplied),
        jobPostUrl: validatedData.jobPostUrl,
        notes: validatedData.notes,
        salary: validatedData.salary,
        location: validatedData.location,
      },
    });

    res.status(201).json(application);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to create job application",
      error: error.message,
    });
  }
});

export default router;
