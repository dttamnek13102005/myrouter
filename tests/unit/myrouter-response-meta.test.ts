import test from "node:test";
import assert from "node:assert/strict";

import {
  attachMyRouterMetaHeaders,
  buildMyRouterResponseMetaHeaders,
  buildMyRouterSseMetadataComment,
  formatMyRouterCost,
  getMyRouterTokenCounts,
} from "../../src/domain/myrouterResponseMeta.ts";
import { APP_CONFIG } from "../../src/shared/constants/appConfig.ts";
import { MYROUTER_RESPONSE_HEADERS } from "../../src/shared/constants/headers.ts";

test("getMyRouterTokenCounts normalizes common usage shapes", () => {
  assert.deepEqual(
    getMyRouterTokenCounts({
      prompt_tokens: 12,
      completion_tokens: 5,
    }),
    { input: 12, output: 5 }
  );
  assert.deepEqual(
    getMyRouterTokenCounts({
      input_tokens: "9",
      output_tokens: "4",
    }),
    { input: 9, output: 4 }
  );
});

test("buildMyRouterResponseMetaHeaders formats provider alias, tokens, latency, and cost", () => {
  const headers = buildMyRouterResponseMetaHeaders({
    provider: "claude",
    model: "claude-sonnet-4-6",
    cacheHit: true,
    latencyMs: 1234.6,
    usage: {
      prompt_tokens: 11,
      completion_tokens: 7,
    },
    costUsd: 0.00123456789,
  });

  assert.equal(headers["X-MyRouter-Provider"], "cc");
  assert.equal(headers["X-MyRouter-Model"], "claude-sonnet-4-6");
  assert.equal(headers["X-MyRouter-Cache-Hit"], "true");
  assert.equal(headers["X-MyRouter-Latency-Ms"], "1235");
  assert.equal(headers["X-MyRouter-Tokens-In"], "11");
  assert.equal(headers["X-MyRouter-Tokens-Out"], "7");
  assert.equal(headers["X-MyRouter-Response-Cost"], "0.0012345679");
});

test("buildMyRouterResponseMetaHeaders keeps ASCII model header values unchanged", () => {
  const headers = buildMyRouterResponseMetaHeaders({
    provider: "openai",
    model: "gpt-4o-mini",
  });

  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.model], "gpt-4o-mini");
});

test("buildMyRouterResponseMetaHeaders percent-encodes non-ASCII model header values", () => {
  const model = "free-mix/[假流式]gemini-3.5-flash";
  const headers = buildMyRouterResponseMetaHeaders({
    provider: "openai",
    model,
  });

  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.model], encodeURIComponent(model));
  assert.doesNotThrow(() => new Headers(headers));
});

test("buildMyRouterResponseMetaHeaders strips control characters from string header values", () => {
  const headers = buildMyRouterResponseMetaHeaders({
    provider: "openai",
    model: "free\r\nX-Injected: yes\u0000-model",
    requestId: "req-1\nreq-2\rreq-3\u0007",
  });

  assert.doesNotMatch(headers[MYROUTER_RESPONSE_HEADERS.model], /[\r\n\u0000-\u001f\u007f]/);
  assert.doesNotMatch(headers[MYROUTER_RESPONSE_HEADERS.requestId], /[\r\n\u0000-\u001f\u007f]/);
  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.model], "freeX-Injected: yes-model");
  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.requestId], "req-1req-2req-3");
  assert.doesNotThrow(() => new Headers(headers));
});

test("buildMyRouterResponseMetaHeaders always emits X-MyRouter-Version", () => {
  const headers = buildMyRouterResponseMetaHeaders({ provider: "openai", model: "gpt" });
  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.version], APP_CONFIG.version);

  // Even with no provider/model at all, the version is still attached.
  const bare = buildMyRouterResponseMetaHeaders({});
  assert.equal(bare[MYROUTER_RESPONSE_HEADERS.version], APP_CONFIG.version);
});

test("buildMyRouterResponseMetaHeaders emits X-MyRouter-Request-Id only when provided", () => {
  const withId = buildMyRouterResponseMetaHeaders({ model: "gpt", requestId: "req-123" });
  assert.equal(withId[MYROUTER_RESPONSE_HEADERS.requestId], "req-123");

  const noId = buildMyRouterResponseMetaHeaders({ model: "gpt" });
  assert.equal(noId[MYROUTER_RESPONSE_HEADERS.requestId], undefined);

  const nullId = buildMyRouterResponseMetaHeaders({ model: "gpt", requestId: null });
  assert.equal(nullId[MYROUTER_RESPONSE_HEADERS.requestId], undefined);

  const blankId = buildMyRouterResponseMetaHeaders({ model: "gpt", requestId: "   " });
  assert.equal(blankId[MYROUTER_RESPONSE_HEADERS.requestId], undefined);
});

test("attachMyRouterMetaHeaders mutates a Headers instance in place, preserving existing entries", () => {
  const headers = new Headers({ "Content-Type": "application/json" });
  attachMyRouterMetaHeaders(headers, {
    provider: "openai",
    model: "gpt",
    requestId: "req-abc",
  });

  assert.equal(headers.get("Content-Type"), "application/json");
  assert.equal(headers.get(MYROUTER_RESPONSE_HEADERS.version), APP_CONFIG.version);
  assert.equal(headers.get(MYROUTER_RESPONSE_HEADERS.requestId), "req-abc");
  assert.equal(headers.get(MYROUTER_RESPONSE_HEADERS.model), "gpt");
});

test("attachMyRouterMetaHeaders mutates a plain record in place, preserving existing entries", () => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  attachMyRouterMetaHeaders(headers, {
    provider: "openai",
    model: "gpt",
  });

  assert.equal(headers["Content-Type"], "application/json");
  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.version], APP_CONFIG.version);
  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.model], "gpt");
  // No requestId provided → header omitted.
  assert.equal(headers[MYROUTER_RESPONSE_HEADERS.requestId], undefined);
});

test("buildMyRouterSseMetadataComment emits comment lines compatible with SSE", () => {
  const comment = buildMyRouterSseMetadataComment({
    provider: "openai",
    model: "gpt-4o-mini",
    usage: {
      prompt_tokens: 4,
      completion_tokens: 2,
    },
    latencyMs: 50,
    costUsd: formatMyRouterCost(0),
  });

  assert.match(comment, /^: x-myrouter-cache-hit=false/m);
  assert.match(comment, /^: x-myrouter-provider=openai/m);
  assert.match(comment, /^: x-myrouter-model=gpt-4o-mini/m);
  assert.match(comment, /^: x-myrouter-tokens-in=4/m);
  assert.match(comment, /^: x-myrouter-tokens-out=2/m);
  assert.match(comment, /^: x-myrouter-response-cost=0\.0000000000/m);
});

test("buildMyRouterResponseMetaHeaders emits X-MyRouter-Cost-Saved only when costSavedUsd is provided", () => {
  // Cache HIT: the incremental cost of serving the hit is 0, but the cache saved the
  // original (would-have-been) cost — surfaced via the Cost-Saved header for analytics.
  const hit = buildMyRouterResponseMetaHeaders({
    provider: "openai",
    model: "gpt-4o",
    cacheHit: true,
    costUsd: 0,
    costSavedUsd: 0.0125,
  });
  assert.equal(hit[MYROUTER_RESPONSE_HEADERS.responseCost], "0.0000000000");
  assert.equal(hit[MYROUTER_RESPONSE_HEADERS.costSaved], "0.0125000000");

  // A normal response (no costSavedUsd) omits the Cost-Saved header entirely.
  const miss = buildMyRouterResponseMetaHeaders({
    provider: "openai",
    model: "gpt-4o",
    costUsd: 0.0125,
  });
  assert.equal(miss[MYROUTER_RESPONSE_HEADERS.costSaved], undefined);

  // A free-model HIT still emits Cost-Saved (= 0) — it explicitly passed costSavedUsd.
  const freeHit = buildMyRouterResponseMetaHeaders({
    cacheHit: true,
    costUsd: 0,
    costSavedUsd: 0,
  });
  assert.equal(freeHit[MYROUTER_RESPONSE_HEADERS.costSaved], "0.0000000000");
});

test("attachMyRouterMetaHeaders forwards costSavedUsd onto a Headers bag", () => {
  const headers = new Headers({ "Content-Type": "application/json" });
  attachMyRouterMetaHeaders(headers, {
    provider: "openai",
    model: "gpt-4o",
    cacheHit: true,
    costUsd: 0,
    costSavedUsd: 0.0125,
  });
  assert.equal(headers.get(MYROUTER_RESPONSE_HEADERS.responseCost), "0.0000000000");
  assert.equal(headers.get(MYROUTER_RESPONSE_HEADERS.costSaved), "0.0125000000");
});
