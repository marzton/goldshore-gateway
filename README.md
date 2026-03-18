# Goldshore monorepo layout

This repository currently contains **two distinct JavaScript projects** that happen to live side by side:

- **Repository root (`./`)**: the Goldshore admin dashboard built with React Router, Vite, and Cloudflare Workers.
- **`goldshore-gateway/`**: the standalone gateway Cloudflare Worker that has its own `package.json`, `package-lock.json`, and `wrangler.toml`.

## Canonical execution model

Use each package from its own directory instead of assuming the whole repository is a single Node project:

### Root app (`./`)

Use the root package for the admin dashboard and Pages-style build checks.

```bash
npm ci
npm run build
npm run dev
```

Relevant files include `package.json`, `react-router.config.ts`, `vite.config.ts`, `wrangler.jsonc`, `app/`, `public/`, `workers/`, and `packages/env/`.

### Gateway worker (`./goldshore-gateway`)

Use the nested package for the gateway worker only.

```bash
cd goldshore-gateway
npm ci
npm run deploy
npm run dev
```

Relevant files include `goldshore-gateway/package.json`, `goldshore-gateway/package-lock.json`, `goldshore-gateway/wrangler.toml`, and `goldshore-gateway/src/`.

## Workflow targeting

The GitHub workflows have been split to follow that same model explicitly:

- `.github/workflows/pages-ci.yml` installs dependencies and builds the **root app**.
- `.github/workflows/deploy-worker.yml` installs dependencies and deploys the **nested gateway worker** from `goldshore-gateway/`.

That separation avoids accidental cross-project installs, incorrect path filters, and deploying the wrong package when only one project changed.
