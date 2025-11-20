import { Env } from "./env";

export async function routeRequest(req: Request, env: Env) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/","");

  // Example: /v1/price -> API
  if (path.startsWith("v1")) {
    return fetch(`${env.API_BASE}/${path}`, {
      method: req.method,
      headers: req.headers,
      body: req.body
    });
  }

  return new Response("Not found", { status: 404 });
}
