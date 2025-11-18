#!/usr/bin/env bash
set -euo pipefail

echo "Configuring wrangler secrets for goldshore-gateway (production env)..."

wrangler secret put OPENAI_API_KEY --env production
wrangler secret put ANTHROPIC_API_KEY --env production
wrangler secret put GOOGLE_API_KEY --env production
wrangler secret put GOOGLE_GEMINI_KEY --env production
wrangler secret put GROQ_API_KEY --env production
wrangler secret put GOOGLE_JULES_KEY --env production
wrangler secret put AISTUDIO_WYWRDTRVLR_TOKEN --env production

wrangler secret put JWT_HS256_KEY --env production
wrangler secret put SESSION_SECRET --env production
wrangler secret put HMAC_SECRET --env production

echo "You should now deploy:"
echo "  npx wrangler deploy --env production"