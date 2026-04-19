import test from "node:test";
import assert from "node:assert";
import worker from "./index.ts";

const mockEnv = {
  CONTROL_STORE: {} as KVNamespace,
  api: {} as Fetcher,
  gateway: {} as Fetcher,
};

const mockCtx = {
  waitUntil: (promise: Promise<any>) => {},
  passThroughOnException: () => {},
} as ExecutionContext;

test("fetch /status returns 200 and correct JSON", async () => {
  const request = new Request("https://control.goldshore.org/status");
  const response = await worker.fetch(request, mockEnv, mockCtx);

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.headers.get("Content-Type"), "application/json");
  const body = await response.json();
  assert.deepStrictEqual(body, { status: "ok", version: "1.0.0" });
});

test("fetch unknown route returns 404", async () => {
  const request = new Request("https://control.goldshore.org/unknown");
  const response = await worker.fetch(request, mockEnv, mockCtx);

  assert.strictEqual(response.status, 404);
  const body = await response.text();
  assert.strictEqual(body, "Not found");
});

test("fetch /status with query params returns 200", async () => {
  const request = new Request("https://control.goldshore.org/status?foo=bar");
  const response = await worker.fetch(request, mockEnv, mockCtx);

  assert.strictEqual(response.status, 200);
  const body = await response.json();
  assert.strictEqual(body.status, "ok");
});
