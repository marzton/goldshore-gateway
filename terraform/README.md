# Terraform Setup for Cloudflare Pages

This directory contains Terraform configuration for Cloudflare Pages resources.

## GitHub Actions secrets and environments

Cloudflare deployment credentials are not used by `.github/workflows/deploy.yml` in this repository. Deployments are delegated to `marzton/goldshore-ai` by `repository_dispatch`, and that deployment repository owns the Cloudflare write credentials.

For guard workflows in this repository, configure the `cloudflare-production` GitHub Environment with these secrets:

* `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with the read-only permissions needed by the guard checks.
* `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID used by account-level guard checks.

For the full secret matrix, see `docs/CLOUDFLARE_TOKEN_ALIGNMENT.md`.
