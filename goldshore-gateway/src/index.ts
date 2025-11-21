import { corsHeaders } from "./middleware/cors";
import { validateAccess } from "./middleware/access";
import { router } from "./router";
import { Env } from "./env";

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      const origin = req.headers.get("Origin") || "";

      // OPTIONS preflight
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin, env),
        });
      }

      // Validate Access token
      const access = await validateAccess(req, env);
      if (!access.ok) {
        return new Response(JSON.stringify({ error: access.error }), {
          status: 401,
        });
      }

      // Route to API
      const response = await router.handle(req, env);

      // Attach CORS to response
      const headers = new Headers(response.headers);
      const cors = corsHeaders(origin, env);
      for (const [k, v] of Object.entries(cors)) headers.set(k, v);

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    } catch (err) {
      const error = err as Error;
      console.error(error);
      return new Response(JSON.stringify({ error: "Internal Server Error", message: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
};
