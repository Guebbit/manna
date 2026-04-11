import type { ProviderPolicy, SocialProvider } from "./social.types";

const policies: Record<SocialProvider, ProviderPolicy> = {
  linkedin: {
    provider: "linkedin",
    displayName: "LinkedIn",
    authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    apiBaseUrl: "https://api.linkedin.com",
    allowedHosts: ["www.linkedin.com", "api.linkedin.com"],
    defaultScopes: ["openid", "profile"],
    allowedActions: ["read_own_profile", "read_member_profile_if_authorized"],
    docsUrl: "https://learn.microsoft.com/linkedin/shared/authentication",
  },
  x: {
    provider: "x",
    displayName: "X",
    authorizeUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.x.com/2/oauth2/token",
    apiBaseUrl: "https://api.x.com",
    allowedHosts: ["twitter.com", "api.x.com"],
    defaultScopes: ["users.read", "tweet.read", "offline.access"],
    allowedActions: ["read_own_profile", "read_public_profile_by_username"],
    docsUrl: "https://docs.x.com/resources/fundamentals/authentication/oauth-2-0",
  },
  github: {
    provider: "github",
    displayName: "GitHub",
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    apiBaseUrl: "https://api.github.com",
    allowedHosts: ["github.com", "api.github.com"],
    defaultScopes: ["read:user"],
    allowedActions: ["read_own_profile", "read_public_profile_by_username"],
    docsUrl: "https://docs.github.com/apps/oauth-apps/building-oauth-apps",
  },
};

export const SOCIAL_PROVIDER_POLICIES = policies;

export function isSocialProvider(value: string): value is SocialProvider {
  return value in policies;
}

export function getProviderPolicy(provider: SocialProvider): ProviderPolicy {
  return policies[provider];
}

export function getClientId(provider: SocialProvider): string {
  const key = `SOCIAL_${provider.toUpperCase()}_CLIENT_ID`;
  return process.env[key]?.trim() ?? "";
}

export function getClientSecret(provider: SocialProvider): string {
  const key = `SOCIAL_${provider.toUpperCase()}_CLIENT_SECRET`;
  return process.env[key]?.trim() ?? "";
}

export function getDefaultRedirectUri(provider: SocialProvider): string {
  const key = `SOCIAL_${provider.toUpperCase()}_REDIRECT_URI`;
  return process.env[key]?.trim() ?? "";
}

