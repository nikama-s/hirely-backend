import { UserInfo } from "../types/auth";

export class UserService {
  static getUserInfo(user: UserInfo | undefined | null) {
    if (user) {
      return {
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin
        },
        isAuthenticated: true
      };
    } else {
      return {
        user: null,
        isAuthenticated: false
      };
    }
  }
}
