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

## Manual Cutover Gate (Dashboard-Only)
These are manual Cloudflare dashboard actions and must be completed in order.

1. **Fix Cloudflare Access policy first (critical)**
   - Replace `non_identity + everyone` with `identity + email domain @goldshore.ai`.
2. **Delete stale Access applications after policy correction**
   - `gs-mail` ×2, `gs-platform` ×2, `gs-api` ×2, `goldshore-core` ×2, `banproof-me` ×2.
3. **Attach Worker custom domains**
   - `gs-platform` → `gw.goldshore.ai`
   - `gs-api` → `api.goldshore.ai`
   - `gs-agent` → `agent.goldshore.ai`
   - After each attach: confirm intended Worker binding, no duplicate hostname elsewhere, and `/health` responds.
4. **Disconnect redundant `goldshore-ai` Git build**
   - Keep Worker undeleted until dependency checks are complete.
5. **Fix `goldshore.org` mail DNS**
   - SPF apex TXT: `v=spf1 include:_spf.mx.cloudflare.net ~all`
   - DMARC TXT at `_dmarc`: `v=DMARC1; p=none; rua=mailto:<reporting-address>`
6. **Fix `armsway.com` mail routing**
   - Add MX: `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net` with Cloudflare-expected priorities.
   - Ensure valid SPF exists and remove conflicting legacy MX records.
7. **Verification gate**
   - `curl -I https://gw.goldshore.ai/health`
   - `curl -I https://api.goldshore.ai/health`
   - `curl -I https://agent.goldshore.ai/health`
   - Verify SPF/DMARC/MX records resolve publicly after propagation.
8. **Only then proceed with deploy/cutover**

## Locked Hostname Decision
- Canonical API hostname for cutover is **`api.goldshore.ai`**.
- Do not leave both `api.goldshore.ai` and `api.goldshore.org` active as parallel options.
