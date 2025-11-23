# Terraform Setup for Cloudflare Pages

This directory contains the Terraform configuration for the Cloudflare Pages project. The configuration is managed automatically by a GitHub Actions workflow in `.github/workflows/deploy.yml`.

## GitHub Actions Secrets

For the GitHub Actions workflow to run successfully, you must add the following secrets to your GitHub repository settings:

*   `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token.
*   `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID.

These secrets are used by the workflow to authenticate with the Cloudflare API and apply the Terraform configuration.
