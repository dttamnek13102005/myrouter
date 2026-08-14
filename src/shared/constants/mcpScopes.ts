/**
 * MCP Authorization Scopes — Defines permission scopes for each MCP tool.
 *
 * Each tool requires specific scopes to execute. API keys can be configured
 * with a subset of scopes to limit tool access (least-privilege).
 */

// ============ Scope Definitions ============

/** All available MCP scopes */
export const MCP_SCOPE_LIST = [
  "read:health",
  "read:combos",
  "write:combos",
  "read:quota",
  "read:usage",
  "read:models",
  "execute:completions",
  "execute:search",
  "write:budget",
  "write:resilience",
  "pricing:write",
  "read:cache",
  "write:cache",
  "read:compression",
  "write:compression",
  "read:proxies",
] as const;

export type McpScope = (typeof MCP_SCOPE_LIST)[number];

// ============ Tool → Scope Mapping ============

/** Maps each MCP tool to its required scopes */
export const MCP_TOOL_SCOPES: Record<string, readonly McpScope[]> = {
  // Phase 1: Essential Tools
  myrouter_get_health: ["read:health"],
  myrouter_list_combos: ["read:combos"],
  myrouter_get_combo_metrics: ["read:combos"],
  myrouter_switch_combo: ["write:combos"],
  myrouter_check_quota: ["read:quota"],
  myrouter_route_request: ["execute:completions"],
  myrouter_web_search: ["execute:search"],
  myrouter_web_fetch: ["execute:search"],
  myrouter_cost_report: ["read:usage"],
  myrouter_list_models_catalog: ["read:models"],

  // Phase 2: Advanced Tools
  myrouter_simulate_route: ["read:health", "read:combos"],
  myrouter_set_budget_guard: ["write:budget"],
  myrouter_set_resilience_profile: ["write:resilience"],
  myrouter_test_combo: ["execute:completions", "read:combos"],
  myrouter_get_provider_metrics: ["read:health"],
  myrouter_best_combo_for_task: ["read:combos", "read:health"],
  myrouter_explain_route: ["read:health", "read:usage"],
  myrouter_get_session_snapshot: ["read:usage"],
  myrouter_db_health_check: ["read:health", "write:resilience"],
  myrouter_sync_pricing: ["pricing:write"],
  myrouter_cache_stats: ["read:cache"],
  myrouter_cache_flush: ["write:cache"],
  myrouter_compression_status: ["read:compression"],
  myrouter_compression_configure: ["write:compression"],
  myrouter_set_compression_engine: ["write:compression"],
  myrouter_list_compression_combos: ["read:compression"],
  myrouter_compression_combo_stats: ["read:compression"],
  myrouter_ccr_store: ["write:compression"],
  myrouter_ccr_retrieve: ["read:compression"],
  myrouter_ccr_inspect: ["read:compression"],
  myrouter_ccr_list: ["read:compression"],
  myrouter_ccr_delete: ["write:compression"],
  myrouter_ccr_stats: ["read:compression"],
  myrouter_oneproxy_fetch: ["read:proxies"],
  myrouter_oneproxy_rotate: ["read:proxies"],
  myrouter_oneproxy_stats: ["read:proxies"],

  // Web-session pool observability (read) + lifecycle (write)
  myrouter_pool_status: ["read:health"],
  myrouter_pool_sessions: ["read:health"],
  myrouter_pool_health: ["read:health"],
  myrouter_pool_reset: ["write:resilience"],
  myrouter_pool_warm: ["write:resilience"],
  // Stealth browser pool observability (#3368 PR7)
  myrouter_browser_pool_status: ["read:health"],
} as const;
