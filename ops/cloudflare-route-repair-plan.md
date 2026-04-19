# Cloudflare Route and Binding Repair Plan

## Repository
`marzton/goldshore-gateway`

## Objective
Reserve gateway runtime behavior for intended routed hosts and prevent overlap with static web delivery.

## Target ownership
- `gw.goldshore.ai`, `gateway.goldshore.ai`, or equivalent routed gateway hosts
- optional `agent.goldshore.ai` service linkage where configured
- apex and `www` excluded from capture

## Guardrails
- Verify required service bindings, KV namespaces, secrets, queues, and DNS records before deploy.
- Fail deploy when gateway route ownership or bindings are incomplete.

## Validation
- Intended gateway host resolves.
- No apex or `www` route collisions remain.
