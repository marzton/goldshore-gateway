# Task Branch: Gateway Routing and Observability

Agent target: Claude / Codex
Repository: marzton/goldshore-gateway
Branch: claude/gateway-routing-observability

## Mission
Define the gateway as the safe routing, session, rate-limit, and telemetry boundary between web/admin/API services.

## Scope
- Add route map for web, admin, API, agent, and future app services.
- Add CORS and security-header policy that matches Gold Shore domains.
- Add request correlation IDs and structured logs.
- Add rate-limit hooks and queue handoff points.
- Document Cloudflare Worker bindings and environment matrix.
- Add smoke tests for health, fallback routing, and protected route behavior.

## Acceptance Criteria
- Gateway has a clear route table and fallback behavior.
- All proxied calls carry correlation IDs.
- CORS only allows approved Gold Shore and local dev origins.
- Observability docs identify logs, queues, analytics, and alert handoff.
- Build/test/deploy commands are documented.
