export interface UserInfo {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface JwtPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}
