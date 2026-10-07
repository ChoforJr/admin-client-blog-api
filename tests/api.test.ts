import { afterEach, describe, expect, it, vi } from "vitest";
import {
  apiRequest,
  ApiRequestError,
  getApiError,
  getWebSocketUrl,
} from "../src/lib/api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getApiError", () => {
  it("prefers an API message", () => {
    expect(getApiError({ message: "Request rejected" }, "Fallback")).toBe(
      "Request rejected",
    );
  });

  it("supports string and nested API errors", () => {
    expect(getApiError({ error: "Not authorized" }, "Fallback")).toBe(
      "Not authorized",
    );
    expect(
      getApiError({ error: { message: "Validation failed" } }, "Fallback"),
    ).toBe("Validation failed");
  });

  it("uses the fallback for unrecognized responses", () => {
    expect(getApiError({ details: "missing" }, "Fallback")).toBe("Fallback");
  });

  it("sends requests with cookie credentials and no authorization token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest<{ ok: boolean }>("/admin/profile")).resolves.toEqual({
      ok: true,
    });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options.credentials).toBe("include");
    expect(new Headers(options.headers).has("Authorization")).toBe(false);
  });

  it("reports the failing endpoint and HTTP status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(
      apiRequest("/admin/post/comment/24", { method: "DELETE" }),
    ).rejects.toMatchObject({
      name: "ApiRequestError",
      message: "DELETE /admin/post/comment/24 failed (403): Forbidden",
      status: 403,
      path: "/admin/post/comment/24",
      method: "DELETE",
    } satisfies Partial<ApiRequestError>);
  });

  it("builds the native realtime WebSocket endpoint", () => {
    const url = new URL(getWebSocketUrl());
    expect(["ws:", "wss:"]).toContain(url.protocol);
    expect(url.pathname.endsWith("/ws")).toBe(true);
  });
});
