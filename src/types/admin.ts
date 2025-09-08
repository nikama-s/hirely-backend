import { CognitoUser } from "./cognito";

export interface AdminUserResponse {
  users: CognitoUser[];
  totalCount: number;
  nextToken?: string;
  hasMore: boolean;
}
