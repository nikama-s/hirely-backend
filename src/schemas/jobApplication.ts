import { z } from "zod";
import { ApplicationStatus } from "../generated/prisma";

const ApplicationStatusEnum = z.enum(ApplicationStatus);

// Schema for creating a job application
export const createJobApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  status: ApplicationStatusEnum.optional().default("APPLIED"),
  dateApplied: z.iso.datetime("Invalid date format").or(z.date()).optional(),
  jobPostUrl: z.url("Invalid URL format").optional().or(z.literal("")),
  notes: z.string().optional(),
  salary: z.string().optional(),
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
