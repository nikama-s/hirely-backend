import { Issuer, Client } from "openid-client";
import { AuthConfig } from "../types/auth";

export class AuthClient {
  private client: Client | null = null;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      const issuer = await Issuer.discover(this.config.issuerUrl);
      this.client = new issuer.Client({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uris: [this.config.redirectUri],
        response_types: this.config.responseTypes,
      });
      console.log("Auth client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize auth client:", error);
      throw error;
    }
  }

  getClient(): Client {
    if (!this.client) {
      throw new Error("Auth client not initialized. Call initialize() first.");
    }
    return this.client;
  }

  isInitialized(): boolean {
    return this.client !== null;
  }
}

// Create auth client instance with environment variables
export const authClient = new AuthClient({
  issuerUrl: process.env.COGNITO_ISSUER_URL || "",
  clientId: process.env.COGNITO_CLIENT_ID || "",
  clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
  redirectUri: process.env.COGNITO_REDIRECT_URI || "",
  responseTypes: ["code"],
});
