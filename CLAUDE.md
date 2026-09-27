# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A minimal TypeScript weather app: Node/Express backend + React/Vite frontend, served as a single process in development. It tracks Singapore locations and stores the latest weather snapshot for each one, backed by SQLite via Drizzle ORM. Built as a progressive starter for agentic coding exercises (see "Feature Tasks" in README.md for the intended next-step tasks).

## Commands

Run from the repo root (npm workspaces: `frontend`, `backend`).

```bash
npm install          # install all workspace deps
npm run dev           # start Express + Vite through Portless (single process)
npm run build         # build frontend, then compile backend TypeScript
npm run start         # run the compiled production server (after build)
npm test              # run backend API tests (vitest)
npm run test:watch    # run backend API tests in watch mode
npm run doctor        # verify /health and /api/locations respond
npm run reset         # remove the local SQLite database
npm run db:generate   # generate Drizzle migrations after schema.ts changes
npm run db:migrate    # apply Drizzle migrations to backend/weather.db
```

Run a single test file: `npx vitest run backend/src/routes/locations.test.ts`. Tests only live under `backend/src/**/*.test.ts` (see `vitest.config.ts`); there is currently no frontend test setup.

`npm run dev` starts Portless on `PORTLESS_PORT` (default 1355), giving a stable URL at `http://weather-starter.localhost:1355`. There is no separate frontend dev server/port — Express and Vite middleware share one process and one port.

## Architecture

- **Single-process dev server**: `backend/src/server.ts` creates one Express app. In non-production, it mounts Vite in middleware mode (`appType: 'spa'`) directly onto Express so `/api/*` is handled by Express routes and everything else falls through to Vite's React app. In production it serves the built `frontend/dist` as static files with an SPA fallback. This means the frontend always calls relative `/api/...` paths (see `frontend/src/api.ts`) — there is no CORS setup and no separate port to configure.
- **Snapshot data flow, not live queries**: the app never fetches weather on page load. `POST /api/locations` saves coordinates, immediately calls the weather provider once, and persists the result. `GET /api/locations` only reads what's already in SQLite. Refreshing (`POST /api/locations/:id/refresh`) is the only other time the external API is called. Keep this pattern when adding new weather-derived fields — extend the snapshot write path, don't add fetch-on-read.
- **`backend/src/weather.ts` — `SingaporeWeatherClient`**: wraps multiple data.gov.sg endpoints (2-hr forecast, 24-hr forecast, 4-day forecast, station readings for temperature/humidity/rainfall/wind, UV, PSI/PM2.5) into one `WeatherSnapshot`. Requests to `api-open.data.gov.sg` are made **sequentially, not in parallel** — the API throttles by concurrency and parallel calls reliably 429; each fetch also retries once or twice on 429 with backoff. Each sub-fetch is independently wrapped in `.catch()` in `getCurrentWeather` so a single failing endpoint degrades that field to `null` instead of failing the whole snapshot. Nearest-station/area/region matching is done locally via squared-distance comparison against `label_location`/`location` metadata returned by each endpoint (regions for the 24-hr forecast are hardcoded in `defaultRegions()` since that endpoint doesn't return region coordinates).
- **DB layer (`backend/src/db.ts` + `backend/src/schema.ts`)**: uses `node:sqlite`'s `DatabaseSync` wrapped by `drizzle-orm/sqlite-proxy` (not the native `better-sqlite3` driver), because the proxy driver lets a single sync connection expose Drizzle's async query API through a hand-written `sqliteCallback`. Migrations run automatically at import time via `drizzle-orm/sqlite-proxy/migrator` against `backend/drizzle/`. The `WeatherSnapshot` interface (weather.ts) and the flat DB columns (schema.ts) are duplicated by design — `weatherToColumns`/`rowToRecord` in db.ts convert between them. When adding a weather field, update: `WeatherSnapshot` in `weather.ts`, the column in `schema.ts`, both conversion functions in `db.ts`, then run `npm run db:generate` + `npm run db:migrate`.
- **Locations are unique by exact lat/lon** (`locations_latitude_longitude_unique` index); creating a duplicate returns 409.
- **Frontend state** (`frontend/src/state/store.tsx`): one `StoreProvider` holds all location state (list, selection, loading/refreshing flags, errors) via React context — no external state library. Every user action also fires a fire-and-forget `logInteraction()` call (`frontend/src/api.ts` → `POST /api/logs` → pino logger) for behavioral tracking; follow this pattern (`logInteraction('event_name', metadata)`) when adding new user actions.
- **Theming** (`frontend/src/state/theme.tsx`): theme id is stored in `localStorage` and applied as `data-theme` on `<html>`; actual theme styles live in CSS (`frontend/src/index.css` + Tailwind). Adding a theme means registering it in the `THEMES` array and adding corresponding CSS, not new React logic.
- **Coordinate validation**: the backend rejects lat/lon outside Singapore's bounding box (`1.1–1.5`, `103.6–104.1`) at the `POST /api/locations` route — this is intentionally hardcoded since the whole app is Singapore-only.
- **Logging**: `backend/src/logger.ts` exports a shared `pino` logger; `pino-http` middleware logs every request (disabled in tests via `enableRequestLogging`/`NODE_ENV=test`). Both server-side events and proxied frontend interaction events flow through this one logger.
- **Testing**: `backend/src/routes/locations.test.ts` builds the app via `createApp({ weatherClient: <fake> })`, injecting a fake `WeatherClient` (see the `WeatherClient` interface in `routes/locations.ts`) instead of hitting the real API — follow this pattern for new route tests rather than mocking `fetch`.
