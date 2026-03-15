import { Env } from "../env";

let lastCorsAllowed: string | null = null;
let cachedAllowed: string[] = [];

export function corsHeaders(origin: string, env: Env) {
  if (env.CORS_ALLOWED !== lastCorsAllowed) {
    try {
      cachedAllowed = JSON.parse(env.CORS_ALLOWED);
      lastCorsAllowed = env.CORS_ALLOWED;
    } catch (e) {
      console.error("Failed to parse CORS_ALLOWED:", e);
      return {};
    }
  }

  if (!cachedAllowed.includes(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  };
}
