import { Env } from "../env";

export function corsHeaders(origin: string, env: Env) {
  const allowed = JSON.parse(env.CORS_ALLOWED);
  if (!allowed.includes(origin)) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  };
}
