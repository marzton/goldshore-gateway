import { createRemoteJWKSet, jwtVerify } from "jose";
import { Env } from "../env";

let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;
let lastJWKSUrl: string | null = null;

export async function validateAccess(req: Request, env: Env) {
  const token = req.headers.get("CF-Access-Jwt-Assertion");
  if (!token)
    return { ok: false, error: "Missing Access JWT" };

  if (!cachedJWKS || lastJWKSUrl !== env.CF_ACCESS_JWKS_URL) {
    cachedJWKS = createRemoteJWKSet(new URL(env.CF_ACCESS_JWKS_URL));
    lastJWKSUrl = env.CF_ACCESS_JWKS_URL;
  }

  try {
    const { payload } = await jwtVerify(token, cachedJWKS, {
      issuer: env.CF_ACCESS_ISS,
      audience: env.CF_ACCESS_AUD,
    });
    return { ok: true, payload };
  } catch (e) {
    return { ok: false, error: "Invalid Access JWT" };
  }
}
