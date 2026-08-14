import test from "node:test";
import assert from "node:assert/strict";
import { MYROUTER_RESPONSE_HEADERS } from "../../src/shared/constants/headers.ts";
import { buildMyRouterResponseMetaHeaders } from "../../src/domain/myrouterResponseMeta.ts";

test("headers constant exposes the fallback-attempts key", () => {
  assert.equal(
    MYROUTER_RESPONSE_HEADERS.fallbackAttempts,
    "X-MyRouter-Fallback-Attempts"
  );
});

test("buildMyRouterResponseMetaHeaders emits the fallback-attempts count when > 0", () => {
  const h = buildMyRouterResponseMetaHeaders({ model: "gpt", provider: "openai", fallbackAttempts: 2 });
  assert.equal(h["X-MyRouter-Fallback-Attempts"], "2");
});

test("buildMyRouterResponseMetaHeaders omits the header when 0 / absent", () => {
  const none = buildMyRouterResponseMetaHeaders({ model: "gpt" });
  assert.equal(none["X-MyRouter-Fallback-Attempts"], undefined);
  const zero = buildMyRouterResponseMetaHeaders({ model: "gpt", fallbackAttempts: 0 });
  assert.equal(zero["X-MyRouter-Fallback-Attempts"], undefined);
});
