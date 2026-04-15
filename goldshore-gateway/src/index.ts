/**
 * goldshore-gateway | src/index.ts
 * 2026 Production Standard
 */

import { corsHeaders } from "./middleware/cors";
import { validateAccess } from "./middleware/access";
import { router } from "./router";
import { Env } from "./env";

const CORRELATION_HEADER = "x-correlation-id";

type UpstreamFailureType =
  | "binding-unreachable"
  | "binding-misconfigured"
  | "upstream-error-response"
  | "unexpected-exception";

function getCorrelationId(request: Request): string {
  const incoming = request.headers.get(CORRELATION_HEADER)?.trim();
  if (incoming) {
    return incoming.slice(0, 128);
  }

  return crypto.randomUUID();
}

function withCorrelationHeaders(headers: HeadersInit, correlationId: string): Headers {
  const enrichedHeaders = new Headers(headers);
  enrichedHeaders.set(CORRELATION_HEADER, correlationId);
  return enrichedHeaders;
}

function logAgentFailure(
  requestId: string,
  pathname: string,
  failureType: UpstreamFailureType,
  details: Record<string, unknown> = {},
): void {
  console.error(
    JSON.stringify({
      event: "agent_fetch_failure",
      requestId,
      pathname,
      failureType,
      ...details,
    }),
  );
}

function classifyAgentException(error: unknown): {
  failureType: Exclude<UpstreamFailureType, "upstream-error-response">;
  reason: string;
} {
  const message = error instanceof Error ? error.message : String(error);
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("is not a function")
    || normalizedMessage.includes("service binding")
    || normalizedMessage.includes("binding")
  ) {
    return {
      failureType: "binding-misconfigured",
      reason: message,
    };
  }

  if (
    normalizedMessage.includes("network")
    || normalizedMessage.includes("connection")
    || normalizedMessage.includes("unreachable")
    || normalizedMessage.includes("refused")
    || normalizedMessage.includes("timed out")
  ) {
    return {
      failureType: "binding-unreachable",
      reason: message,
    };
  }

  return {
    failureType: "unexpected-exception",
    reason: message,
  };
}

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
      const requestId = getCorrelationId(request);

      // Security: Validate Cloudflare Access JWT
      const access = await validateAccess(request, env);
      if (!access.ok) {
        return new Response(JSON.stringify({ error: access.error }), {
          status: 401,
          headers: withCorrelationHeaders(
            {
              "Content-Type": "application/json",
              ...corsHeaders(origin, env),
            },
            requestId,
          ),
        });
      }

      const upstreamRequest = new Request(request, {
        headers: withCorrelationHeaders(request.headers, requestId),
      });

      try {
        // Zero-latency internal hop
        const apiResponse = await env.AGENT.fetch(upstreamRequest);

        if (apiResponse.status >= 500) {
          logAgentFailure(requestId, url.pathname, "upstream-error-response", {
            upstreamStatus: apiResponse.status,
            upstreamStatusText: apiResponse.statusText,
          });
          return new Response("Upstream Service Error", {
            status: 502,
            headers: withCorrelationHeaders(corsHeaders(origin, env), requestId),
          });
        }

        return new Response(apiResponse.body, {
          status: apiResponse.status,
          headers: withCorrelationHeaders(
            {
              ...Object.fromEntries(apiResponse.headers),
              ...corsHeaders(origin, env),
            },
            requestId,
          ),
        });
      } catch (error) {
        const { failureType, reason } = classifyAgentException(error);
        logAgentFailure(requestId, url.pathname, failureType, {
          reason,
          method: request.method,
        });
        return new Response("Upstream Service Error", {
          status: 502,
          headers: withCorrelationHeaders(corsHeaders(origin, env), requestId),
        });
      }
    }

    // 3. Mail Integration Stub
    // High-priority system alerts can be triggered here
    if (url.pathname === "/_sys/mail-test") {
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

    // 4. Default Fallback
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
