# Chrome Extension Vue Demo

Chrome Manifest V3 extension built with Vue 3, Vite 6, TailwindCSS v4, TypeScript.

## Commands

| Command | Action |
|---|---|
| `pnpm dev` | Start Vite dev server (HMR) |
| `pnpm type-check` | Type-check via `vue-tsc --noEmit` (no `tsc`) |
| `pnpm build` | Type-check first, then `vite build` — **both must pass** |
| `pnpm preview` | Preview production build |

Build runs type-check (`vue-tsc --noEmit`) **before** `vite build`. If type-check fails, the output will not be produced.

Always run `pnpm build` rather than `vite build` directly — the type-check gate is intentional.

## Project Structure

```
src/
  background.ts        # Service Worker (MV3) — runtime message relay, sidePanel.open()
  content.ts           # Content script injected into <all_urls> — shows DOM notifications
  sidepanel/
    SidePanel.ts       # Entry: mounts Vue app onto #app
    SidePanel.vue      # Main sidepanel UI component
  components/
    HelloButton.vue    # Auto-imported component (no manual import needed)
  styles/
    global.css         # Single line: @import "tailwindcss"  (Tailwind v4 syntax)
public/
  manifest.json        # MV3 manifest, permissions: activeTab, storage, sidePanel, scripting
sidepanel.html         # HTML shell for sidepanel, loads /src/sidepanel/SidePanel.js
```

## Extension Architecture

- **3 Vite entry points** (defined in `vite.config.ts` → `build.rollupOptions.input`):
  - `sidepanel.html` → `dist/(sidepanel.html + sidepanel.js)`
  - `src/background.ts` → `dist/background.js`
  - `src/content.ts` → `dist/content.js`
- Background service worker listens for `GET_HTML` messages, then uses `chrome.scripting.executeScript` to fetch page HTML.
- Content script listens for `GREETING` messages and renders a temporary floating notification.
- Sidepanel queries active tab HTML and displays it, plus a clock and tab count.

## Auto-imports

Two unplugin tools are active — **do not manually import items they provide**:

1. **unplugin-auto-import**: All Vue Composition API (`ref`, `computed`, `watch`, `onMounted`, etc.) and vue-router composables (`useRoute`, `useRouter`, `onBeforeRouteLeave`, etc.) are globally available. No `import { ref } from 'vue'` needed.
2. **unplugin-vue-components**: Components in `src/components/` are auto-registered. Access them directly in templates by PascalCase name (`<HelloButton />`), no manual import.

Generated type declarations: `auto-imports.d.ts`, `components.d.ts`, `.eslintrc-auto-import.json`.

## Path Aliases

- `@/` maps to `src/` (e.g. `import '@/styles/global.css'`)

## Styling

- TailwindCSS v4: single `@import "tailwindcss"` line in CSS (NOT the old `@tailwind base/components/utilities` directives).
- TailwindCSS v4 Vite plugin: `@tailwindcss/vite`.

## Chrome-Specific Notes

- `@types/chrome` provides `chrome.*` types globally (included in `tsconfig.json` `"types"`).
- Service worker uses `chrome.action.onClicked` to open side panel.
- Content script runs on `<all_urls>`.
- Permissions: `activeTab`, `storage`, `sidePanel`, `scripting`.
- After building, load `dist/` directory as unpacked extension in Chrome.

## TypeScript

- `strict: true`, `moduleResolution: "bundler"`, target ESNext, emit via `vue-tsc --noEmit`.
- No ESLint, Prettier, or formatter configured beyond vue-tsc type-checking.

## Testing

- No test framework or test files exist in this repository.

## Missing Config

- No CI workflows.
- No pre-commit hooks or commit linting.
- No lint-staged.
