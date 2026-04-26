import type { Env } from "../env.ts";

let lastCorsAllowed: string | null = null;
let cachedAllowed: Set<string> = new Set();

export function corsHeaders(origin: string, env: Env) {
  if (env.CORS_ALLOWED !== lastCorsAllowed) {
    try {
      const allowed = JSON.parse(env.CORS_ALLOWED);
      cachedAllowed = new Set(Array.isArray(allowed) ? allowed : []);
      lastCorsAllowed = env.CORS_ALLOWED;
    } catch (e) {
      console.error("Failed to parse CORS_ALLOWED:", e);
      return {};
    }
  }

  if (!cachedAllowed.has(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  };
}
