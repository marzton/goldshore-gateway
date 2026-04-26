import test from "node:test";
import assert from "node:assert";
import { corsHeaders } from "./cors.ts";

test("corsHeaders returns headers for allowed origin", () => {
  const env = { CORS_ALLOWED: '["https://goldshore.ai"]' } as any;
  const headers = corsHeaders("https://goldshore.ai", env);
  assert.strictEqual(headers["Access-Control-Allow-Origin"], "https://goldshore.ai");
  assert.strictEqual(headers["Access-Control-Allow-Credentials"], "true");
});

test("corsHeaders returns empty object for disallowed origin", () => {
  const env = { CORS_ALLOWED: '["https://goldshore.ai"]' } as any;
  const headers = corsHeaders("https://other-origin.ai", env);
  assert.deepStrictEqual(headers, {});
});

test("corsHeaders returns empty object for malformed CORS_ALLOWED", () => {
  const env = { CORS_ALLOWED: "invalid-json" } as any;
  const headers = corsHeaders("https://goldshore.ai", env);
  assert.deepStrictEqual(headers, {});
});
