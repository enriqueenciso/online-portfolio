# Portfolio — Claude Code Context

## Project overview

Personal portfolio for Enrique Enciso (enriqueenciso@gmail.com), a Software Engineer.
Hosted on Vercel. Repo: https://github.com/enriqueenciso/online-portfolio

## Stack decisions

| Concern  | Choice                                          | Reason                                                                                   |
| -------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Frontend | Angular 21 + SSR                                | User preference, SSR for SEO/performance                                                 |
| Styling  | Tailwind CSS v4 + Angular Material v21          | Utility-first layout + Material Design 3 components                                      |
| Theming  | Light/dark toggle via `.dark` class on `<body>` | Respects system preference, persists in localStorage                                     |
| Hosting  | Vercel (planned)                                | Free tier, zero cold starts for SSR                                                      |
| Backend  | None yet — NestJS planned                       | Will slot in as `apps/api` when contact form / token-gated resume need server-side logic |

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

## Pre-commit hooks

Every commit is gated by a Husky pre-commit hook (`.husky/pre-commit`) that runs two steps in order:

1. **lint-staged** — runs only on staged files to keep commits fast:
   - `.ts` / `.html` → `eslint --fix` then `prettier --write`
   - `.scss` / `.css` / `.json` / `.md` → `prettier --write`
2. **test suite** — runs `pnpm run test:ci` (`ng test --watch=false`); all tests must pass.

If either step fails the commit is aborted. Fix the reported errors and re-stage before retrying.

Other developers get the hooks automatically on `pnpm install` via the `prepare: "husky"` script.

### ESLint rules (beyond Angular defaults)

- `@angular-eslint/prefer-signals: warn` — nudges toward signals-first state
- `@typescript-eslint/no-explicit-any: warn`
- `@typescript-eslint/consistent-type-imports: error` — enforces `import type` for type-only imports
- `no-console: warn` (allow `console.warn` / `console.error`); disabled in `server.ts` and config files
- `eqeqeq: error` — no `==`

### Test setup

- Setup file: `src/test-setup.ts` — mocks `window.matchMedia` for jsdom (Vitest doesn't implement it)
- Included in `tsconfig.spec.json`

### Test authoring conventions

Every new component must ship with a `<name>.spec.ts` in the same directory. Tests serve as living documentation — they should be readable as a spec, not just a coverage target.

**What to cover:**

- Expected behavior: the happy path and any non-obvious contracts (e.g. "emits X when Y is true").
- Reasonable corner cases: boundary values, empty/null inputs, SSR vs browser paths, signal combinations.
- Bug log: when a regression test is added for a specific bug, include a short inline comment naming the commit or issue (e.g. `// regression: scrollbar resize clears canvas — fixed in 25c35b2`). Keep it to one line; the full context belongs in the commit message.

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

## Agent skills

This project includes agent skills under `.agents/skills/`. Claude may invoke them automatically based on prompt context — no explicit command needed. Available skills:

`caveman` · `diagnose` · `grill-me` · `grill-with-docs` · `handoff` · `improve-codebase-architecture` · `prototype` · `tdd` · `to-issues` · `to-prd` · `triage` · `write-a-skill` · `zoom-out`
