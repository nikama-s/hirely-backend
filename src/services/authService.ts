import { authClient } from "../utils/auth";

export class AuthService {
  static async handleCallback(params: any, nonce: string, state: string) {
    const client = authClient.getClient();
    const tokenSet = await client.callback(
      process.env.COGNITO_REDIRECT_URI || "",
      params,
      { nonce, state }
    );

    const userInfo = await client.userinfo(tokenSet.access_token!);
    return userInfo;
  }

  static generateAuthUrl(nonce: string, state: string) {
    const client = authClient.getClient();
    return client.authorizationUrl({
      scope: "email openid phone",
      state: state,
      nonce: nonce,
    });
  }

  static getLogoutUrl() {
    return process.env.COGNITO_LOGOUT_URL || "";
  }

  static getFrontendUrl() {
    return process.env.FRONTEND_URL || "http://localhost:3000";
  }
}
