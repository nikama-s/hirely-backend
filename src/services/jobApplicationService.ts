import { prisma } from "../utils/db";
import { createJobApplicationSchema } from "../schemas/jobApplication";

export class JobApplicationService {
  static async getUserJobApplications(userId: string) {
    return await prisma.jobApplication.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        dateApplied: "desc",
      },
    });
  }

  static async createJobApplication(userId: string, applicationData: any) {
    // Validate request body with Zod
    const validationResult =
      createJobApplicationSchema.safeParse(applicationData);

    if (!validationResult.success) {
      throw {
        status: 400,
        message: "Validation failed",
        errors: validationResult.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
    }

    const validatedData = validationResult.data;

    return await prisma.jobApplication.create({
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
  }
}
