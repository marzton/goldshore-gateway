import { expect, test, describe } from "bun:test";
import { corsHeaders } from "./cors";

describe("corsHeaders", () => {
  const env = {
    CORS_ALLOWED: JSON.stringify(["https://example.com", "https://test.com"])
  };

  test("returns headers for allowed origin", () => {
    const headers = corsHeaders("https://example.com", env as any);
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://example.com");
    expect(headers["Access-Control-Allow-Credentials"]).toBe("true");
  });

  test("returns empty object for disallowed origin", () => {
    const headers = corsHeaders("https://malicious.com", env as any);
    expect(headers).toEqual({});
  });

  test("handles update to CORS_ALLOWED", () => {
    corsHeaders("https://example.com", env as any);

    const newEnv = {
      CORS_ALLOWED: JSON.stringify(["https://new.com"])
    };

    const headersOld = corsHeaders("https://example.com", newEnv as any);
    expect(headersOld).toEqual({});

    const headersNew = corsHeaders("https://new.com", newEnv as any);
    expect(headersNew["Access-Control-Allow-Origin"]).toBe("https://new.com");
  });

  test("handles invalid JSON gracefully", () => {
    const badEnv = {
      CORS_ALLOWED: "not-json"
    };
    const headers = corsHeaders("https://example.com", badEnv as any);
    expect(headers).toEqual({});
  });
});
