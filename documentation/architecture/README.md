# Architecture

Overview of the osu-idle-score-extractor extension architecture.

## File Structure

```
osu-idle-score-extractor/
├── manifest.config.ts             # Browser-agnostic Manifest V3 config (read by Vite)
├── vite.config.ts                 # Vite + crxjs + Vue + Tailwind build config
├── package.json                   # pnpm project manifest
├── src/
│   ├── assets/
│   │   └── style.css              # Global Tailwind v4 stylesheet + @theme tokens
│   ├── background/
│   │   ├── main.ts                # Background service worker entry — message router
│   │   └── handlers/
│   │       ├── copyTocClipboard.handler.ts   # Clipboard write via scripting API
│   │       └── fetchCharacter.handler.ts     # osu!idle character API fetch + storage
│   ├── content/
│   │   ├── main.ts                # Content script entry — message router
│   │   └── handlers/
│   │       └── extractScoreData.handler.ts   # DOM extraction + IndexedDB queries
│   ├── popup/
│   │   ├── index.html             # Popup HTML shell (mounts #popup)
│   │   ├── main.ts                # Vue app bootstrap
│   │   ├── Popup.page.vue         # Root popup component with sidebar + tab routing
│   │   └── tabs/
│   │       ├── score-extractor/   # Score Extractor tab (components + composable)
│   │       └── settings/          # Settings tab (components + composable)
│   └── shared/
│       ├── components/
│       │   ├── base/              # Base UI components: Body, Button, Caption, Headline, Icon, Input, ProgressBar, Separator, Sidebar, TabList
│       │   └── icons/             # SVG icon components (ArrowPath, Bolt, Gear, Loading, etc.)
│       ├── constants/             # Typed constant objects (API, data, design system, maths, internal)
│       ├── methods/               # Pure utility functions (gameplay, maths, internal)
│       └── types/                 # TypeScript interfaces and type aliases
├── public/                        # Static extension icons (16, 32, 48, 128 px)
├── dist/                          # Vite build output (loaded unpacked during development)
├── release/                       # Zip output from vite-plugin-zip-pack
└── documentation/                 # This folder
```

## Component Roles

| **Component**                 | **Context**     | **Responsibilities**                                                                                                                     |
| ----------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `background/main.ts`          | Service worker  | Routes incoming messages to the appropriate handler                                                                                      |
| `background/handlers/`        | Service worker  | `fetchCharacter` — fetches osu!idle character API and persists to `chrome.storage.local`; `copyTocClipboard` — clipboard write fallback  |
| `content/main.ts`             | osu!idle page   | Routes incoming messages to the appropriate handler                                                                                      |
| `content/handlers/`           | osu!idle page   | `extractScoreData` — DOM extraction, IndexedDB queries, score persistence to `chrome.storage.local`                                      |
| `popup/Popup.page.vue`        | Extension popup | Root component; renders sidebar navigation and routes to the active tab                                                                  |
| `popup/tabs/score-extractor/` | Extension popup | Score Extractor tab — triggers extraction, displays beatmap card + skill cards, handles clipboard copy                                   |
| `popup/tabs/settings/`        | Extension popup | Settings tab — displays character card (avatar, name, level) + per-skill progress bars; allows character ID input                        |
| `shared/components/`          | Popup (Vue)     | Reusable base components (`Button`, `Input`, `ProgressBar`, `Sidebar`, etc.) and icon components                                         |
| `shared/constants/`           | All contexts    | Typed constant objects for API endpoints, data defaults, design system tokens, and message names                                         |
| `shared/methods/`             | All contexts    | Pure utility functions: `gameplay.methods.ts` (XP curve), `maths.methods.ts` (Bezier, duration, rates), `internal.methods.ts` (blob→URL) |
| `shared/types/`               | All contexts    | TypeScript interfaces and type aliases shared across content, popup, and background                                                      |
| `manifest.config.ts`          | Build time      | Declares MV3 manifest fields; version and metadata read from `package.json`                                                              |

## Messaging Protocol

All cross-context communication uses MV3 `chrome.runtime` messaging. Messages follow a `{ name, data }` shape with names drawn from typed constants.

```typescript
// popup → content: extract score data from the result page DOM
chrome.tabs.sendMessage<ContentExtractScoreDataQuery>(
  activeTab.id,
  { name: ContentQueries.ExtractScoreData, data: {} as Record<string, never> },
  (response: ContentExtractScoreDataResponse) => { ... }
);

// content listener
chrome.runtime.onMessage.addListener(
  (query: ContentQuery, _sender, sendResponse: (response: unknown) => void) => {
    const { data, name } = query;

    switch (name) {
      case ContentQueries.ExtractScoreData: {
        return handleExtractScoreData(data, sendResponse);
        // handler calls sendResponse asynchronously; return propagates implicit true
      }
    }
  }
);

// popup → background: fetch character data from osu!idle API
chrome.runtime.sendMessage<BackgroundGetCharacterQuery>(
  { name: BackgroundQueries.FetchCharacter, data: { id: characterId } },
  (response: BackgroundGetCharacterResponse) => { ... }
);

// popup → background (fallback): copy text to clipboard via scripting API
chrome.runtime.sendMessage<BackgroundCopyToClipboardQuery, BackgroundCopyToClipboardResponse>(
  { name: BackgroundQueries.CopyToClipboard, data: { content: text } },
  (response: BackgroundCopyToClipboardResponse) => { ... }
);
```

### Message Name Constants

| **Constant**                        | **Value**              | **Direction**      |
| ----------------------------------- | ---------------------- | ------------------ |
| `ContentQueries.ExtractScoreData`   | `'EXTRACT_SCORE_DATA'` | popup → content    |
| `BackgroundQueries.FetchCharacter`  | `'FETCH_CHARACTER'`    | popup → background |
| `BackgroundQueries.CopyToClipboard` | `'COPY_TO_CLIPBOARD'`  | popup → background |

## IndexedDB Schema

The extension accesses the `beatmaps` database created by the osu!idle site (not by this extension).

| **Store** | **Key**                          | **Value**                                                                      |
| --------- | -------------------------------- | ------------------------------------------------------------------------------ |
| `meta`    | auto-increment (cursor iterated) | `{ id, artist, title, versions: [{ id, version, total_length, difficulty }] }` |
| `files`   | `"{beatmapSetId}/{filename}"`    | Raw `Blob` (background image — matched by image extension regex)               |

A single DB connection is opened per extraction and reused for both store queries. The connection is explicitly closed before resolving.

## chrome.storage.local Schema

| **Key**     | **Type**            | **Description**                                                                                              |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `character` | `Character`         | Cached character profile (see `Character` type in `shared/types/data.type.ts`)                               |
| `scores`    | `[number, Score][]` | Serialized `Map<beatmapId, Score>` — scores are keyed by beatmap difficulty ID and persisted across sessions |

### `Character` shape

```typescript
interface Character {
  avatarUrl: string;
  globalLevel: number;
  id: number;
  name: string;
  skills: Skill[];
}

interface Skill {
  name: SkillName;
  level: number;
  xp: {
    inCurrentLevel: number;
    remainingToNextLevel: number;
    toNextLevel: number;
    total: number;
  };
}
```

### `Score` shape

```typescript
interface Score {
  beatmap: Beatmap;
  exportableData: string; // tab-separated string for clipboard export
  gainedSkills: ScoreSkill[];
  timestamp: number;
}

interface Beatmap {
  artist: string;
  backgroundUrl: string;
  difficultyName: string;
  durationInSeconds: number;
  id: number;
  starRating: number;
  title: string;
}

interface ScoreSkill {
  name: SkillName;
  xp: {
    absolute: number;
    perSecond: number;
  };
}
```

## osu!idle Character API

`background/handlers/fetchCharacter.handler.ts` fetches character data from:

```
GET https://api.osu.idle.rhythmgamers.net/v1/characters/{id}
```

The response is mapped to the internal `Character` type by `mapApiResponseToCharacterData()`, using the `API_CHARACTER_SKILL_KEYS` mapping from `shared/constants/api.constants.ts`. Each skill is mapped from flat API fields (`{key}Xp`, `{key}TotalXp`, `{key}Level`) to the structured `Skill` type, with `toNextLevel` computed via `computeLevelXp()`.

## Data Flow

### Score Extraction

1. User visits the osu!idle result page
2. User clicks **Extract** in the popup
3. Popup (`useScoreExtractor` composable) sends `EXTRACT_SCORE_DATA` to the content script
4. Content script (`extractScoreData.handler.ts`):
5. Popup updates `score` reactive state and re-renders beatmap card + skill cards grid
6. On next popup open, `init()` loads the most recent score from `chrome.storage.local` for instant display

### Character Profile (Settings Tab)

1. On Settings tab mount, `useCharacter.init()` reads cached `character` from `chrome.storage.local` and renders it immediately
2. User triggers a refresh (or enters a new character ID) — `fetchCharacter(id)` sends `FETCH_CHARACTER` to `background.js`
3. Background fetches from the osu!idle API, maps the response, stores the result in `chrome.storage.local`, and returns the `Character` object
4. Settings tab updates the character card (avatar, name, level) and re-renders all per-skill progress bars
5. When the user edits the character ID in the `CharacterCard` component and blurs/presses Enter, steps 2–4 repeat with the new ID
