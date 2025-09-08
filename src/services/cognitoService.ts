import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  DescribeUserPoolCommand,
  AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoUser, CognitoUsersResponse } from "../types/cognito";

export class CognitoService {
  private static userPoolId = process.env.COGNITO_USER_POOL_ID;
  private static region = process.env.AWS_REGION || "eu-central-1";

  static async getUsers(
    limit: number = 50,
    paginationToken?: string
  ): Promise<CognitoUsersResponse> {
    try {
      const client = new CognitoIdentityProviderClient({ region: this.region });
      const command = new ListUsersCommand({
        UserPoolId: this.userPoolId,
        Limit: limit,
        PaginationToken: paginationToken,
      });

      const response = await client.send(command);

      return {
        users: this.formatUsers(response.Users || []),
        totalCount: response.Users?.length,
        nextToken: response.PaginationToken,
      };
    } catch (error) {
      console.error("Error fetching users from Cognito:", error);
      throw new Error("Failed to fetch users from Cognito");
    }
  }

  static async getUserCount(): Promise<number> {
    try {
      const client = new CognitoIdentityProviderClient({ region: this.region });
      const command = new DescribeUserPoolCommand({
        UserPoolId: this.userPoolId,
      });

      const response = await client.send(command);
      return response.UserPool?.EstimatedNumberOfUsers || 0;
    } catch (error) {
      console.error("Error getting user count from Cognito:", error);
      throw new Error("Failed to get user count from Cognito");
    }
  }

  static async getUserGroups(username: string): Promise<string[]> {
    try {
      const client = new CognitoIdentityProviderClient({ region: this.region });
      const command = new AdminListGroupsForUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      const response = await client.send(command);
      return response.Groups?.map((group) => group.GroupName || "") || [];
    } catch (error) {
      console.error("Error getting user groups from Cognito:", error);
      return [];
    }
  }

  private static formatUsers(cognitoUsers: any[]): CognitoUser[] {
    return cognitoUsers.map((user) => ({
      email:
        user.Attributes?.find((attr: any) => attr.Name === "email")?.Value ||
        "",
      username: user.Username || "",
      userStatus: user.UserStatus || "",
      enabled: user.Enabled || false,
      userCreateDate: user.UserCreateDate,
      userLastModifiedDate: user.UserLastModifiedDate,
    }));
  }
}
