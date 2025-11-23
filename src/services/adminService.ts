import { prisma } from "../utils/db";
import { AdminUserResponse } from "../types/admin";

export class AdminService {
  static async getUsers(
    limit: number = 50,
    cursor?: string
  ): Promise<AdminUserResponse> {
    try {
      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          take: limit,
          ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true
          }
        }),
        prisma.user.count(),
      ]);

      const nextCursor = users.length === limit ? users[users.length - 1].id : undefined;

      return {
        users: users,
        totalCount: totalCount,
        nextToken: nextCursor,
        hasMore: !!nextCursor,
      };
    } catch (error) {
      console.error("Error in AdminService.getUsers:", error);
      throw error;
    }
  }
}
