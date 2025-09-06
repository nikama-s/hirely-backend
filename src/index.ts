import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./utils/db";
import { authClient } from "./utils/auth";
import { sessionMiddleware } from "./utils/session";
import authRouter from "./routes/auth";
import jobApplicationsRouter from "./routes/jobApplications";

dotenv.config();

const app = express();

// Session middleware
app.use(sessionMiddleware);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
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
app.use("/api/job-applications", jobApplicationsRouter);

const PORT = process.env.PORT || 5000;

// Start server after auth client is initialized
async function startServer() {
  try {
    await authClient.initialize();
    console.log("Auth client initialized successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize auth client:", error);
    process.exit(1);
  }
}

startServer();
