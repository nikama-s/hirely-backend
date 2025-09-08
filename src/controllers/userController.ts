import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  // Get user endpoint - returns user info if authenticated, null if not
  static getUser = (req: Request, res: Response) => {
    const userInfo = UserService.getUserInfo(req.session.userInfo);
    res.json(userInfo);
  };
}
