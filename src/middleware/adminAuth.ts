import { Request, Response, NextFunction } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated
  if (!req.session.userInfo) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please log in to access this resource",
    });
  }

  // Check if user is admin (stored in session)
  if (!req.session.userInfo.isAdmin) {
    return res.status(403).json({
      error: "Admin access required",
      message: "You do not have permission to access this resource",
    });
  }

  // User is authenticated and has admin access
  next();
};

export { requireAdmin };
