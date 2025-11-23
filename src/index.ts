import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { prisma } from "./utils/db";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import jobApplicationsRouter from "./routes/jobApplications";
import adminRouter from "./routes/admin";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    res.json({ message: "Server running with Prisma", status: "connected" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Database connection error", error: error.message });
  }
});

// Routes
app.use("/", authRouter);
app.use("/api/user", userRouter);
app.use("/api/job-applications", jobApplicationsRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
