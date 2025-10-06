import { UserInfo } from "../types/auth";

export function transformCognitoUser(cognitoUserInfo: any): UserInfo {
  return {
    sub: cognitoUserInfo.sub,
    email: cognitoUserInfo.email,
    name: cognitoUserInfo.name,
    isAdmin: cognitoUserInfo.isAdmin || false,
    ...cognitoUserInfo,
  };
}
