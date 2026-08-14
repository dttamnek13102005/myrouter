/**
 * One-shot regen of ~/.config/opencode/opencode.json from the live
 * MyRouter /v1/models catalog. Run after a catalog change to refresh
 * the opencode client.
 *
 * Usage:  bun run scripts/regen-opencode-config.ts
 *      or npx tsx scripts/regen-opencode-config.ts
 */
import { generateOpencodeConfig } from "../src/lib/cli-helper/config-generator/opencode.ts";

const baseURL = process.env.MYROUTER_URL ?? "http://localhost:20128";
const apiKey = process.env.MYROUTER_KEY ?? process.env.OPENCODE_API_KEY ?? "";

if (!apiKey) {
  console.error(
    "MYROUTER_KEY (or OPENCODE_API_KEY) env var is required. " +
      "Find it in MyRouter dashboard → Settings → API Keys."
  );
  process.exit(1);
}

const out = await generateOpencodeConfig({ baseUrl: baseURL, apiKey });
console.log(out);
