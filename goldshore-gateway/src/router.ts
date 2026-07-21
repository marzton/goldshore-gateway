import { IttyRouter } from "itty-router";
import type { Env } from "./env.ts";

const router = IttyRouter();

function recursivelyDecodePath(path: string): string | null {
  let decodedPath = path;

  for (let depth = 0; depth < 5; depth++) {
    try {
      const nextPath = decodeURIComponent(decodedPath);
      if (nextPath === decodedPath) {
        return decodedPath;
      }
      decodedPath = nextPath;
    } catch {
      return null;
    }
  }

  return null;
}

router.all("/v1/*", (req, env: Env) => {
  const url = new URL(req.url);

  // Security Fix: recursively normalize and validate the path to prevent SSRF via
  // nested-encoded traversal sequences like %252e%252e becoming ../ after an
  // additional upstream decode layer.
  const path = url.pathname;
  if (path.includes("..") || path.includes("%2e%2e") || !path.startsWith("/v1/")) {
    return new Response("Invalid path", { status: 400 });
  }

  let decodedPath = path;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return new Response("Invalid path", { status: 400 });
  }

  if (!decodedPath || path.includes("..") || decodedPath.includes("..") || !path.startsWith("/v1/")) {
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
