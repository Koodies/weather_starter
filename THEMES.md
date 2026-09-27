# THEMES.md

The app ships four selectable visual themes, switched at runtime via the theme picker (`frontend/src/components/ThemeSelector.tsx`) and persisted to `localStorage`. Themes are implemented as CSS custom properties scoped to `:root[data-theme='...']` in `frontend/src/index.css` (see `frontend/src/state/theme.tsx` for the `THEMES` registry and switching logic), plus a small number of per-theme utility overrides (e.g. `.eyebrow`). Components consume the tokens directly (`rgb(var(--ink))`, `var(--radius-card)`, etc.) rather than branching on theme id, so most UI is theme-agnostic by construction.

## Shared token system

Every theme defines the same set of custom properties, which is what keeps the themes swappable without touching component code:

| Token | Purpose |
| --- | --- |
| `--ink` | Foreground/text color (RGB triplet, used via `rgb(var(--ink) / alpha%)`) |
| `--recede` | Shadow/background-recede color (RGB triplet) |
| `--accent` | Primary accent color |
| `--font-display` | Display/heading font family |
| `--radius-card`, `--radius-pill`, `--radius-control` | Corner radii for panels, chips, and controls |
| `--border-w` | Border width used on panels (`TileShell`, cards) |
| `--shadow-panel` | Box-shadow applied to `.panel` elements |

Design consideration: adding a fifth theme means only defining this token set plus a body background — it should not require new component logic. If a theme needs a genuinely new visual affordance (like Neo Brutalist's hard drop shadow), express it as a new token consumed by the shared `.panel`/`.chip`/`.control` classes rather than a one-off component style.

## 1. Apple

- **Description**: A soft, translucent "frosted glass" look — light ink on a cool blue-gray gradient background, standard system font, generous rounded corners, no borders/shadows on panels beyond a faint glass edge.
- **Tokens**: `--ink: 255 255 255` (white text), `--recede: 0 0 0`, `--accent: rgba(255,255,255,0.30)`, `--font-display: inherit` (system font stack), `--radius-card: 1rem`, `--border-w: 1px`, `--shadow-panel: none`.
- **Background**: layered radial gradients over a diagonal blue-gray linear gradient (`#6f8aa8` → `#3c5066`), fixed attachment.
- **Design considerations**: this is the default theme (`DEFAULT_THEME = 'apple'`). White text over a mid-tone gradient means panel translucency (`bg-[rgb(var(--ink)/8%)]` + `backdrop-blur-xl`) is doing the work of separating content from background — this theme is the most dependent on backdrop-blur support and a non-white body background to read correctly.

## 2. Midnight Aurora

- **Description**: A dark, near-black theme with cool aurora-inspired violet/teal accents and a geometric sans-serif display font. Evokes a night-sky weather app.
- **Tokens**: `--ink: 226 231 245` (soft off-white text), `--recede: 4 8 20`, `--accent: #8b7ce0` (violet), plus theme-specific `--aurora-teal: #35d0ba` and `--aurora-violet: #8b7ce0`, `--font-display: 'Space Grotesk', sans-serif`, `--radius-card: 1rem`, `--border-w: 1px`, `--shadow-panel: none`.
- **Background**: two soft radial glows (violet top-right, teal bottom-left) over a near-black diagonal gradient (`#121a33` → `#0a0e1c`), fixed attachment.
- **Design considerations**: this is the only theme with extra named accent tokens (`--aurora-teal`/`--aurora-violet`) beyond the shared set, used for gradient/glow accents rather than the base UI — a precedent for how a future theme can introduce bespoke tokens without breaking the shared system, as long as core components still only read the common token names.

## 3. Paper Forecast

- **Description**: A warm, editorial "printed almanac" look — dark serif text on a cream/parchment background with a subtle paper-grain texture, small-caps section labels.
- **Tokens**: `--ink: 43 38 32` (dark brown-black), `--recede: 43 38 32`, `--accent: #2f3a56` (navy), `--font-display: 'Source Serif 4', serif`, `--radius-card: 1rem`, `--border-w: 1px`, `--shadow-panel: none`.
- **Background**: a fine repeating radial-dot texture (`3px 3px` tile) layered over a warm cream diagonal gradient (`#ece4d0` → `#ddd0b3`).
- **Design considerations**: `--recede` equals `--ink` here (unlike the other themes), since there's no separate dark backdrop to recede into — shadows/overlays derive their tone from the same ink color. The `.eyebrow` override switches labels to small-caps with letterspacing instead of uppercase, matching editorial/print typography conventions rather than the default all-caps UI label style.

## 4. Neo Brutalist

- **Description**: A high-contrast, hard-edged theme — pure black ink and borders on a white background, a bold display font, zero corner radius, and a solid offset drop shadow instead of blur/translucency.
- **Tokens**: `--ink: 10 10 10` (near-black), `--recede: 10 10 10`, `--accent: #ff5a1f` (orange), `--font-display: 'Archivo Black', sans-serif`, `--radius-card/pill/control: 0px`, `--border-w: 3px`, `--shadow-panel: 4px 4px 0 0 #000`.
- **Background**: flat white (`#ffffff`), no gradient or texture.
- **Design considerations**: this theme is the clearest stress-test of the shared token system — it flips radius to zero, triples border width, and replaces the soft/blurred panel treatment with a hard offset shadow, all without any component-level branching. It's the reference case for verifying a theme can go fully "flat and graphic" using only the existing tokens. The `.eyebrow` override here goes the opposite direction from Paper Forecast: smaller size with much wider letterspacing for a stencil/label feel.

## Component-level notes across themes

- `TileShell` (in `Tiles.tsx`) is the shared panel wrapper for all weather metric tiles (air quality, wind, UV, temperature, rainfall, humidity, forecast high) — it applies `.panel`, the ink-tinted translucent background, and backdrop blur uniformly, so per-theme differences come entirely from the token values, not from tile-specific code.
- The `ThemeSelector` dropdown itself is theme-token-driven (`rgb(var(--ink)/…)` borders and backgrounds with `backdrop-blur`), so it's worth checking readability of the picker itself against each new background when adding a theme, especially high-contrast ones like Neo Brutalist where blur/translucency is being deliberately avoided elsewhere.
- Per-component per-theme edits so far have been confined to small class-level tweaks (spacing, border, blur-amount) in `AddLocationForm.tsx`, `Hero.tsx`, `HourlyStrip.tsx`, `MapCard.tsx`, `Sidebar.tsx`, `SidebarCard.tsx`, `TenDayForecast.tsx`, and `Tiles.tsx` — not structural changes, consistent with the goal of keeping themes primarily a token-swap exercise.
