# AGENTS.md

TypeScript weather app (Node/Express backend + React/Vite frontend, single dev process) that tracks Singapore locations and stores their latest weather snapshot in SQLite via Drizzle ORM.

Package manager: npm, using npm workspaces (`frontend`, `backend`) — run all commands from the repo root.

## Commands

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

`npm run dev` starts Portless on `PORTLESS_PORT` (default 1355), giving a stable URL at `http://weather-starter.localhost:1355`. There is no separate frontend dev server/port — Express and Vite middleware share one process and one port.

## More detail

- [Backend architecture](docs/backend.md) — dev server, weather API client, DB layer, validation, logging
- [Frontend architecture](docs/frontend.md) — state store, theming
- [Testing conventions](docs/testing.md) — test layout, single-test command, fake weather client pattern
