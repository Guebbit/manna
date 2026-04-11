# Tool Guide: Social accounts through AI (OAuth + official APIs)

This repository supports social account usage via dedicated tools:

- `linkedin_profile_lookup`
- `x_profile_lookup`
- `github_profile_lookup`

## Why this design

- Uses official OAuth + provider APIs
- Avoids sharing credentials with the model
- Avoids unsupported private-page scraping
- Enforces provider-level permission checks before tool execution

## Supported providers and allowed actions

- **LinkedIn**: own profile lookup, member lookup only when your app permissions allow it
- **X**: own profile lookup or public profile by username
- **GitHub**: own profile lookup or public profile by username

## OAuth flow (link, use, unlink)

1. **List providers**

```bash
curl http://localhost:3001/auth/providers
```

2. **Start connection**

```bash
curl "http://localhost:3001/auth/linkedin/connect?redirect_uri=http://localhost:3001/auth/linkedin/callback"
```

This returns `authorizationUrl` and `state`.

3. **Approve on provider side**

Open `authorizationUrl` in browser and approve scopes.

4. **Complete callback**

```bash
curl "http://localhost:3001/auth/linkedin/callback?code=YOUR_CODE&state=YOUR_STATE"
```

5. **Check linked accounts**

```bash
curl http://localhost:3001/auth/connections
```

6. **Unlink**

```bash
curl -X DELETE http://localhost:3001/auth/linkedin/connection
```

## Example flow requested in the problem statement

User asks:

> "Find background for John Doe."

Expected agent behavior:

1. Agent picks `linkedin_profile_lookup`
2. Tool checks token for LinkedIn
3. If token exists and scopes are valid, tool calls LinkedIn API and returns profile summary
4. If token is missing, tool returns:
   - `No connected linkedin account. Please connect linkedin via /auth/linkedin/connect first.`

## Environment variables

Set OAuth app credentials in your runtime environment:

- `SOCIAL_LINKEDIN_CLIENT_ID`
- `SOCIAL_LINKEDIN_CLIENT_SECRET`
- `SOCIAL_LINKEDIN_REDIRECT_URI`
- `SOCIAL_X_CLIENT_ID`
- `SOCIAL_X_CLIENT_SECRET`
- `SOCIAL_X_REDIRECT_URI`
- `SOCIAL_X_CODE_CHALLENGE`
- `SOCIAL_X_CODE_VERIFIER`
- `SOCIAL_GITHUB_CLIENT_ID`
- `SOCIAL_GITHUB_CLIENT_SECRET`
- `SOCIAL_GITHUB_REDIRECT_URI`
- `SOCIAL_RATE_LIMIT_MS` (optional, default `1000`)

## Security and policy guards

- Tokens are stored in process memory only and never returned by API
- Social tools refuse execution when provider account is not linked
- Requests are restricted to known provider hosts
- Basic email/phone masking is applied to tool output
- Respect provider ToS and app-review requirements for restricted endpoints

