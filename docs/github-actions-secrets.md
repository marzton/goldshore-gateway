# GitHub Actions Secrets

This repository does not store GitHub secret values in source control. GitHub Actions can only reference secret names; the actual values must be set in the repository's **Settings → Secrets and variables → Actions** page.

## Required repository secrets

| Secret | Used by | Expected value / notes |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | `.github/workflows/cloudflare-account-guard.yml`, `.github/workflows/cloudflare-infra-guard.yml`, `.github/workflows/preview-deploy.yml` | Canonical Cloudflare API token for the Gold Shore Labs account. The token must be rotated if CI returns `401 Unauthorized` or if it may have been exposed. Required scopes: Workers Edit, KV Edit, D1 Edit, Pages Edit, and Zone Read. |
| `CLOUDFLARE_ACCOUNT_ID` | `.github/workflows/cloudflare-account-guard.yml`, `.github/workflows/preview-deploy.yml` | Must be `f77de112d2019e5456a3198a8bb50bd2` for the Gold Shore Labs Cloudflare account. |
| `GS_DISPATCH_TOKEN` | `.github/workflows/deploy.yml` | Classic GitHub PAT with `repo` scope that can dispatch `marzton/goldshore-ai`. Verify this token has not expired before relying on manual deploys. |

## Validation behavior

The Cloudflare account guard validates that `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are present, that the account ID matches the Gold Shore Labs account, and that required Cloudflare resources exist. A `401 Unauthorized` response from Cloudflare usually means the repository secret contains a stale, revoked, or wrong-account API token.

## Rotation checklist

1. Create or rotate a single canonical Cloudflare API token in the Gold Shore Labs account.
2. Store it as `CLOUDFLARE_API_TOKEN` in this repository.
3. Store `f77de112d2019e5456a3198a8bb50bd2` as `CLOUDFLARE_ACCOUNT_ID` in this repository.
4. Confirm `GS_DISPATCH_TOKEN` still has access to dispatch workflows in `marzton/goldshore-ai`.
5. Re-run **Cloudflare Account Guard** and **Cloudflare Infra Guard** from GitHub Actions.
