import { IttyRouter } from "itty-router";
import { Env } from "./env";

const router = IttyRouter();

router.all("/v1/*", (req, env: Env) => {
  const url = new URL(req.url);
  const path = url.pathname;

  return fetch(`${env.API_BASE}${path}`, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
});

router.all("*", () => new Response("Not found", { status: 404 }));

export { router };
