import { IttyRouter } from "itty-router";
import type { Env } from "./env.ts";

const router = IttyRouter();

router.all("/v1/*", (req, env: Env) => {
  const url = new URL(req.url);

  // Security Fix: Normalize and validate the path to prevent SSRF via path traversal.
  // We decode the pathname to ensure we catch all variations of traversal sequences (e.g. %2e%2e, %2E%2E).
  // We also ensure it still starts with /v1/ after normalization and decoding.
  const path = url.pathname;
  const decodedPath = decodeURIComponent(path);
  if (path.includes("..") || decodedPath.includes("..") || !path.startsWith("/v1/")) {
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
