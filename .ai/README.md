# Manna AI context index

MANDATORY: read this file first every session, then read `.ai/IDENTITY.md`.

## Purpose of `.ai/*`

`.ai/*` is **AI-only navigation context**. It is intentionally brief.

The single AI source of truth for "what is Manna and how is it built" is
**[`.ai/IDENTITY.md`](./IDENTITY.md)** — a mirror of `docs/identity-card.md`.
Both files must be kept in sync; treat `.ai/IDENTITY.md` as the stable identity
that survives any single prompt.

The canonical, user-facing source of truth for setup, API behaviour, tools and
operational details remains the VitePress documentation in `docs/`.

## Fast orientation

- Repo: `Guebbit/manna`
- Stack: TypeScript + Node.js (ESM, Node ≥ 18)
- API entrypoint: `apps/api/index.ts`
- Core run endpoint: `POST /run`
- Profiles: `fast | reasoning | code` (no `default` profile)
- Operating modes: `low-spec | standard | high-trust` (default `standard`)
- Write tools are available only when request has `allowWrite: true`

## Where to read canonical docs

- AI identity card (source of truth): `.ai/IDENTITY.md`
- Docs hub: `docs/index.md`
- Identity card (human mirror): `docs/identity-card.md`
- Usage/setup: `docs/use-the-application.md`
- Endpoints: `docs/endpoint-map.md` (+ `openapi.yaml`)
- Models/routing: `docs/model-selection.md`
- Package docs: `docs/packages/`
- Glossary: `docs/glossary.md`

Load `.ai/MODELS.md`, `.ai/TOOLS.md`, `.ai/ENVVARS.md`, `.ai/STRUCTURE.md`, and
`.ai/STYLE.md` only as brief navigation helpers — the identity card is authoritative.
