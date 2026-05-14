# Enrique Enciso — Portfolio

Personal portfolio built with Angular 21 (SSR), Angular Material v21, and Tailwind CSS v4.

**Live:** _coming soon (Vercel)_
**Repo:** https://github.com/enriqueenciso/online-portfolio

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 20 | Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) |
| pnpm | 10.12.2 | See install instructions below |

### Installing pnpm

```bash
# Option A — standalone installer (recommended)
curl -fsSL https://get.pnpm.io/install.sh | sh

# Option B — corepack (ships with Node.js 16.13+)
corepack enable
corepack prepare pnpm@10.12.2 --activate
```

> **Important:** This project enforces pnpm via the `packageManager` field in `package.json`.
> Running `npm install` or `yarn` will be blocked. Always use `pnpm`.

---

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server
pnpm start          # → http://localhost:4200

# 3. Production build (SSR)
pnpm build

# 4. Run unit tests
pnpm test
```

## Code generation

```bash
# New standalone component
pnpm ng generate component src/app/shared/components/<name>

# New page (lazy-loaded route)
pnpm ng generate component src/app/pages/<name>
```

## Stack

| Concern | Choice |
|---|---|
| Framework | Angular 21 (standalone, SSR via Express) |
| UI components | Angular Material v21 (Material Design 3) |
| Styling | Tailwind CSS v4 (utilities) + SCSS (Material theming) |
| Theming | Light/dark toggle, respects system preference, persists in `localStorage` |
| Hosting | Vercel (planned) |
| Package manager | pnpm 10 |

See [CLAUDE.md](./CLAUDE.md) for full architecture notes and conventions.
