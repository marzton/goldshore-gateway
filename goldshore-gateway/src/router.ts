import { IttyRouter } from "itty-router";
import type { Env } from "./env.ts";

const router = IttyRouter();

router.all("/v1/*", (req, env: Env) => {
  const url = new URL(req.url);

  // Security Fix: Normalize and validate the path to prevent SSRF via path traversal.
  // We ensure it does not contain '..' or other dangerous sequences.
  // We also ensure it still starts with /v1/ after normalization by the URL constructor.
  const path = url.pathname;
  if (path.includes("..") || path.includes("%2e%2e") || !path.startsWith("/v1/")) {
    return new Response("Invalid path", { status: 400 });
  }

  return fetch(`${env.API_BASE}${path}`, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
});

router.all("*", () => new Response("Not found", { status: 404 }));

export { router };
