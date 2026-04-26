import { IttyRouter } from "itty-router";
import type { Env } from "./env.ts";

const router = IttyRouter();

router.all("/v1/*", (req, env: Env) => {
  const url = new URL(req.url);

  // Security Fix: Normalize and validate the path to prevent SSRF via path traversal.
  // We use decodeURIComponent to handle encoded traversal sequences like %2e%2e.
  // We ensure it does not contain '..' after decoding.
  // We also ensure it still starts with /v1/ after normalization by the URL constructor.
  const path = url.pathname;
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return new Response("Invalid path", { status: 400 });
  }

  if (decodedPath.includes("..") || !path.startsWith("/v1/")) {
    return new Response("Invalid path", { status: 400 });
  }

  let decodedPath = path;
  try {
    // Recursive decoding to catch nested encodings like %252e%252e
    while (decodedPath.includes("%")) {
      const next = decodeURIComponent(decodedPath);
      if (next === decodedPath) break;
      decodedPath = next;
    }
  } catch (e) {
    // If decoding fails, we treat it as potentially malicious or malformed
    return new Response("Invalid path encoding", { status: 400 });
  }

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
