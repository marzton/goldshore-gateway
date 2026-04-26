# Goldshore Gateway

## Operational endpoints

- `GET /health` is the only unauthenticated operational endpoint exposed by this worker.
- `/_sys/mail-test` has been removed and must not be reintroduced as a public route.

## Mail testing and alert verification

Mail delivery checks must be performed through private infrastructure only:

- call the mail worker from an internal service binding or another authenticated worker;
- or exercise mail flows in a non-production environment that is protected by Cloudflare Access or an equivalent internal-only control.

Do not expose mail test or alert-triggering routes on the public gateway hostname.
