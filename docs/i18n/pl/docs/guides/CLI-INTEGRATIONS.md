---
title: "Integracje CLI — skieruj dowolne CLI do kodowania na MyRouter"
version: 3.8.40
lastUpdated: 2026-06-28
---

# Integracje CLI

MyRouter dostarcza rodzinę poleceń `setup-*`, które konfigurują CLI do
kodowania (Codex, Claude Code, OpenCode, Cline, …) tak, by używało MyRouter jako backendu —
narzędzie rozmawia z **jednym** endpointem, a MyRouter kieruje ruch do właściwego providera z
auto-fallbackiem. Każde polecenie odczytuje **aktualny** katalog modeli z działającego
MyRouter (lokalnego lub zdalnego) i zapisuje plik konfiguracyjny narzędzia na **Twojej**
maszynie. Klucz API jest odwoływany przez zmienną środowiskową wszędzie tam, gdzie narzędzie
to obsługuje. Polecenia zapisujące lokalny plik środowiska narzędzia są opisane poniżej.

Są też dwa launchery — `myrouter launch` (Claude Code) oraz
`myrouter launch-codex` (Codex) — które uruchamiają CLI z wstrzykniętym właściwym env,
bez zapisywania jakiejkolwiek konfiguracji.

Jednorazową, ręczną konfigurację bazową dwóch najbogatszych integracji znajdziesz w
szczegółowych przewodnikach per narzędzie:

- [Konfiguracja Claude Code](./CLAUDE-CODE-CONFIGURATION.md)
- [Konfiguracja Codex CLI](./CODEX-CLI-CONFIGURATION.md)
- [Tryb zdalny](./REMOTE-MODE.md) — steruj zdalnym MyRouter (VPS / Tailnet) z laptopa

---

## Tabela główna

Każde polecenie respektuje **aktywny kontekst** (ustawiany przez `myrouter connect`, zob.
[Tryb zdalny](./REMOTE-MODE.md)) albo jawne flagi `--remote <url> --api-key <key>`.
„Lokalnie vs zdalnie” poniżej oznacza: bez flag celuje w `http://localhost:20128`;
z `--remote` (lub aktywnym kontekstem zdalnym) pobiera katalog z tego
serwera i zapisuje konfigurację lokalnie.

| Polecenie                  | Narzędzie                    | Co zapisuje                                                                                                                              | Kluczowe flagi                                                                                    | Lokalnie vs zdalnie |
| -------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------- |
| `myrouter setup-codex`    | OpenAI Codex CLI             | `~/.codex/<name>.config.toml` — jeden profil na kompatybilny model tekstowy (`codex --profile <name>`)                                   | `--remote` `--api-key` `--only` `--dry-run` `--port` `--codex-home`                               | Oba                 |
| `myrouter setup-claude`   | Claude Code                  | `~/.claude/profiles/<name>/settings.json` — jeden profil na dopasowany model (`CLAUDE_CONFIG_DIR`)                                       | `--remote` `--api-key` `--only` `--dry-run` `--port` `--claude-home`                              | Oba                 |
| `myrouter setup-opencode` | OpenCode (openai-compatible) | `~/.config/opencode/opencode.json` — provider `myrouter` z każdym modelem z katalogu (`opencode -m myrouter/<model>`)                  | `--remote` `--api-key` `--only` `--model` `--dry-run` `--port`                                    | Oba                 |
| `myrouter setup-cline`    | Cline                        | `~/.cline/data/{globalState,secrets}.json` (tryb CLI) + wypisuje ustawienia rozszerzenia VS Code                                         | `--remote` `--api-key` `--model` `--yes` `--dry-run` `--port` `--cline-dir`                       | Oba                 |
| `myrouter setup-kilo`     | Kilo Code                    | `~/.local/share/kilo/auth.json` (CLI) + scala `kilocode.*` do VS Code `settings.json`, jeśli istnieje                                    | `--remote` `--api-key` `--model` `--yes` `--dry-run` `--port` `--auth-path` `--vscode-settings`   | Oba                 |
| `myrouter setup-continue` | Continue / `cn` CLI          | `~/.continue/config.yaml` — modele `provider: openai`, klucz przez `${{ secrets.MYROUTER_API_KEY }}`                                    | `--remote` `--api-key` `--only` `--dry-run` `--port` `--config-path`                              | Oba                 |
| `myrouter setup-cursor`   | Cursor                       | Nic — wypisuje kroki w aplikacji (konfiguracja Cursor to nieprzezroczysty SQLite)                                                        | `--remote` `--api-key` `--only` `--port`                                                          | Oba                 |
| `myrouter setup-roo`      | Roo Code                     | `~/.myrouter/roo-settings.json` (dokument importu) + ustawia `roo-cline.autoImportSettingsPath`, jeśli istnieje VS Code `settings.json` | `--remote` `--api-key` `--model` `--yes` `--dry-run` `--port` `--import-path` `--vscode-settings` | Oba                 |
| `myrouter setup-crush`    | Crush                        | `~/.config/crush/crush.json` — provider `openai-compat`, klucz przez `$MYROUTER_API_KEY`                                                | `--remote` `--api-key` `--only` `--dry-run` `--port` `--config-path`                              | Oba                 |
| `myrouter setup-goose`    | Goose                        | `~/.config/goose/config.yaml` (`GOOSE_PROVIDER`/`OPENAI_HOST`/`GOOSE_MODEL`) + wypisuje przepis env                                      | `--remote` `--api-key` `--model` `--yes` `--dry-run` `--port` `--config-path`                     | Oba                 |
| `myrouter setup-aider`    | Aider                        | `~/.aider.conf.yml` (`openai-api-base` + `model: openai/<id>`) + wypisuje przepis env                                                    | `--remote` `--api-key` `--model` `--yes` `--dry-run` `--port` `--config-path`                     | Oba                 |
| `myrouter setup-qwen`     | Qwen Code                    | `~/.qwen/settings.json` — tablica V4 `modelProviders.openai` + `MYROUTER_API_KEY` w `~/.qwen/.env`                                      | `--remote` `--api-key` `--model` `--yes` `--dry-run` `--port` `--config-path` `--env-path`        | Oba                 |
| `myrouter launch`         | Claude Code                  | Nic — uruchamia `claude` z wstrzykniętymi `ANTHROPIC_BASE_URL`/`ANTHROPIC_AUTH_TOKEN`                                                    | `--remote` `--api-key` `--token` `--profile` `--port`                                             | Oba                 |
| `myrouter launch-codex`   | OpenAI Codex CLI             | Nic — uruchamia `codex` z providerem `myrouter` wstrzykniętym przez flagi `-c`                                                          | `--remote` `--api-key` `--profile` (`-p`) `--port`                                                | Oba                 |

Uwagi o flagach (zweryfikowane w źródle poleceń):

- `--remote <url>` — pobierz katalog ze zdalnego MyRouter (nadpisuje `--port`
  i aktywny kontekst). `--api-key <key>` podaje poświadczenie dla tego
  serwera (domyślnie zmienna env `MYROUTER_API_KEY` albo token aktywnego kontekstu).
- `--only <patterns>` — podłańcuchy rozdzielone przecinkami; zachowaj tylko ID modeli, które pasują
  (np. `--only glm,kimi`). Dostępne w `setup-codex`, `setup-claude`,
  `setup-opencode`, `setup-continue`, `setup-cursor`, `setup-crush`.
- `--dry-run` — wypisz dokładnie to, co zostałoby zapisane, bez ruszania
  systemu plików. Dostępne w każdym poleceniu `setup-*` **oprócz** `setup-cursor`
  (które nigdy nie zapisuje pliku).
- `--model <id>` — wymagane (lub wybierane interaktywnie) dla narzędzi bez
  auto-odkrywania modeli: Cline, Kilo, Roo, Goose, Qwen, Aider. Te narzędzia
  przyjmują też `--yes` do uruchomień nieinteraktywnych (wtedy wymaga `--model`).
  `setup-opencode` przyjmuje `--model`, by ustawić domyślny model najwyższego poziomu.
- `--port <port>` — lokalny port MyRouter (domyślnie `20128`, ignorowany gdy ustawione `--remote`).
  Obecne we wszystkich `setup-*` i obu launcherach.
- Oba launchery (`launch`, `launch-codex`) przyjmują `--profile <name>`, by wybrać
  profil zapisany przez `setup-claude` / `setup-codex`, plus argumenty przekazywane do
  leżącego poniżej binarium `claude` / `codex`.

> `setup-opencode` to **lekka, openai-compatible** integracja OpenCode.
> Jest też bogatsza integracja wtyczkowa — `myrouter setup opencode` — która
> instaluje `@myrouter/opencode-plugin`. To różne polecenia; tabela
> powyżej dokumentuje `setup-opencode`.

---

## Użycie lokalne

Przy MyRouter działającym na `localhost:20128` wystarczy uruchomić polecenie setup dla swojego
narzędzia. Katalog jest pobierany z lokalnego serwera.

```bash
# Codex: write a profile per matched model into ~/.codex/
myrouter setup-codex
codex --profile glm52            # use a generated profile

# Claude Code: write per-model profiles, then launch one
myrouter setup-claude
myrouter launch --profile glm52

# OpenCode: write the openai-compatible provider with all catalog models
myrouter setup-opencode
export MYROUTER_API_KEY=sk-...  # referenced via {env:MYROUTER_API_KEY}, never on disk
opencode -m myrouter/glm/glm-5.2 "..."

# Tools without auto-discovery need an explicit model:
myrouter setup-aider --model glm/glm-5.2
myrouter setup-qwen --model qwen/qwen3.8-max-preview

# Preview without writing anything:
myrouter setup-continue --dry-run
```

Uruchomienie bez zapisywania jakiejkolwiek konfiguracji (tylko wstrzykiwanie env):

```bash
myrouter launch                 # Claude Code → local MyRouter
myrouter launch-codex           # Codex CLI → local MyRouter
myrouter launch-codex --profile glm52
```

---

## Użycie zdalne

Skieruj dowolne polecenie setup na zdalne MyRouter przez `--remote` + `--api-key`.
Katalog jest pobierany ze zdalnego serwera; konfiguracja jest zapisywana na Twojej lokalnej maszynie.

```bash
# OpenCode against a remote VPS, keep only glm/kimi models
myrouter setup-opencode --remote http://192.168.0.15:20128 --api-key oma_live_xxx \
  --only glm,kimi
opencode -m myrouter/glm/glm-5.2 "..."   # export MYROUTER_API_KEY first

# Codex profiles from a remote catalog
myrouter setup-codex --remote http://192.168.0.15:20128 --api-key oma_live_xxx

# Launch a CLI straight against the remote
myrouter launch       --remote http://192.168.0.15:20128 --api-key oma_live_xxx
myrouter launch-codex --remote http://192.168.0.15:20128 --api-key oma_live_xxx
```

Zamiast podawać `--remote`/`--api-key` za każdym razem, zaloguj się raz i pozwól, by
**aktywny kontekst** dostarczał je automatycznie:

```bash
myrouter connect 192.168.0.15        # mints a scoped token, stores the context
myrouter setup-codex                 # ← now uses the remote catalog
myrouter setup-opencode              # ← same
myrouter launch                      # ← Claude Code against the remote
```

Zobacz [Tryb zdalny](./REMOTE-MODE.md) o kontekstach, zakresach i zarządzaniu tokenami.

---

## Konwencje Base URL (które narzędzia chcą `/v1`)

MyRouter udostępnia powierzchnię OpenAI pod `/v1`, powierzchnię Anthropic w root,
oraz natywną powierzchnię Gemini pod `/v1beta`. Każda integracja jest podpięta w formie, jakiej
oczekuje jej narzędzie (zweryfikowane w źródle poleceń):

| Integracja                                                                 | Zapisywany Base URL | `/v1`?                                      |
| -------------------------------------------------------------------------- | ------------------- | ------------------------------------------- |
| `setup-cline` (`openAiBaseUrl`)                                            | root                | Nie — Cline dopina `/v1/chat/completions`   |
| `setup-goose` (`OPENAI_HOST`)                                              | root                | Nie — Goose dopina ścieżkę                  |
| `setup-aider` (`OPENAI_API_BASE`)                                          | root                | Nie — LiteLLM dopina `/v1/chat/completions` |
| `setup-kilo`, `setup-roo`, `setup-continue`, `setup-crush`, `setup-cursor` | z `/v1`             | Tak                                         |
| `setup-claude` (`ANTHROPIC_BASE_URL`), `launch`                            | root                | Nie — Claude Code dopina `/v1/messages`     |
| `setup-codex`, `launch-codex` (`model_providers.myrouter.base_url`)       | z `/v1`             | Tak                                         |
| `setup-qwen` (`modelProviders.openai[].baseUrl`)                           | z `/v1`             | Tak                                         |

---

## Zachowanie natywnych zależności przy aktualizacji: `--include=optional`

Gdy aktualizujesz przez `myrouter update` (po potwierdzeniu albo z `--apply`),
MyRouter uruchamia instalację z wbudowanym `--include=optional`:

```bash
npm install -g myrouter@latest --include=optional
```

To **nie** jest flaga, którą przekazujesz do `myrouter update` — updater zawsze ją stosuje.
Gwarantuje, że `optionalDependencies` (`better-sqlite3`, `keytar`,
`tls-client`, stos SLM LLMLingua) przetrwają aktualizację nawet gdy w konfiguracji npm
masz `omit=optional`, co w przeciwnym razie po cichu usunęłoby natywny sterownik SQLite
i powiązanie z keyringiem OS. Podgląd dokładnego polecenia bez zastosowania:

```bash
myrouter update --dry-run
# [DRY RUN] Would run: npm install -g myrouter@latest --include=optional
```

Inne flagi `myrouter update` (zweryfikowane w źródle): `--check` (exit 1, jeśli
nieaktualne), `--apply` (instalacja bez monitu), `--changelog`, `--no-backup`,
`--yes`.

---

## Zobacz też

- [Konfiguracja Claude Code](./CLAUDE-CODE-CONFIGURATION.md) — głębszy przewodnik Claude Code
- [Konfiguracja Codex CLI](./CODEX-CLI-CONFIGURATION.md) — jednorazowa konfiguracja bazowa `[model_providers.myrouter]`
- [Tryb zdalny](./REMOTE-MODE.md) — konteksty, tokeny dostępu ze scope, sterowanie zdalnym serwerem
- [Referencja narzędzi CLI](../reference/CLI-TOOLS.md) — pełny katalog obsługiwanych narzędzi + strony dashboardu
- [Przewodnik instalacji](./SETUP_GUIDE.md) — metody instalacji i onboarding przy pierwszym uruchomieniu
