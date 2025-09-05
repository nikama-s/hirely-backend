import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./utils/db";
import jobApplicationsRouter from "./routes/jobApplications";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    res.json({ message: "Server running with Prisma", status: "connected" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Database connection error", error: error.message });
  }
});

// API routes
app.use("/api/job-applications", jobApplicationsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
