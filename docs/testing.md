# Testing conventions

Tests only live under `backend/src/**/*.test.ts` (see `vitest.config.ts`); there is currently no frontend test setup.

Run a single test file:

```bash
npx vitest run backend/src/routes/locations.test.ts
```

`backend/src/routes/locations.test.ts` builds the app via `createApp({ weatherClient: <fake> })`, injecting a fake `WeatherClient` (see the `WeatherClient` interface in `routes/locations.ts`) instead of hitting the real API — follow this pattern for new route tests rather than mocking `fetch`.
