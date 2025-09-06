import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include session and isAuthenticated
declare module "express-session" {
  interface SessionData {
    userInfo?: any;
    nonce?: string;
    state?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: boolean;
    }
  }
}

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userInfo) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userInfo) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please log in to access this resource",
    });
  }
  req.isAuthenticated = true;
  next();
};

export { checkAuth, requireAuth };
