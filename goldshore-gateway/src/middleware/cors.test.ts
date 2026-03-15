import test from "node:test";
import assert from "node:assert";
import { corsHeaders } from "./cors.ts";

test("corsHeaders returns headers for allowed origin", () => {
  const env = { CORS_ALLOWED: '["https://example.com"]' } as any;
  const headers = corsHeaders("https://example.com", env);
  assert.strictEqual(headers["Access-Control-Allow-Origin"], "https://example.com");
  assert.strictEqual(headers["Access-Control-Allow-Credentials"], "true");
});

test("corsHeaders returns empty object for disallowed origin", () => {
  const env = { CORS_ALLOWED: '["https://example.com"]' } as any;
  const headers = corsHeaders("https://other.com", env);
  assert.deepStrictEqual(headers, {});
});

test("corsHeaders throws for malformed CORS_ALLOWED", () => {
  const env = { CORS_ALLOWED: "invalid-json" } as any;
  assert.throws(() => corsHeaders("https://example.com", env));
});
