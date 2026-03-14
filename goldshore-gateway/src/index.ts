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

import { corsHeaders } from "./middleware/cors";
import { validateAccess } from "./middleware/access";
import { router } from "./router";
import { Env } from "./env";

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
