import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { email, password, isAdmin } = req.body;
      const token = await AuthService.register({
        email,
        password,
        isAdmin
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
        path: "/"
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login({ email, password });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
        path: "/"
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  static logout = (req: Request, res: Response) => {
    res.clearCookie("token", { path: "/" });
    res.json({ message: "Logged out successfully" });
  };

  static me = (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  };
}
