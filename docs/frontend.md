# Frontend architecture

- **State** (`frontend/src/state/store.tsx`): one `StoreProvider` holds all location state (list, selection, loading/refreshing flags, errors) via React context — no external state library. Every user action also fires a fire-and-forget `logInteraction()` call (`frontend/src/api.ts` → `POST /api/logs` → pino logger) for behavioral tracking; follow this pattern (`logInteraction('event_name', metadata)`) when adding new user actions.
- **Theming** (`frontend/src/state/theme.tsx`): theme id is stored in `localStorage` and applied as `data-theme` on `<html>`; actual theme styles live in CSS (`frontend/src/index.css` + Tailwind). Adding a theme means registering it in the `THEMES` array and adding corresponding CSS, not new React logic.
