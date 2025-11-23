import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated?: boolean;
    }
  }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
      req.isAuthenticated = true;
    } catch (err) {
      req.isAuthenticated = false;
      req.user = null;
    }
  } else {
    req.isAuthenticated = false;
    req.user = null;
  }
  next();
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please log in to access this resource"
    });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    req.isAuthenticated = true;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
      message: "Please log in again"
    });
  }
};
