-- CreateEnum
CREATE TYPE "public"."application_status" AS ENUM ('NOT_APPLIED', 'APPLIED', 'INTERVIEW', 'REJECTED', 'OFFERED', 'ACCEPTED', 'GHOSTED');

-- CreateTable
CREATE TABLE "public"."job_applications" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "status" "public"."application_status" NOT NULL DEFAULT 'APPLIED',
    "dateApplied" TIMESTAMP(3) NOT NULL,
    "jobPostUrl" TEXT,
    "notes" TEXT,
    "salary" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);
