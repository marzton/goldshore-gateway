import test from "node:test";
import assert from "node:assert";
import { getControlWorkerStatus, activateWorkerVersion, updateKvValue } from "./control-api.ts";

// Mocking global fetch
const originalFetch = globalThis.fetch;

test.after(() => {
  globalThis.fetch = originalFetch;
});

test("getControlWorkerStatus returns status on success", async () => {
  const mockStatus = { status: "ok", version: "1.0.0" };
  // @ts-ignore - Mocking fetch
  globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    return {
      ok: true,
      json: async () => mockStatus,
    } as Response;
  };

  const status = await getControlWorkerStatus();
  assert.deepStrictEqual(status, mockStatus);
});

test("getControlWorkerStatus throws on error", async () => {
  // @ts-ignore - Mocking fetch
  globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    return {
      ok: false,
    } as Response;
  };

  await assert.rejects(getControlWorkerStatus(), {
    message: "Failed to fetch control worker status",
  });
});

test("activateWorkerVersion sends correct request", async () => {
  let capturedRequest: { url: string; method: string; body: string } | null = null;
  // @ts-ignore - Mocking fetch
  globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    capturedRequest = {
      url: url.toString(),
      method: init?.method || "GET",
      body: init?.body as string,
    };
    return {
      ok: true,
    } as Response;
  };

  await activateWorkerVersion("my-worker", "v1");
  assert.ok(capturedRequest);
  assert.strictEqual(capturedRequest!.method, "POST");
  assert.strictEqual(JSON.parse(capturedRequest!.body).worker, "my-worker");
  assert.strictEqual(JSON.parse(capturedRequest!.body).version, "v1");
});

test("activateWorkerVersion throws on error", async () => {
  // @ts-ignore - Mocking fetch
  globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    return {
      ok: false,
    } as Response;
  };

  await assert.rejects(activateWorkerVersion("my-worker", "v1"), {
    message: "Failed to activate worker version",
  });
});

test("updateKvValue sends correct request", async () => {
  let capturedRequest: { url: string; method: string; body: string } | null = null;
  // @ts-ignore - Mocking fetch
  globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    capturedRequest = {
      url: url.toString(),
      method: init?.method || "GET",
      body: init?.body as string,
    };
    return {
      ok: true,
    } as Response;
  };

  await updateKvValue("my-ns", "my-key", "my-value");
  assert.ok(capturedRequest);
  assert.strictEqual(capturedRequest!.method, "POST");
  const body = JSON.parse(capturedRequest!.body);
  assert.strictEqual(body.namespace, "my-ns");
  assert.strictEqual(body.key, "my-key");
  assert.strictEqual(body.value, "my-value");
});

test("updateKvValue throws on error", async () => {
  // @ts-ignore - Mocking fetch
  globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    return {
      ok: false,
    } as Response;
  };

  await assert.rejects(updateKvValue("my-ns", "my-key", "my-value"), {
    message: "Failed to update KV value",
  });
});
