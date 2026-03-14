import { corsHeaders } from "./middleware/cors";
import { validateAccess } from "./middleware/access";
import { router } from "./router";
import { Env } from "./env";

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      const origin = req.headers.get("Origin") || "";

      // OPTIONS preflight
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin, env),
        });
      }

      // Validate Access token
      const access = await validateAccess(req, env);
      if (!access.ok) {
        return new Response(JSON.stringify({ error: access.error }), {
          status: 401,
        });
      }

      // Route to API
      const response = await router.handle(req, env);

      // Attach CORS to response
      const headers = new Headers(response.headers);
      const cors = corsHeaders(origin, env);
      for (const [k, v] of Object.entries(cors)) headers.set(k, v);

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    } catch (err) {
      const error = err as Error;
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error", message: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
/**
 * goldshore-gateway | src/index.ts
 * 2026 Production Standard
 */

interface Env {
  // Primary Bindings
  AI: any; // Using 'any' for standard Workers AI; refined by wrangler types
  DB: D1Database;
  GS_CONFIG: KVNamespace;

  // Service Bindings (Worker-to-Worker)
  AGENT: { fetch: typeof fetch };
  MAIL: { fetch: typeof fetch };

  // Metadata & Vars
  VERSION: { id: string; tag: string };
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Health & Metadata Endpoint
    // Returns version ID to verify the "Force Update" success
    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "online",
          environment: env.ENVIRONMENT,
          version: env.VERSION.id,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 2. API Routing (Forward to gs-api / AGENT)
    // Internal Service Bindings bypass public network latency
    if (url.pathname.startsWith("/api/")) {
      try {
        // Zero-latency internal hop
        return await env.AGENT.fetch(request);
      } catch (_err) {
        return new Response("Agent Communication Error", { status: 502 });
      }
    }

    // 3. Mail Integration Stub
    // High-priority system alerts can be triggered here
    if (url.pathname === "/_sys/mail-test") {
      // return await env.MAIL.fetch(request);
      return new Response("Mail stub active", { status: 200 });
    }

    // 4. Default Fallback
    return new Response("Gold Shore Gateway | 2026", { status: 404 });
  },
};
