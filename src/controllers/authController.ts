import { Request, Response } from "express";
import { generators } from "openid-client";
import { authClient } from "../utils/auth";
import { AuthService } from "../services/authService";
import { CognitoService } from "../services/cognitoService";

export class AuthController {
  // Home route with authentication check
  static getHome = (req: Request, res: Response) => {
    res.json({
      message: "Welcome to Hirely API",
      isAuthenticated: req.isAuthenticated,
      userInfo: req.session.userInfo,
      loginUrl: "/login",
      logoutUrl: "/logout",
    });
  };

  // Login route
  static login = (req: Request, res: Response) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = AuthService.generateAuthUrl(nonce, state);
    res.redirect(authUrl);
  };

  // Callback route
  static callback = async (req: Request, res: Response) => {
    try {
      const client = authClient.getClient();
      const params = client.callbackParams(req);

      const userInfo = await AuthService.handleCallback(
        params,
        req.session.nonce!,
        req.session.state!
      );

      // Fetch user groups to determine admin status
      const userGroups = await CognitoService.getUserGroups(userInfo.sub);
      const isAdmin = userGroups.includes("admin");

      req.session.userInfo = {
        ...userInfo,
        isAdmin,
      };

      const frontendUrl = AuthService.getFrontendUrl();
      res.redirect(`${frontendUrl}/applications`);
    } catch (err) {
      console.error("Callback error:", err);
      const frontendUrl = AuthService.getFrontendUrl();
      res.redirect(frontendUrl);
    }
  };

  // Logout route
  static logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
    });

    const logoutUrl = AuthService.getLogoutUrl();
    res.redirect(logoutUrl);
  };

  // API logout route
  static apiLogout = (req: Request, res: Response) => {
    const frontendUrl = AuthService.getFrontendUrl();
    res.redirect(frontendUrl);
  };
}
