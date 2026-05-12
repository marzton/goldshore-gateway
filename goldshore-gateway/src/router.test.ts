import test from "node:test";
import assert from "node:assert";
import { router } from "./router.ts";
import type { Env } from "./env.ts";

test("router processes normal /v1/ paths", async () => {
  const env = { API_BASE: "http://internal-api" } as Env;
  const req = {
    url: "http://gateway/v1/user/profile",
    method: "GET",
    headers: new Headers(),
    body: null,
    params: { "*": "user/profile" }
  } as any;

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

  const req = {
    url: "http://gateway/v1/test",
    method: "GET",
    headers: new Headers(),
    body: null,
    params: { "*": "test" }
  } as any;

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
    const reqVulnerable = {
        url: "http://gateway/v1/test/..%2f..%2fadmin/secrets",
        method: "GET",
        headers: new Headers(),
        body: null
    } as any;

    // Our itty-router mock needs to populate params
    const match = reqVulnerable.url.match(/\/v1\/(.*)/);
    if (match) {
        reqVulnerable.params = { "*": match[1] };
    }

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

test("router rejects malformed percent-encoding in /v1/ paths", async () => {
  const env = { API_BASE: "http://internal-api" } as Env;
  const malformedPaths = [
    "bad%",
    "bad%2",
    "nested/%",
    "nested/%2"
  ];

  for (const path of malformedPaths) {
    const req = {
      url: `http://gateway/v1/${path}`,
      method: "GET",
      headers: new Headers(),
      body: null,
      params: { "*": path }
    } as any;

    const originalFetch = global.fetch;
    let fetchCalled = false;
    global.fetch = (async (url: string) => {
      fetchCalled = true;
      return new Response(JSON.stringify({ target: url }));
    }) as any;

    try {
      const res = await router.fetch(req, env);

      assert.strictEqual(fetchCalled, false, `Malformed encoded path should not be forwarded to fetch: ${path}`);
      assert.ok(res, `Router should return a response for malformed encoded path: ${path}`);

      if (res.status === 400) {
        const text = await res.text();
        assert.strictEqual(text, "Invalid path");
      } else {
        assert.strictEqual(
          res.status,
          404,
          `Malformed encoded path should be rejected or not routed safely: ${path}`
        );
      }
    } finally {
      global.fetch = originalFetch;
    }
  }
});

test("router rejects double-encoded traversal sequences in /v1/ paths", async () => {
  const env = { API_BASE: "http://internal-api" } as Env;
  const req = {
    url: "http://gateway/v1/safe/%252e%252e%252fadmin/secrets",
    method: "GET",
    headers: new Headers(),
    body: null,
    params: { "*": "safe/%252e%252e%252fadmin/secrets" }
  } as any;

  const originalFetch = global.fetch;
  let fetchCalled = false;
  global.fetch = (async (url: string) => {
    fetchCalled = true;
    return new Response(JSON.stringify({ target: url }));
  }) as any;

  try {
    const res = await router.fetch(req, env);

    assert.strictEqual(fetchCalled, false, "Double-encoded traversal path should not be forwarded to fetch");
    assert.ok(res, "Router should return a response for double-encoded traversal path");

    if (res.status === 400) {
      const text = await res.text();
      assert.strictEqual(text, "Invalid path");
    } else {
      assert.strictEqual(
        res.status,
        404,
        "Double-encoded traversal path should be rejected or not routed safely"
      );
    }
  } finally {
    global.fetch = originalFetch;
  }
});
