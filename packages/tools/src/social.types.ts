export type SocialProvider = "linkedin" | "x" | "github";

export interface ProviderPolicy {
  provider: SocialProvider;
  displayName: string;
  authorizeUrl: string;
  tokenUrl: string;
  apiBaseUrl: string;
  allowedHosts: readonly string[];
  defaultScopes: readonly string[];
  allowedActions: readonly string[];
  docsUrl: string;
}

export interface SocialTokenRecord {
  accessToken: string;
  refreshToken?: string;
  scopes: string[];
  connectedAt: string;
  expiresAt?: string;
  accountId?: string;
}

