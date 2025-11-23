#!/bin/bash

# This script sets up the necessary Cloudflare bindings.
# Make sure you are logged in with the Wrangler CLI and have the correct account selected.

echo "Creating KV namespaces..."
wrangler kv:namespace create "goldshore-api-kv"
wrangler kv:namespace create "goldshore-gateway-kv"
wrangler kv:namespace create "goldshore-admin-kv"

echo "Creating R2 buckets..."
wrangler r2 bucket create "goldshore-assets"
wrangler r2 bucket create "goldshore-gateway-logs"

echo "Creating D1 database..."
wrangler d1 create "goldshore-db"

echo "Setup complete. Please update your wrangler.toml files with the IDs from the output above."
