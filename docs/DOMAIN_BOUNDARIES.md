# Domain Boundaries

## Repo role

This repository owns gateway-style request orchestration and should stay scoped to gateway traffic.

## Guardrails

- Attach only gateway-specific hostnames here.
- Do not attach public showroom hostnames, personal portfolio domains, or unrelated product domains here.
- Keep API and admin surfaces in their dedicated repos.
- Remove stale custom-domain bindings before re-using a hostname elsewhere.

## Operational note

If public web content appears on this surface, treat it as routing drift and verify Cloudflare custom-domain bindings before touching code.
