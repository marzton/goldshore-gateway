import { z } from "zod";

export const universalEnvironmentSchema = z.object({
  // UNIVERSAL
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_API_TOKEN: z.string(),
  CLOUDFLARE_ZONE_ID: z.string(),
  CLOUDFLARE_ENV: z.enum(["dev", "staging", "prod"]),
  CLOUDFLARE_PROJECT: z.string(),
  CLOUDFLARE_BASE_DOMAIN: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string().url(),

  // ACCESS / AUTH
  CF_ACCESS_TEAM_DOMAIN: z.string(),
  CF_ACCESS_AUD: z.string(),
  CF_ACCESS_JWKS_URL: z.string().url(),
  CF_ACCESS_POLICY_ID: z.string().optional(),

  // INTERNAL SERVICES
  INTERNAL_API_BASE_URL: z.string().url(),
  INTERNAL_API_KEY: z.string(),
  INTERNAL_GW_URL: z.string().url(),
  INTERNAL_GW_TOKEN: z.string(),

  // STORAGE / INFRA
  KV_NAMESPACE_ID: z.string(),
  R2_BUCKET_ID: z.string(),
  QUEUE_NAMESPACE_ID: z.string(),
  DURABLE_OBJECTS_NAMESPACE_ID: z.string(),

  // SECURITY
  JWT_SECRET: z.string(),
  SESSION_SECRET: z.string(),
  ENCRYPTION_KEY: z.string(),
  SIGNING_KEY: z.string(),

  // FRONTEND RUNTIME
  VITE_PUBLIC_BASE_URL: z.string().url(),
  VITE_API_URL: z.string().url(),
  VITE_GATEWAY_URL: z.string().url(),
  VITE_CONTROL_WORKER_URL: z.string().url(),
  VITE_APP_ENV: z.enum(["development", "staging", "production"]),
  VITE_ASSETS_BASE: z.string(),

  // LOGGING
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  LOG_SERVICE_NAME: z.string(),
  AI_LOG_ENDPOINT: z.string().url().optional(),
  AI_AGENT_NAME: z.string().optional(),

  // AI GATEWAY
  GSL_AI_GATEWAY_URL: z.string().url(),
  GSL_AI_GATEWAY_KEY: z.string(),
  GSL_DEFAULT_MODEL: z.string(),
  GSL_EMBEDDING_MODEL: z.string(),
  GSL_RAG_INDEX: z.string(),

  // TERRAFORM STATE
  TF_STATE_BUCKET: z.string(),
  TF_STATE_KEY: z.string(),
  TF_STATE_REGION: z.string(),
  TF_VAR_environment: z.string(),
  TF_VAR_project: z.string(),

  // ROUTING
  PRIMARY_ROUTE: z.string(),
  FALLBACK_ROUTE: z.string(),
  ERROR_PAGE_PATH: z.string(),
  BUILD_OUTPUT_DIR: z.string(),
  ASSET_MANIFEST_PATH: z.string(),
});

export const projectSpecificEnvironmentSchema = z.object({
    // PROJECT-SPECIFIC
    API_VERSION: z.string().optional(),
    API_PUBLIC_URL: z.string().url().optional(),
    DATABASE_URL: z.string().optional(),
    ADMIN_PUBLIC_URL: z.string().url().optional(),
    ADMIN_AUTH_REQUIRED: z.coerce.boolean().optional(),
    WEB_PUBLIC_URL: z.string().url().optional(),
    WEB_THEME_MODE: z.enum(["light", "dark"]).optional(),
  WEB_CDN_BASE: z.string().url().optional(),
    GATEWAY_PUBLIC_URL: z.string().url().optional(),
    GATEWAY_ROUTING_TABLE: z.string().optional(),
});

export const environmentSchema = universalEnvironmentSchema.merge(projectSpecificEnvironmentSchema);
