import { verifyHmac } from "./hmac";

interface Env {
  GATEWAY_SERVICE_NAME: string;
  DEFAULT_MODEL: string;
  JWT_HS256_KEY: string;
  OPENAI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  GOOGLE_API_KEY: string;
  GOOGLE_GEMINI_KEY: string;
  GROQ_API_KEY: string;
  GOOGLE_JULES_KEY: string;
  AISTUDIO_WYWRDTRVLR_TOKEN: string;

  ACCESS_AUDIENCE: string;
  CLOUDFLARE_JWKS_URI: string;

  KV_SESSIONS: KVNamespace;
  KV_CACHE: KVNamespace;
  R2_PUBLIC: R2Bucket;
  R2_LOGS: R2Bucket;
  QUEUE_EVENTS: Queue;
  QUEUE_DLQ: Queue;
  D1_DATABASE: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          ok: true,
          service: env.GATEWAY_SERVICE_NAME,
          defaultModel: env.DEFAULT_MODEL
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    if (url.pathname === "/v1/chat/completions") {
      return handleChatCompletion(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  }
};

async function handleChatCompletion(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = request.headers.get("x-gs-hmac") || "";
  const bodyText = await request.text();

  const ok = await verifyHmac(bodyText, signature, env.JWT_HS256_KEY);
  if (!ok) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(bodyText || "{}");
  const model = payload.model || env.DEFAULT_MODEL;

  // Simple router example. Replace with your real AI routing logic.
  if (model.startsWith("gpt-") && env.OPENAI_API_KEY) {
    // Fan out to OpenAI through standard API
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: payload.messages || []
      })
    });
    return new Response(resp.body, {
      status: resp.status,
      headers: { "content-type": "application/json" }
    });
  }

  return new Response("Model not supported or provider not configured", {
    status: 400
  });
}