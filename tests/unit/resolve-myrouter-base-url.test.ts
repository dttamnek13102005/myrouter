import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_MYROUTER_BASE_URL,
  resolveMyRouterBaseUrl,
} from "../../src/shared/utils/resolveMyRouterBaseUrl.ts";

test("resolveMyRouterBaseUrl prefers MYROUTER_BASE_URL", () => {
  assert.equal(
    resolveMyRouterBaseUrl({
      MYROUTER_BASE_URL: "https://internal.example.com/",
      BASE_URL: "https://base.example.com",
      NEXT_PUBLIC_BASE_URL: "https://public.example.com",
    }),
    "https://internal.example.com"
  );
});

test("resolveMyRouterBaseUrl falls back to BASE_URL", () => {
  assert.equal(
    resolveMyRouterBaseUrl({
      BASE_URL: "https://base.example.com/",
      NEXT_PUBLIC_BASE_URL: "https://public.example.com",
    }),
    "https://base.example.com"
  );
});

test("resolveMyRouterBaseUrl falls back to NEXT_PUBLIC_BASE_URL", () => {
  assert.equal(
    resolveMyRouterBaseUrl({
      NEXT_PUBLIC_BASE_URL: "https://public.example.com/",
    }),
    "https://public.example.com"
  );
});

test("resolveMyRouterBaseUrl ignores blank values", () => {
  assert.equal(
    resolveMyRouterBaseUrl({
      MYROUTER_BASE_URL: "   ",
      BASE_URL: "",
      NEXT_PUBLIC_BASE_URL: " https://public.example.com/ ",
    }),
    "https://public.example.com"
  );
});

test("resolveMyRouterBaseUrl uses the default localhost fallback", () => {
  assert.equal(resolveMyRouterBaseUrl({}), DEFAULT_MYROUTER_BASE_URL);
});
