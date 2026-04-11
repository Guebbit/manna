import crypto from "crypto";
import type { SocialProvider, SocialTokenRecord } from "./social.types";
import { SOCIAL_PROVIDER_POLICIES } from "./social.providers";

interface OAuthStateRecord {
  provider: SocialProvider;
  redirectUri: string;
  createdAt: number;
}

const STATE_TTL_MS = 10 * 60 * 1000;

const oauthStates = new Map<string, OAuthStateRecord>();
const socialTokens = new Map<SocialProvider, SocialTokenRecord>();

function nowMs(): number {
  return Date.now();
}

export function issueOAuthState(
  provider: SocialProvider,
  redirectUri: string
): string {
  const state = crypto.randomUUID();
  oauthStates.set(state, { provider, redirectUri, createdAt: nowMs() });
  return state;
}

export function consumeOAuthState(
  state: string,
  expectedProvider: SocialProvider
): OAuthStateRecord {
  const record = oauthStates.get(state);
  oauthStates.delete(state);

  if (!record) {
    throw new Error("Invalid OAuth state.");
  }

  if (record.provider !== expectedProvider) {
    throw new Error("OAuth state/provider mismatch.");
  }

  if (nowMs() - record.createdAt > STATE_TTL_MS) {
    throw new Error("OAuth state expired.");
  }

  return record;
}

export function setToken(
  provider: SocialProvider,
  token: SocialTokenRecord
): void {
  socialTokens.set(provider, token);
}

export function getToken(provider: SocialProvider): SocialTokenRecord | undefined {
  return socialTokens.get(provider);
}

export function hasConnectedToken(provider: SocialProvider): boolean {
  return socialTokens.has(provider);
}

export function unlinkProvider(provider: SocialProvider): void {
  socialTokens.delete(provider);
}

export function getConnectionsSummary(): Array<{
  provider: SocialProvider;
  connected: boolean;
  scopes: string[];
  connectedAt?: string;
  expiresAt?: string;
}> {
  return (Object.keys(SOCIAL_PROVIDER_POLICIES) as SocialProvider[]).map(
    (provider) => {
      const token = socialTokens.get(provider);
      return {
        provider,
        connected: Boolean(token),
        scopes: token?.scopes ?? [],
        connectedAt: token?.connectedAt,
        expiresAt: token?.expiresAt,
      };
    }
  );
}

