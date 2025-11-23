export interface AdminUser {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserResponse {
  users: AdminUser[];
  totalCount: number;
  nextToken?: string;
  hasMore: boolean;
}
