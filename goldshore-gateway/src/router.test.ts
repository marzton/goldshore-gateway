import test from "node:test";
import assert from "node:assert";
import { router } from "./router.ts";
import type { Env } from "./env.ts";

test("router processes normal /v1/ paths", async () => {
  const env = { API_BASE: "http://internal-api" } as Env;
  const req = new Request("http://gateway/v1/user/profile");

  // Mock global fetch
  const originalFetch = global.fetch;
  global.fetch = (async (url: string) => {
    return new Response(JSON.stringify({ target: url }));
  }) as any;

  try {
    const res = await router.fetch(req, env);
    const data = await res.json();
    assert.strictEqual(data.target, "http://internal-api/v1/user/profile");
  } finally {
    global.fetch = originalFetch;
  }
});

test("router handles traversal sequences in path (Reproduction of SSRF)", async () => {
  const env = { API_BASE: "http://internal-api" } as Env;

  const req = new Request("http://gateway/v1/test");

  // Mock global fetch
  const originalFetch = global.fetch;
  global.fetch = (async (url: string) => {
    return new Response(JSON.stringify({ target: url }));
  }) as any;

  try {
    // Manually trigger the vulnerable handler with a manipulated URL
    // since itty-router might not match if we use a non-matching URL string
    const res = await router.fetch(req, env);
    const data = await res.json();

    // This is just to confirm normal behavior first
    assert.strictEqual(data.target, "http://internal-api/v1/test");

    // Now test with traversal in req.url
    const reqVulnerable = new Request("http://gateway/v1/test/..%2f..%2fadmin/secrets");

    const resVulnerable = await router.fetch(reqVulnerable, env);

    if (resVulnerable && resVulnerable.status === 400) {
        // Correctly rejected
        const text = await resVulnerable.text();
        assert.strictEqual(text, "Invalid path");
    } else if (resVulnerable && resVulnerable.status !== 404) {
        const dataVulnerable = await resVulnerable.json();
        assert.strictEqual(dataVulnerable.target.includes(".."), false, "Vulnerability: Path traversal sequences passed to fetch");
    } else {
        console.log("Not matched or 404");
        // We want it to be matched but correctly handled.
        // If it matches itty-router but is vulnerable, it will hit fetch.
        // If it doesn't match itty-router, it's safer but we should understand why.
    }
  } finally {
    global.fetch = originalFetch;
  }
});

test("router rejects malformed percent-encoding with 400", async () => {
  const env = { API_BASE: "http://internal-api" } as Env;
  const req = new Request("http://gateway/v1/%");

  const res = await router.fetch(req, env);
  assert.ok(res);
  assert.strictEqual(res.status, 400);
  assert.strictEqual(await res.text(), "Invalid path");
});


test("router rejects double-encoded traversal sequences with 400", async () => {
  const env = { API_BASE: "http://internal-api" } as Env;
  const req = new Request("http://gateway/v1/%252e%252e/%252e%252e/admin");

  const originalFetch = global.fetch;
  global.fetch = (async () => {
    throw new Error("fetch should not be called for invalid traversal paths");
  }) as any;

  try {
    const res = await router.fetch(req, env);
    assert.ok(res);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(await res.text(), "Invalid path");
  } finally {
    global.fetch = originalFetch;
  }
});
