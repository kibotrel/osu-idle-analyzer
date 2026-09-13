# Coding Conventions

Standards and patterns used throughout osu-idle-score-extractor.

## Language & Framework

The project is written in **TypeScript** with **Vue 3** (Composition API, `<script setup>`) for the popup UI. Content and background scripts are plain TypeScript with no framework dependency.

---

## DOM Safety

### Vue templates (popup)

All popup UI is built with Vue's template compiler. **Never use `innerHTML`, `v-html`, or `document.createElement` inside Vue components** — the template compiler handles safe DOM construction.

```html
<!-- Correct: Vue template -->
<body>
  {{ someValue }}
</body>

<!-- Never use v-html with untrusted data -->
<div v-html="untrustedValue" />
```

### Content script (content/handlers/)

The content script does not render any UI — it only reads from the DOM (via `querySelector` / `querySelectorAll`). No dynamic DOM construction occurs there; XSS risk is not applicable.

---

## Async Patterns

### Message passing — keep the channel open

When a message handler performs async work, `return true` is required to keep the message channel open for the async response. This applies to all three contexts.

```typescript
chrome.runtime.onMessage.addListener((query, _sender, sendResponse) => {
  switch (query.name) {
    case ContentQueries.ExtractScoreData: {
      return handleExtractScoreData(query.data, sendResponse);
      // handler internally calls sendResponse asynchronously
    }
  }
});
```

The individual handler functions are `async` and resolve `sendResponse` via `.then()` / `catch()`.

### IndexedDB — single connection per extraction

Open the `beatmaps` database once and reuse the connection for both store queries within one extraction cycle. Always close the connection explicitly before resolving.

```typescript
// Pattern used in extractScoreData.handler.ts
request.addEventListener('success', (event) => {
  const db = (event.target as IDBOpenDBRequest).result;

  // query meta store
  // query files store
  // ...
  db.close(); // always close before resolve()
  resolve({ record });
});
```

### Vue composables — reactive state

Shared reactive state (e.g. `score`, `character`, `isLoading`) is declared at module scope using `ref()` so it persists across composable invocations within the same popup session.

```typescript
// Module-level reactive state — shared across all useScoreExtractor() calls
const score = ref<Score | null>(null);
const isLoading = ref<boolean>(false);

export const useScoreExtractor = () => {
  // ...
  return { score, isLoading, ... };
};
```

---

## XP Value Parsing

osu!idle displays XP gains with unit suffixes (`k`, `m`, `b`) and a trailing `xp` label (e.g. `"1.5k xp"`, `"300 xp"`). The `parseXpValue()` function in `extractScoreData.handler.ts` normalises these into plain integers:

1. Strip the trailing `xp` suffix (case-insensitive)
2. Read the last character as an optional multiplier key
3. Look up the multiplier in `StandardUnitMultipliers` from `shared/constants/maths.constants.ts`
4. Parse the numeric part with `parseFloat` and multiply

```typescript
// StandardUnitMultipliers
const StandardUnitMultipliers = {
  k: 1e3,
  m: 1e6,
  b: 1e9,
} as const;

// Examples
parseXpValue('300 xp'); // → 300
parseXpValue('1.5k xp'); // → 1500
parseXpValue('2.3m xp'); // → 2300000
```

If the string does not parse to a valid number, `parseXpValue()` returns `0` rather than `NaN`.

---

## Naming Patterns

| **What**               | **Pattern**             | **Example**                                                                                                                                                                                          |
| ---------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Handler functions      | `handle{Action}()`      | `handleExtractScoreData()`, `handleFetchCharacterData()`                                                                                                                                             |
| Extraction functions   | `extract{Thing}()`      | `extractBeatmapData()`, `extractSkillsData()`                                                                                                                                                        |
| Query functions        | `query{Thing}()`        | `getBeatmapMetadataFromIndexedDB()`                                                                                                                                                                  |
| Format functions       | `format{Format}()`      | `formatExportableData()`                                                                                                                                                                             |
| Vue composables        | `use{Feature}()`        | `useScoreExtractor()`, `useCharacter()`                                                                                                                                                              |
| Vue page components    | `{Name}.page.vue`       | `Popup.page.vue`                                                                                                                                                                                     |
| Vue tab components     | `{Name}.tab.vue`        | `ScoreExtractor.tab.vue`, `Settings.tab.vue`                                                                                                                                                         |
| Vue feature components | `{Name}.component.vue`  | `BeatmapCard.component.vue`, `ScoreSkillCard.component.vue`                                                                                                                                          |
| Vue base components    | `{Name}.base.vue`       | `Body.base.vue`, `Button.base.vue`, `Caption.base.vue`, `Headline.base.vue`, `Icon.base.vue`, `Input.base.vue`, `ProgressBar.base.vue`, `Separator.base.vue`, `Sidebar.base.vue`, `TabList.base.vue` |
| Vue icon components    | `{Name}.icon.vue`       | `Bolt.icon.vue`, `Gear.icon.vue`                                                                                                                                                                     |
| Composable files       | `{name}.composable.ts`  | `useScoreExtractor.composable.ts`                                                                                                                                                                    |
| Constant files         | `{domain}.constants.ts` | `api.constants.ts`, `data.constants.ts`                                                                                                                                                              |
| Type files             | `{domain}.types.ts`     | `internal.types.ts`, `data.type.ts`                                                                                                                                                                  |
| Method files           | `{domain}.methods.ts`   | `maths.methods.ts`, `gameplay.methods.ts`                                                                                                                                                            |
| Message type strings   | SCREAMING_SNAKE_CASE    | `'EXTRACT_SCORE_DATA'`, `'FETCH_CHARACTER'`, `'COPY_TO_CLIPBOARD'`                                                                                                                                   |
| Constant object keys   | PascalCase              | `ContentQueries.ExtractScoreData`, `BackgroundQueries.FetchCharacter`                                                                                                                                |

---

## Service Worker Constraints (background/main.ts)

`background/main.ts` runs as a Manifest V3 service worker in both Chrome and Firefox. It has no access to:

- The DOM (`document` is undefined)
- `window` object
- Persistent globals (service worker can be killed and restarted at any time)

Code in `background/` must be **stateless and event-driven only**. All persistence must go through `chrome.storage.local`.

---

## Tailwind CSS Conventions

The popup UI uses **Tailwind CSS v4** with a custom `@theme` block in `src/assets/style.css`.

### Color tokens

| **Token**                 | **Value** | **Usage**                 |
| ------------------------- | --------- | ------------------------- |
| `--color-primary-1`       | `#fafafa` | Primary text              |
| `--color-primary-2`       | `#a1a1aa` | Secondary / muted text    |
| `--color-primary-3`       | `#27272a` | Card / surface background |
| `--color-primary-4`       | `#0a0a0b` | App background            |
| `--color-faded-primary-1` | `#444446` | Card borders              |
| `--color-faded-primary-2` | `#2e2e31` | —                         |
| `--color-faded-primary-3` | `#0a0a0b` | —                         |
| `--color-faded-blue`      | `#1a2e48` | —                         |
| `--color-faded-green`     | `#093e23` | —                         |
| `--color-faded-red`       | `#471e20` | —                         |
| `--color-faded-yellow`    | `#453700` | —                         |

Use Tailwind utility classes (e.g. `bg-primary-3`, `text-primary-2`, `border-faded-primary-1`) rather than raw hex values in component styles.

### Scoped styles

Component-level styles use `<style scoped>` with `@reference '#/assets/style.css'` to enable Tailwind utility classes inside scoped blocks:

```html
<style scoped>
  @reference '#/assets/style.css';

  .my-element {
    @apply bg-primary-3 border border-faded-primary-1 rounded-lg p-2;
  }
</style>
```

### Design system constants

Component variants and icon names are driven by typed constants in `shared/constants/designSystem.constants.ts`. Always use these constants rather than raw strings when passing props to base components.

| **Constant**        | **Used by**          | **Available values**                                             |
| ------------------- | -------------------- | ---------------------------------------------------------------- |
| `BodyVariants`      | `Body.base.vue`      | `Base`, `Small`                                                  |
| `ButtonVariants`    | `Button.base.vue`    | `Danger`, `Ghost`, `Primary`, `Secondary`, `Success`, `Warning`  |
| `CaptionVariants`   | `Caption.base.vue`   | `Base`                                                           |
| `HeadlineVariants`  | `Headline.base.vue`  | `Subtitle`, `Title`                                              |
| `Icons`             | `Icon.base.vue`      | `ArrowPath`, `Bolt`, `Gear`, `Loading`, `PencilSquare`, and more |
| `InputTypes`        | `Input.base.vue`     | `Number`, `Text`                                                 |
| `InputVariants`     | `Input.base.vue`     | `Ghost`, `Primary`                                               |
| `SeparatorVariants` | `Separator.base.vue` | `Dashed`, `Primary`                                              |

### Layout conventions

- Popup root width: `w-lg` (Tailwind `lg` spacing)
- Skill cards grid: `grid grid-cols-3 gap-2` (Score Extractor tab)
- Character skill cards grid: `grid grid-cols-2 gap-y-2 gap-x-4` (Settings tab)
- Sidebar navigation: vertical flex column with icon + label tabs

---

## DOM Selector Reference

All selectors depend on osu!idle's HTML structure and must be verified if the site updates. Used exclusively in `src/content/handlers/extractScoreData.handler.ts`.

| **Element**          | **Selector**           | **Purpose**                                            |
| -------------------- | ---------------------- | ------------------------------------------------------ |
| Song title container | `.result__title`       | Parent element — text nodes contain "Artist - Title"   |
| Beatmap version      | `.result__version`     | Child of `.result__title`; text content is `[Version]` |
| Skills container     | `.result__progression` | Parent of all skill rows                               |
| Individual skill row | `.skillxp__row`        | Wrapper for one skill entry                            |
| Skill name           | `.skillxp__name`       | Text name of the skill                                 |
| XP gain value        | `.skillxp__gain`       | Numeric XP gained string (stripped of non-digit chars) |

> **Note on title extraction:** The artist-title string is extracted from the _text nodes_ of `.result__title`, explicitly filtering out element nodes (including the `.result__version` child). This avoids including the difficulty name in the artist-title lookup string.
