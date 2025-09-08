export interface AuthConfig {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  responseTypes: string[];
}

export interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  isAdmin: boolean;
  [key: string]: any;
}
