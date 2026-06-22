# Cloudflare Token Alignment

This repository keeps Cloudflare deployment credentials out of ordinary CI jobs. Deployments are delegated to `marzton/goldshore-ai`, where the Cloudflare production credentials are stored and audited.

## GitHub secrets and environments

| Scope | Name | Used by | Required value |
| --- | --- | --- | --- |
| Repository secret | `GS_DISPATCH_TOKEN` | `.github/workflows/deploy.yml`, `.github/workflows/preview-deploy.yml` | GitHub PAT or fine-grained token that can create `repository_dispatch` events in `marzton/goldshore-ai`. |
| Environment secret, `cloudflare-production` | `CLOUDFLARE_API_TOKEN` | `.github/workflows/cloudflare-account-guard.yml`, `.github/workflows/cloudflare-infra-guard.yml` | Cloudflare API token with read-only access to the account, zone DNS, worker routes, KV, D1, R2, and queues needed by guard checks. |
| Environment secret, `cloudflare-production` | `CLOUDFLARE_ACCOUNT_ID` | `.github/workflows/cloudflare-account-guard.yml` | Cloudflare account ID for account-level guard checks. |
| Environment variable, repository or deployment environment | `WORKER_NAME` | `.github/workflows/deploy.yml` | Optional override for the deployed Worker name. Defaults to the repository name. |
| Environment variable, repository or deployment environment | `HEALTH_CHECK_URL` | `.github/workflows/deploy.yml` | Optional post-deploy health check URL consumed by the deployment dispatcher. |

Do not store `CF-Access-Client-Id` or `CF-Access-Client-Secret` in this repository's GitHub Actions secrets unless a workflow explicitly needs a Cloudflare Access service token. Current workflows do not need those service-token values.

## Dependabot

Dependabot is configured for GitHub Actions and npm updates only. Dependabot pull requests must pass the same guard workflows, but Dependabot does not receive Cloudflare deployment credentials and must not deploy directly.

## Rotation checklist

1. Rotate any Cloudflare credential that has appeared in chat, logs, issues, pull requests, or commit history.
2. Update only the matching GitHub secret or environment secret listed above.
3. Run the Cloudflare guard workflows manually after rotation.
4. Run the dispatch deployment workflow only after the guard workflows pass.
