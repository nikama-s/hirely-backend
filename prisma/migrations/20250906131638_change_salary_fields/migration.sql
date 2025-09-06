/*
  Warnings:

  - You are about to drop the column `salary` on the `job_applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."job_applications" DROP COLUMN "salary",
ADD COLUMN     "salary_from" INTEGER,
ADD COLUMN     "salary_to" INTEGER;
