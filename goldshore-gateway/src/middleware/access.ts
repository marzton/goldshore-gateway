import { createRemoteJWKSet, jwtVerify } from "jose";
import { Env } from "../env";

export async function validateAccess(req: Request, env: Env) {
  const token = req.headers.get("CF-Access-Jwt-Assertion");
  if (!token)
    return { ok: false, error: "Missing Access JWT" };

  const JWKS = createRemoteJWKSet(new URL(env.CF_ACCESS_JWKS_URL));

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: env.CF_ACCESS_ISS,
      audience: env.CF_ACCESS_AUD,
    });
    return { ok: true, payload };
  } catch (e) {
    return { ok: false, error: "Invalid Access JWT" };
  }
}
