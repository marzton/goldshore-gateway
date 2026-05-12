import { IttyRouter } from "itty-router";
import type { Env } from "./env.ts";

const router = IttyRouter();

router.all("/v1/*", (req, env: Env) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Security Fix: Iteratively decode to catch nested/double-encoded traversal sequences
  // (e.g. %252e%252e → %2e%2e → ..). Malformed percent-encoding is rejected outright.
  let decodedPath: string = path;
  try {
    let prev: string;
    do {
      prev = decodedPath;
      decodedPath = decodeURIComponent(prev);
    } while (decodedPath !== prev);
  } catch {
    return new Response("Invalid path", { status: 400 });
  }

  // Reject path traversal attempts and paths that no longer start with /v1/ after decoding.
  if (decodedPath.includes("..") || !path.startsWith("/v1/")) {
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
