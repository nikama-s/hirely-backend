import session from "express-session";

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || "some-secret-key",
  resave: false,
  saveUninitialized: false,
};

// Create session middleware
export const sessionMiddleware = session(sessionConfig);
