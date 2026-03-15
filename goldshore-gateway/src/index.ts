/**
 * goldshore-gateway | src/index.ts
 * 2026 Production Standard
 */

import { corsHeaders } from "./middleware/cors";
import { validateAccess } from "./middleware/access";
import { router } from "./router";
import { Env } from "./env";

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // 0. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(origin, env),
      });
    }

    // 1. Health & Metadata Endpoint
    // Returns version ID to verify the "Force Update" success
    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "online",
          environment: env.ENVIRONMENT,
          version: env.VERSION?.id || "unknown",
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(origin, env),
          },
        },
      );
    }

    // 2. API Routing (Forward to gs-api / AGENT)
    // Internal Service Bindings bypass public network latency
    if (url.pathname.startsWith("/api/")) {
      // Security: Validate Cloudflare Access JWT
      const access = await validateAccess(request, env);
      if (!access.ok) {
        return new Response(JSON.stringify({ error: access.error }), {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(origin, env),
          },
        });
      }

      try {
        // Zero-latency internal hop
        const apiResponse = await env.AGENT.fetch(request);
        const headers = {
          ...Object.fromEntries(apiResponse.headers),
          ...corsHeaders(origin, env),
        };
        return new Response(apiResponse.body, {
          status: apiResponse.status,
          headers,
        });
      } catch (_err) {
        return new Response("Agent Communication Error", {
          status: 502,
          headers: corsHeaders(origin, env),
        });
      }
    }

    // 3. Mail Integration Stub
    // High-priority system alerts can be triggered here
    if (url.pathname === "/_sys/mail-test") {
      // return await env.MAIL.fetch(request);
      return new Response("Mail stub active", {
        status: 200,
        headers: corsHeaders(origin, env),
      });
    }

    // 4. Router Fallback
    // For anything not handled above, try itty-router
    const response = await router.handle(request, env);
    if (response) {
      const headers = {
        ...Object.fromEntries(response.headers),
        ...corsHeaders(origin, env),
      };
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // 5. Default Fallback
    const fallbackResponse = new Response("Gold Shore Gateway | 2026", { status: 404 });
    const headers = {
      ...Object.fromEntries(fallbackResponse.headers),
      ...corsHeaders(origin, env),
    };
    return new Response(fallbackResponse.body, {
      status: fallbackResponse.status,
      headers,
    });
  },
};
