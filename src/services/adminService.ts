import { CognitoService } from "./cognitoService";
import { AdminUserResponse } from "../types/admin";

export class AdminService {
  static async getUsers(
    limit: number = 50,
    nextToken?: string
  ): Promise<AdminUserResponse> {
    try {
      const [result, totalCount] = await Promise.all([
        CognitoService.getUsers(limit, nextToken),
        CognitoService.getUserCount(),
      ]);

      return {
        users: result.users,
        totalCount: totalCount,
        nextToken: result.nextToken,
        hasMore: !!result.nextToken,
      };
    } catch (error) {
      console.error("Error in AdminService.getUsers:", error);
      throw error;
    }
  }
}
