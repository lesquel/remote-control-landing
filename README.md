# OpenCode Pilot — Landing

Landing page for [`@lesquel/opencode-pilot`](https://github.com/lesquel/open-remote-control), built with **Astro 6** + **TypeScript strict**, fully static, ready to deploy on Vercel.

## Stack

- **Astro 6.1.9** — vanilla, no UI framework. Islands are vanilla TS.
- **TypeScript strict** with path alias `~/*` → `src/*`
- **i18n** — English (default at `/`) and Spanish (at `/es/`)
- **CSS variables** for theming (4 themes: terminal-green, amber, violet, mono-light)
- **View Transitions** via `astro:transitions`
- **@astrojs/sitemap** for `/sitemap-index.xml`
- **Bun** for package management and dev server

## Develop

```sh
bun install
bun run dev          # http://localhost:4321
```

## Build & validate

```sh
bun run build        # outputs to ./dist
bun run preview      # preview built site
bun run check        # full type + Astro check (0 errors expected)
```

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import on Vercel — it auto-detects Astro from `vercel.json`.
3. **Build command**: `bun run build` (already set in `vercel.json`)
4. **Output directory**: `dist` (already set)
5. Done. The included `vercel.json` adds:
   - Strict security headers (X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options)
   - Long-cache (1 year, immutable) for `/_astro/*` and static assets
   - Short-cache (1h) for the sitemap and (1d) for robots.txt

## Internationalization

- **Default locale**: `en` → served at `/`
- **Spanish**: served at `/es/`
- All strings live in `src/i18n/strings.ts`. Each component takes a `lang` prop and pulls its slice.
- The Nav has a `LanguageSwitcher` (`EN | ES`) that links to the equivalent path in the other locale.
- `<html lang>` is set per page; hreflang tags are emitted for both locales plus `x-default`.
- Sitemap is i18n-aware (one entry per page per locale).

To add a third language (e.g. `fr`):

1. Add `'fr'` to `LOCALES` in `src/i18n/index.ts`
2. Add the `fr: { … }` block to `STRINGS` in `src/i18n/strings.ts` (mirroring the `en` shape)
3. Add `'fr'` to `i18n.locales` in `astro.config.mjs`
4. Create `src/pages/fr/index.astro` (copy `src/pages/es/index.astro`, change `lang = 'fr'`)
5. Add the hreflang link in `src/layouts/Base.astro`

## SEO checklist (already wired)

- ✅ `<title>` and `<meta name="description">` per locale
- ✅ Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`, `og:locale:alternate`)
- ✅ Twitter Card (`summary_large_image`)
- ✅ Canonical URL per page
- ✅ `hreflang` for `en`, `es`, and `x-default`
- ✅ JSON-LD `SoftwareApplication` structured data
- ✅ `robots` meta (`max-image-preview:large`, `max-snippet:-1`)
- ✅ `robots.txt` with sitemap reference
- ✅ Sitemap index (`/sitemap-index.xml`) generated at build by `@astrojs/sitemap`
- ✅ DNS prefetch for github.com and npmjs.com
- ✅ Font preconnect

## Required public assets — create these

The SEO is wired, but you still need to drop the actual image/icon files in `public/`:

| File                    | Spec                 | Notes                                                           |
| ----------------------- | -------------------- | --------------------------------------------------------------- |
| `public/favicon.svg`    | SVG, square          | Primary favicon (vector — works for all sizes)                  |
| `public/favicon-32x32.png` | 32×32 PNG         | Fallback for browsers that don't support SVG favicons           |
| `public/apple-touch-icon.png` | 180×180 PNG    | iOS home-screen icon                                            |
| `public/site.webmanifest` | JSON                | PWA-style manifest with name, short_name, icons, theme_color    |
| `public/og-image.png`   | 1200×630 PNG         | Open Graph card preview shown on Twitter/Slack/Discord/etc.     |

Until you add `og-image.png`, link previews on social will fall back to the URL only.

A minimal `site.webmanifest`:

```json
{
  "name": "OpenCode Pilot",
  "short_name": "Pilot",
  "icons": [
    { "src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ],
  "theme_color": "#07090a",
  "background_color": "#07090a",
  "display": "standalone"
}
```

## Project structure

```
opencode-landing/
├── public/                       # static assets (favicons, og:image, robots.txt)
│   └── robots.txt
├── src/
│   ├── pages/
│   │   ├── index.astro           # EN — served at /
│   │   └── es/index.astro        # ES — served at /es/
│   ├── layouts/
│   │   └── Base.astro            # shell + SEO + hreflang + JSON-LD + ClientRouter
│   ├── i18n/
│   │   ├── index.ts              # LOCALES, Lang, localePath helper
│   │   └── strings.ts            # full EN + ES dictionaries (single source of truth)
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── LanguageSwitcher.astro
│   │   ├── Hero.astro
│   │   ├── Problem.astro
│   │   ├── MultiCli.astro        # OpenCode + Codex bridge
│   │   ├── Features.astro
│   │   ├── DashboardMockup.astro
│   │   ├── Architecture.astro    # Screaming Architecture diagram
│   │   ├── Install.astro
│   │   ├── UseCases.astro
│   │   ├── Mobile.astro
│   │   ├── Shortcuts.astro
│   │   ├── Config.astro          # env vars table with "new" badges
│   │   ├── Roadmap.astro         # VS Code extension as next step
│   │   ├── Docs.astro
│   │   ├── Footer.astro
│   │   └── TweaksPanel.astro
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── responsive.css
│   │   └── effects.css
│   └── scripts/
│       ├── boot.ts               # init on DOMContentLoaded + astro:page-load
│       ├── terminal.ts
│       ├── tabs.ts
│       ├── copy.ts
│       ├── dashboard-mock.ts
│       ├── qr.ts
│       ├── theme.ts
│       ├── tweaks.ts
│       ├── mobile-nav.ts
│       └── animations.ts
├── astro.config.mjs              # i18n + sitemap + lightningcss
├── vercel.json                   # framework + headers + cache
├── tsconfig.json
└── package.json
```

## Motion (Level B)

- Scroll-in fade-up via Intersection Observer on `[data-animate]` (with `data-delay="1..5"`)
- Hover 3D tilt on `[data-tilt]` cards (desktop pointer only)
- Hero terminal parallax synced to scroll
- View Transitions between pages
- All effects guarded by `prefers-reduced-motion`

## License

MIT © lesquel
