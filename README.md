# goldshore-gateway — Gateway / Proxy Layer

## Repo → Worker → Domain
| Script | CF Worker | Domain | Status |
|--------|-----------|--------|--------|
| `src/index.ts` | `gs-platform` Worker | `ops.goldshore.ai` | ✅ Live |

## Cloudflare Account
- **Account:** Gold Shore Labs (`f77de112d2019e5456a3198a8bb50bd2`)
- **Worker:** `gs-platform` (NOTE: CF script name ≠ repo name)
- **Queue producer:** `goldshore-jobs`
- **Service binding:** `AGENT` → `gs-agent`
- **KV:** `GS_CONFIG` (binding: `GATEWAY_KV`)

## Purpose
Edge routing, auth validation (CF Access JWT), CORS, request correlation.
Internal traffic from gs-web → gs-api flows through here.
Do NOT expose directly to clients — use api.goldshore.ai instead.
