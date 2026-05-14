# Portfolio — Claude Code Context

## Project overview
Personal portfolio for Enrique Enciso (enriqueenciso@gmail.com), a Software Engineer.
Hosted on Vercel. Repo: https://github.com/enriqueenciso/online-portfolio

## Stack decisions

| Concern | Choice | Reason |
|---|---|---|
| Frontend | Angular 21 + SSR | User preference, SSR for SEO/performance |
| Styling | Tailwind CSS v4 + Angular Material v21 | Utility-first layout + Material Design 3 components |
| Theming | Light/dark toggle via `.dark` class on `<body>` | Respects system preference, persists in localStorage |
| Hosting | Vercel (planned) | Free tier, zero cold starts for SSR |
| Backend | None yet — NestJS planned | Will slot in as `apps/api` when contact form / token-gated resume need server-side logic |

## Architecture

```
src/
  app/
    core/services/        # Singleton services (ThemeService, etc.)
    layout/               # Header, Footer — always rendered
    pages/                # Lazy-loaded route components
      home/               # Landing page
      resume/             # Preview resume (public, scraping-deterred)
    shared/components/    # Reusable UI pieces
  tailwind.css            # Tailwind utilities import (plain CSS, not SCSS)
  styles.scss             # Angular Material theming (Sass)
```

## Key conventions

- **No AppModule.** Angular 21 standalone components throughout.
- **Lazy-loaded routes.** Every page-level component is loaded via `loadComponent`.
- **Signals-first.** Use Angular signals (`signal`, `computed`, `effect`) over RxJS for local state.
- **Tailwind in CSS, Material in SCSS.** Tailwind's `@import "tailwindcss/utilities"` lives in `src/tailwind.css` to avoid Dart Sass intercepting it. Angular Material Sass mixins live in `src/styles.scss`.
- **Dark mode via `.dark` class.** `ThemeService` toggles `.dark` on `document.body`. Tailwind variant: `@variant dark (&:where(.dark, .dark *))`. Material: `body.dark & { @include mat.theme(...dark...) }`.
- **No comments explaining what the code does.** Only comment non-obvious WHY (workarounds, hidden constraints).
- **No `@angular/animations` module import needed.** Using `provideAnimationsAsync()` in `app.config.ts`.

## Resume gating strategy
- **Public `/resume`** — limited preview, contact info hidden, "request full version" prompt.
- **Full `/resume?token=<uuid>`** — complete resume, shown only when a valid token is present in the URL. Token validation is client-side for now (sufficient to deter scrapers); move to NestJS API when stricter enforcement is needed.

## Planned features (tracked as GitHub issues)
- #1 Full resume view with URL token gating
- #2 Contact section / form
- #3 Projects showcase section
- #4 Vercel deployment + CI via GitHub Actions
- #5 NestJS API scaffold (contact form, token API)
- #6 SEO: meta tags, Open Graph, structured data

## Package manager

This project uses **pnpm 10.12.2**. The `packageManager` field in `package.json` blocks npm and yarn.
Install pnpm: `corepack enable && corepack prepare pnpm@10.12.2 --activate` or via the standalone installer.

## Commands

```bash
pnpm install       # Install dependencies
pnpm start         # Dev server (http://localhost:4200)
pnpm build         # Production SSR build
pnpm test          # Unit tests
pnpm ng generate component src/app/shared/components/<name>
```
