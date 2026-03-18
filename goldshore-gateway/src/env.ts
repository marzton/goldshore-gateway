export interface Env {
  // Cloudflare Access
  CF_ACCESS_ISS: string;
  CF_ACCESS_JWKS_URL: string;
  CF_ACCESS_AUD: string;

  // App Configuration
  API_BASE: string;
  ADMIN_APP: string;
  PUBLIC_HOME: string;
  ENVIRONMENT: string;
  LOG_LEVEL: string;
  AIPROXYSIGNING_KEY: string;

  // CORS
  CORS_ALLOWED: string;

  // Primary Bindings
  AI: any;
  DB: D1Database;
  GS_CONFIG: KVNamespace;

  // Service Bindings (Worker-to-Worker)
  AGENT: { fetch: typeof fetch };

  // Metadata
  VERSION: { id: string; tag: string };
}
