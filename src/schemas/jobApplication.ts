import { z } from "zod";

export enum ApplicationStatus {
  NOT_APPLIED = "NOT_APPLIED",
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  REJECTED = "REJECTED",
  OFFERED = "OFFERED",
  ACCEPTED = "ACCEPTED",
  GHOSTED = "GHOSTED",
}

const ApplicationStatusEnum = z.enum(ApplicationStatus);

// Schema for creating a job application
export const createJobApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  status: ApplicationStatusEnum.optional().default(ApplicationStatus.APPLIED),
  dateApplied: z.iso.datetime("Invalid date format").or(z.date()).optional(),
  jobPostUrl: z.url("Invalid URL format").optional().or(z.literal("")),
  notes: z.string().optional(),
  salary_from: z.number().optional(),
  salary_to: z.number().optional(),
  location: z.string().optional(),
});

// Schema for updating a job application (all fields optional)
export const updateJobApplicationSchema = createJobApplicationSchema.partial();

// Type inference from schema
export type CreateJobApplicationInput = z.infer<
  typeof createJobApplicationSchema
>;
export type UpdateJobApplicationInput = z.infer<
  typeof updateJobApplicationSchema
>;
