export interface CognitoUser {
  email: string;
  username: string;
  userStatus: string;
  enabled: boolean;
  userCreateDate?: Date;
  userLastModifiedDate?: Date;
  lastLoginDate?: Date;
  groups?: string[];
}

export interface CognitoUsersResponse {
  users: CognitoUser[];
  totalCount?: number;
  nextToken?: string;
}
