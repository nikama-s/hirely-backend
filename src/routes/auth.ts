import { Router } from "express";
import { generators } from "openid-client";
import { authClient } from "../utils/auth";
import { checkAuth } from "../middleware/auth";

const router = Router();

// Home route with authentication check
router.get("/", checkAuth, (req, res) => {
  res.json({
    message: "Welcome to Hirely API",
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo,
    loginUrl: "/login",
    logoutUrl: "/logout",
  });
});

// Login route
router.get("/login", (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const client = authClient.getClient();
  const authUrl = client.authorizationUrl({
    scope: "email openid phone",
    state: state,
    nonce: nonce,
  });

  res.redirect(authUrl);
});

// Callback route
router.get("/api/auth/callback", async (req, res) => {
  try {
    const client = authClient.getClient();
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      process.env.COGNITO_REDIRECT_URI || "",
      params,
      {
        nonce: req.session.nonce,
        state: req.session.state,
      }
    );

    const userInfo = await client.userinfo(tokenSet.access_token!);
    req.session.userInfo = userInfo;

    // TODO: Put in env too
    res.redirect(
      `${process.env.FRONTEND_URL}/applications` ||
        "http://localhost:3000/applications"
    );
  } catch (err) {
    console.error("Callback error:", err);
    res.redirect(`${process.env.FRONTEND_URL}` || "http://localhost:3000");
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
    }
  });

  const logoutUrl = process.env.COGNITO_LOGOUT_URL || "";
  res.redirect(logoutUrl);
});

router.get("/api/auth/logout", (req, res) => {
  res.redirect(process.env.FRONTEND_URL || "http://localhost:3000");
});

export default router;
