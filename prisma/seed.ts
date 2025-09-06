import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create sample job applications
  const applications = [
    {
      company: "Google",
      jobTitle: "Software Engineer",
      status: "APPLIED" as const,
      dateApplied: new Date("2024-01-15"),
      jobPostUrl: "https://careers.google.com/jobs/results/123456",
      notes: "Applied through referral from John",
      salary_from: 120000,
      salary_to: 150000,
      location: "Mountain View, CA",
    },
    {
      company: "Microsoft",
      jobTitle: "Frontend Developer",
      status: "INTERVIEW" as const,
      dateApplied: new Date("2024-01-10"),
      jobPostUrl: "https://careers.microsoft.com/jobs/789012",
      notes: "Phone interview scheduled for next week",
      salary_from: 100000,
      salary_to: 130000,
      location: "Seattle, WA",
    },
    {
      company: "Apple",
      jobTitle: "iOS Developer",
      status: "REJECTED" as const,
      dateApplied: new Date("2024-01-05"),
      jobPostUrl: "https://jobs.apple.com/345678",
      notes: "Not enough experience with SwiftUI",
      salary_from: 110000,
      salary_to: 140000,
      location: "Cupertino, CA",
    },
    {
      company: "Netflix",
      jobTitle: "Full Stack Engineer",
      status: "OFFERED" as const,
      dateApplied: new Date("2023-12-20"),
      jobPostUrl: "https://jobs.netflix.com/901234",
      notes: "Great culture fit, considering the offer",
      salary_from: 130000,
      salary_to: 160000,
      location: "Los Gatos, CA",
    },
    {
      company: "Meta",
      jobTitle: "React Developer",
      status: "NOT_APPLIED" as const,
      dateApplied: new Date("2024-01-20"),
      jobPostUrl: "https://careers.meta.com/567890",
      notes: "Found this job posting, need to apply",
      salary_from: 115000,
      salary_to: 145000,
      location: "Menlo Park, CA",
    },
    {
      company: "Amazon",
      jobTitle: "Backend Engineer",
      status: "GHOSTED" as const,
      dateApplied: new Date("2023-12-01"),
      jobPostUrl: "https://amazon.jobs/234567",
      notes: "Applied 2 months ago, no response",
      salary_from: 105000,
      salary_to: 135000,
      location: "Seattle, WA",
    },
  ];

  for (const app of applications) {
    await prisma.jobApplication.create({
      data: app,
    });
  }

  console.log("Created sample job applications");
  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
