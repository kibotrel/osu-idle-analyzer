# Installation & Setup

How to load, build, and test osu-idle-score-extractor locally.

## Prerequisites

- **Node.js** — version specified in `.nvmrc` (use `nvm use` to switch automatically)
- **pnpm** — used as the package manager
- A Chromium-based browser or Firefox for testing
- Access to `https://osu.idle.rhythmgamers.net/` for live testing

Install dependencies from the project root:

```bash
pnpm install
```

---

## Development (Load Unpacked)

The Vite dev server uses `@crxjs/vite-plugin` to produce a `dist/` directory that can be loaded as an unpacked extension.

### Start the dev server

```bash
pnpm dev
```

This starts Vite in watch mode and outputs the extension to `dist/`.

### Chrome

1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `dist/` directory
5. The extension appears in the toolbar

### Firefox

1. Open `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on...**
4. Navigate to `dist/` and select `manifest.json`
5. The extension appears in the toolbar

> [!NOTE]
> Firefox temporary add-ons are removed when the browser restarts. Reload via `about:debugging` after each restart.

---

## Build for Distribution

Run the build script from the project root:

```bash
pnpm build
```

This runs `vue-tsc` (type check) followed by `vite build` and produces:

- `dist/` — the compiled extension directory
- `release/{name}-{version}.zip` — a distributable zip (Chrome Web Store / Firefox Add-ons ready)

The version is read from `package.json`.

---

## Testing the Extension

1. Navigate to `https://osu.idle.rhythmgamers.net/`
2. Play a song and reach the result screen
3. Click the extension icon in the toolbar to open the popup
4. Click **Extract** — skill cards and beatmap info should render

---

## Reloading After Code Changes

With `pnpm dev` running, Vite watches for file changes and automatically rebuilds `dist/`. After a rebuild:

### Chrome

- Go to `chrome://extensions/` and click the **↺ Reload** button on the extension card
- If you changed `content/main.ts`, also refresh the osu!idle tab

### Firefox

- Go to `about:debugging` → **This Firefox** → click **Reload** on the extension entry
- Refresh the osu!idle tab after reloading

---

## Other Scripts

| **Command**        | **Description**                                    |
| ------------------ | -------------------------------------------------- |
| `pnpm format`      | Format source files with `oxfmt`                   |
| `pnpm lint`        | Lint source files with `oxlint`                    |
| `pnpm spellcheck`  | Run `cspell` spell-check across the project        |
