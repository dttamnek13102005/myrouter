---
title: "System wtyczek CLI MyRouter"
version: 3.8.40
lastUpdated: 2026-06-28
---

# System wtyczek CLI MyRouter

Rozszerzaj CLI `myrouter` bez modyfikowania jego rdzenia. Wtyczki stosują konwencję nazewnictwa `myrouter-cmd-*`, podobnie jak `gh extension` lub `kubectl plugin`.

## Szybki start

```bash
# Install a plugin from npm
myrouter plugin install stripe

# Install a local plugin in development
myrouter plugin install ./my-plugin

# List installed plugins
myrouter plugin list

# Scaffold a new plugin
myrouter plugin scaffold myplugin
cd myrouter-cmd-myplugin
myrouter plugin install .
```

## Anatomia wtyczki

Wtyczka to pakiet npm o nazwie `myrouter-cmd-<name>` (lub `@scope/myrouter-cmd-<name>`).

```
myrouter-cmd-myplugin/
├── package.json     # must have "type": "module" and "main": "index.mjs"
├── index.mjs        # exports register(program, ctx) + optional meta
└── README.md
```

### `package.json`

```json
{
  "name": "myrouter-cmd-myplugin",
  "version": "0.1.0",
  "type": "module",
  "main": "index.mjs",
  "engines": { "myrouter": ">=4.0.0" },
  "keywords": ["myrouter-plugin", "myrouter-cmd"]
}
```

### `index.mjs`

```js
export const meta = {
  name: "myplugin",
  version: "0.1.0",
  description: "My plugin for MyRouter",
  myrouterApi: ">=4.0.0",
};

export function register(program, ctx) {
  program
    .command("myplugin")
    .description(meta.description)
    .option("-n, --name <name>")
    .action(async (opts, cmd) => {
      const gOpts = cmd.optsWithGlobals();
      const res = await ctx.apiFetch("/api/combos", {
        baseUrl: gOpts.baseUrl,
        apiKey: gOpts.apiKey,
      });
      const data = await res.json();
      ctx.emit(data, gOpts);
    });
}
```

## API kontekstu wtyczki

Obiekt `ctx` przekazywany do `register(program, ctx)`:

| Property                     | Type             | Description                                                 |
| ---------------------------- | ---------------- | ----------------------------------------------------------- |
| `ctx.apiFetch(path, opts)`   | `async function` | Uwierzytelniony fetch do serwera MyRouter                  |
| `ctx.emit(data, opts)`       | `function`       | Wyjście w formacie table/json/jsonl/csv wg flagi `--output` |
| `ctx.t(key)`                 | `async function` | Wyszukiwanie tłumaczenia i18n                               |
| `ctx.withSpinner(label, fn)` | `async function` | Opakowuje async fn w spinner ora                            |
| `ctx.baseUrl`                | `string`         | Rozwiązany base URL                                         |
| `ctx.apiKey`                 | `string \| null` | Klucz API, jeśli podany                                     |

## Odkrywanie

Wtyczki są wykrywane z:

1. `~/.myrouter/plugins/<name>/` — instalacje lokalne użytkownika
2. `MYROUTER_PLUGIN_PATH` env var — niestandardowy katalog

Błędy ładowania są przechwytywane i wypisywane jako ostrzeżenia — uszkodzona wtyczka nigdy nie zawiesza CLI.

## Bezpieczeństwo

Wtyczki działają z tymi samymi uprawnieniami procesu Node.js co `myrouter`. Instaluj wtyczki wyłącznie ze źródeł, którym ufasz. `myrouter plugin install` wyświetla wyraźne ostrzeżenie i wymaga `--yes` albo interaktywnego potwierdzenia.

## Publikowanie

1. Upewnij się, że `package.json` ma `"keywords": ["myrouter-plugin"]`
2. `npm publish` jak zwykle
3. Użytkownicy odkrywają wtyczki przez `myrouter plugin search <query>` (przeszukuje rejestr npm)

## Przykładowa wtyczka

Zobacz [`examples/myrouter-cmd-hello/`](../../examples/myrouter-cmd-hello/index.mjs) — minimalny działający przykład z `meta` + `register()`.
