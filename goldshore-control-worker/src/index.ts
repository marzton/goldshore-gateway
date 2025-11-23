export interface Env {
  CONTROL_STORE: KVNamespace;
  api: Fetcher;
  gateway: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // This is the entry point for the Gold Shore Control Worker.
    // It can be used for:
    // - Binding management
    // - Secret management
    // - Preview routing
    // - Environment syncing
    // - Worker version activation

    const url = new URL(request.url);

    if (url.pathname === '/status') {
      return new Response(JSON.stringify({ status: 'ok', version: '1.0.0' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add more control plane logic here.
    // For example, you could have endpoints to:
    // - Activate a new worker version
    // - Update a KV value
    // - Change a route

    return new Response('Not found', { status: 404 });
  },
};
