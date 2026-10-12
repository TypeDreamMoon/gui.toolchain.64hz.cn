# gui.toolchain.64hz.cn — the DreamGUI documentation site

The manual for [DreamGUI](https://github.com/TypeDreamMoon/DreamGUI): a 3D UI system for Unreal Engine 5.8.
Chinese is the default locale, English lives under `/en`.

Built on the same stack as its sister sites [shader.toolchain.64hz.cn](https://shader.toolchain.64hz.cn)
(DreamShader) and [fx.toolchain.64hz.cn](https://fx.toolchain.64hz.cn) (DreamFX): Next.js + fumadocs, a
static export, and rsync over SSH for CI deployment.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # fumadocs-mdx codegen + tsc --noEmit
npm run build        # static export into out/
npm run preview      # serve out/
```

## Deploying

GitHub Actions uses incremental rsync deployment; see [DEPLOYMENT.md](DEPLOYMENT.md).
The commands below retain the existing local SFTP uploader:

```bash
cp .env.example .env       # fill in SFTP_PASSWORD or SFTP_KEY_PATH
npm run deploy:sftp        # build, then upload out/ to the web root
```

`upload.js` cleans the remote directory before uploading and preserves `.user.ini`, `.htaccess` and
`.well-known` — deleting the last one mid-renewal would break certificate issuance. It refuses any
remote directory outside `/www/wwwroot/`, and defaults to `/www/wwwroot/gui.toolchain.64hz.cn`.

### GitHub Actions

`.github/workflows/deploy.yml` runs `npm ci → typecheck → build → check-links` on every push and pull
request, and syncs `out/` over SSH on a push to `main`/`master` (or a manual **Run workflow**).
Pull requests build and check but never deploy. Publishing branches share a concurrency group,
and an active deployment finishes before the next one starts. Select **dry_run** in a manual run
to compare without changing server files.

Repository secrets (Settings ▸ Secrets and variables ▸ Actions):

| Secret | Required | Value for this site |
| --- | --- | --- |
| `SFTP_PASSWORD` | **one of these two** | the SSH password |
| `SFTP_PRIVATE_KEY` | **one of these two** | the private key, whole PEM including the header/footer lines |
| `SFTP_PASSPHRASE` | only with an encrypted key | the key's passphrase |
| `SFTP_HOST` | recommended | `8.153.161.157` |
| `SFTP_PORT` | optional | `22` |
| `SFTP_USER` | recommended | `root` |
| `SFTP_REMOTE_DIR` | recommended | `/www/wwwroot/gui.toolchain.64hz.cn` |
| `SFTP_KNOWN_HOSTS` | only for a different host/port or host-key rotation | verified known-hosts entries; see [DEPLOYMENT.md](DEPLOYMENT.md) |

## Layout

| | |
| --- | --- |
| `content/docs/` | the manual. `page.mdx` is Chinese, `page.en.mdx` is English, `meta.json` orders a section |
| `content/docs/reference/` | **generated** — the class reference, see below |
| `content/docs/diagnostics/` | **generated** — the `DUInnnn` pages, see below |
| `app/` | routes: `/` and `/docs` (zh), `/[lang]` and `/[lang]/docs` (en), plus the static search index |
| `app/_home/` | the homepage deck — one band per screen, with all copy in `copy.tsx`; the hero art is `ui-stage.tsx`, markup and CSS only |
| `app/styles/` | `tokens.css` (the only place a colour is declared), `base.css`, `docs.css`, `home.css` |
| `components/mdx/` | the site's own MDX components, registered globally in `mdx-components.tsx` |
| `lib/dui.tmLanguage.json` | the `.dui` grammar, copied from the VS Code extension (`dreamgui-language-support/syntaxes`), so a ```` ```dui ```` fence is coloured as the editor colours it |
| `scripts/` | the reference and diagnostics syncs, and the link checker |

### MDX components

Registered globally, so content never writes an import:

| | |
| --- | --- |
| `<Dui sev msg raised />` | one diagnostic's generated half — severity pill, meaning, code name |
| `<Sev s="error">` | inline severity pill |
| `<Since v ue />` | version pill |
| `<Synopsis>` | a grammar synopsis |
| `<Wide>` | scroll container for a table wider than the column |
| `<Diag>` / `<D>` | compact diagnostics table |
| `<Deprecated since use>` | deprecation banner |

Plus the fumadocs set: `Callout`, `Card(s)`, `Tab(s)`, `Step(s)`, `Accordion(s)`, `File`/`Folder`.

### Links

A Chinese page links `/docs/...`, an English page `/en/docs/...`. `scripts/check-links.py` reports an
English page linking a Chinese route (and the reverse) as broken, as well as any route or anchor the
export does not have.

## Regenerating the generated pages

Both read the plugin; neither page set is to be hand-edited.

```bash
python scripts/reference/sync.py   --plugin <path to Plugins/DreamGUI>
python scripts/diagnostics/sync.py --plugin <path to Plugins/DreamGUI>
```

- **Reference** — from the plugin's `Docs/Reference/*.md`, which the `DreamGUIReferenceDocs` commandlet
  prints from reflection. The pages stay English in both locales (they are the headers' own comments);
  the Chinese page says so at its top. HTML comments are dropped, indented code is fenced, `<` `{` `}`
  are escaped, wide tables get a scroll container, and links between classes become site routes.
- **Diagnostics** — from `EDreamUIDiagnosticCode` in `Source/DreamGUI/Public/Text/DreamUIDiagnostics.h`
  (codes, names, comments), the table in `Docs/DuiLanguage.md` (each code's meaning) and the raise sites
  in `Source/` (error or warning). The prose lives here, in `scripts/diagnostics/zh.md` and `en.md`,
  under `## DUInnnn` headings; a code with no prose in either is a hard error.

## Checking links

```bash
npm run build
python scripts/check-links.py
```

It validates every `/docs` and `/en/docs` link and `#anchor` against the export, and exits non-zero on
a miss.
