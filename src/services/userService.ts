import { transformCognitoUser } from "../utils/userTransform";

export class UserService {
  static getUserInfo(sessionUserInfo: any) {
    if (sessionUserInfo) {
      return {
        user: transformCognitoUser(sessionUserInfo),
        isAuthenticated: true,
      };
    } else {
      return {
        user: null,
        isAuthenticated: false,
      };
    }
  }

  static getUserIdFromSession(sessionUserInfo: any): string | null {
    return sessionUserInfo?.sub || null;
  }
}
