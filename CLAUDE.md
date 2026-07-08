# CLAUDE.md — goldshore-gateway

> Updated: 2026-07-03 · Active branch: `claude/risk-radar-fra-epo-2wk5mk` · PR: #213

## What this repo is

Hybrid repo serving two purposes:

1. **Root** — Goldshore admin dashboard (React Router 7 + Hono 4 + React 19 + Tailwind CSS 4 + GSAP/Framer Motion), deployed as a Cloudflare Workers fullstack app
2. **`goldshore-gateway/` subdirectory** — The `gs-platform` Cloudflare Worker, the platform's front door

---

## Gateway (`gs-platform`) role

Routes all Goldshore subdomain traffic. Validates Cloudflare Access JWTs on `/api/*` then proxies to `gs-agent` via internal service binding (zero-latency, no public hop).

| Route | Handler |
|-------|---------|
| `gw.goldshore.ai/*` | gateway worker |
| `gateway.goldshore.ai/*` | gateway worker |
| `ops.goldshore.ai/*` | gateway worker |
| `agent.goldshore.ai/*` | → `gs-agent` (service binding) |
| `api.goldshore.ai/*` | → `gs-api` (service binding) |

### Service bindings
- `gs-agent` — AI agent worker (internal, zero-latency)
- `gs-api` — platform API
- `banproof-me` — security/ban-check called on every request
- `gs-signals-prod` — signals service

### Storage bindings
- D1: `DB` → `goldshore` (`2b7cb4cd-f9b3-4107-9f03-ae76e99f0c14`), `gs_audit_db`
- KV: audit log, config

---

## Monorepo relationship

The `goldshore-ai` monorepo has a stub at `apps/gs-gateway/wrangler.toml` that explicitly notes this repo owns the real deployment. The stub keeps workspace validation happy. **This repo is the source of truth for the gateway worker until migration is complete.**

---

## Active branch: `claude/risk-radar-fra-epo-2wk5mk` (PR #213)

### What changed
- `wrangler.jsonc`: compatibility_date update, `ENV` → `ENVIRONMENT`, `API_ORIGIN` → `API_BASE` + new vars, KV ID updated, D1 consolidated to single `DB` binding, services refactored, added `ai` and `version_metadata` bindings, removed ops/agent/api routes (now handled by gateway routing logic)

### Known CI failure — package-lock.json corruption

`package-lock.json` was corrupted by running `npm install` on Android (Termux). It regenerated with `@tailwindcss/oxide` locked to `"os": ["android"]` instead of the correct 12-platform `optionalDependencies`. Linux CI fails with `EBADPLATFORM`.

**Fix (run locally):**
```bash
git fetch origin main
git checkout origin/main -- package-lock.json
git add package-lock.json
git commit -m "fix: restore package-lock.json from main (Android lockfile corruption)"
git push origin claude/risk-radar-fra-epo-2wk5mk
```

**Never run `npm install` on Termux/Android in this repo** — the native binary resolver locks the wrong OS platform.

---

## Stack

| Tool | Version |
|------|---------|
| TypeScript | 6.0.3 |
| React | 19 |
| React Router | 7.18 |
| Hono | 4.12 |
| Vite | 8 |
| Tailwind CSS | 4 |
| Wrangler | 4.106.x |
| GSAP / Framer Motion | latest |

---

## Common commands

```bash
npm install
npm run dev          # admin dashboard dev server
npm run build        # production build

# Gateway worker (from subdirectory)
cd goldshore-gateway
wrangler dev         # local dev
wrangler deploy      # deploy to production
```

---

## Migration plan

This repo is planned for consolidation into `marzton/goldshore-ai/apps/gs-gateway`. Steps:
1. Replace the stub `wrangler.toml` in `goldshore-ai/apps/gs-gateway/` with this repo's worker code
2. Update CI/CD to deploy gateway from the monorepo
3. Archive this standalone repo

Do not begin migration until `goldshore-ai/apps/gs-admin` fully supersedes `marzton/goldshore-admin` (that comes first in the priority order).
