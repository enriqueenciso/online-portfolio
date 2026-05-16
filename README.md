# Enrique Enciso — Portfolio

Personal portfolio built with Angular 21 (SSR), Angular Material v21, and Tailwind CSS v4.

**Live:** _coming soon (Vercel)_
**Repo:** https://github.com/enriqueenciso/online-portfolio

---

## Prerequisites

| Tool    | Version | Notes                                                                            |
| ------- | ------- | -------------------------------------------------------------------------------- |
| Node.js | ≥ 20    | Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) |
| pnpm    | 10.12.2 | See install instructions below                                                   |

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

| Concern         | Choice                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| Framework       | Angular 21 (standalone, SSR via Express)                                  |
| UI components   | Angular Material v21 (Material Design 3)                                  |
| Styling         | Tailwind CSS v4 (utilities) + SCSS (Material theming)                     |
| Theming         | Light/dark toggle, respects system preference, persists in `localStorage` |
| Hosting         | Vercel (planned)                                                          |
| Package manager | pnpm 10                                                                   |

See [CLAUDE.md](./CLAUDE.md) for full architecture notes and conventions.

---

## WSL2 setup (Windows — required for `ralph/` scripts)

The `ralph/` AFK agent scripts use Bash and Docker and must run from a WSL2 terminal. This is a one-time machine setup.

### 1. Enable WSL2 + install Ubuntu

Open PowerShell as Administrator:

```powershell
wsl --install
```

If WSL2 is already enabled (e.g. Docker Desktop activated it), skip the above and just install the Ubuntu distro:

```powershell
wsl --install -d Ubuntu
```

Reboot when prompted (first-time WSL install only). On first launch, create a Unix username and password.

### 2. Docker Desktop

1. Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
2. Settings → General → enable **Use the WSL 2 based engine**.
3. Settings → Resources → WSL Integration → toggle on your Ubuntu distro.
4. Verify from WSL2: `docker run hello-world`

### 3. Install tooling inside WSL2

```bash
# GitHub CLI + jq
sudo apt update && sudo apt install -y gh jq
gh auth login

# Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

# pnpm
corepack enable && corepack prepare pnpm@10.12.2 --activate

# Claude Code CLI
npm install -g @anthropic-ai/claude-code
claude --version
```

**Authenticate Claude Code** — use whichever applies:

```bash
# Claude Pro/Max subscription (no API key needed)
claude auth login

# OR — Anthropic API key (pay-as-you-go via console.anthropic.com)
echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.bashrc
source ~/.bashrc
```

### 4. Access the project from WSL2

Windows drives are mounted at `/mnt/`. Your project is at:

```bash
cd /mnt/d/Documents/Projects/online-portfolio
```

Optional convenience alias in `~/.bashrc`:

```bash
alias portfolio="cd /mnt/d/Documents/Projects/online-portfolio"
```

### 5. VS Code — Remote WSL

Install the **WSL** extension (or the Remote Development pack). Then open the project from a WSL2 terminal:

```bash
code .
```

VS Code opens with a WSL2 backend — the integrated terminal and all extensions run natively in Linux.

### 6. Docker sandbox (`ralph/afk.sh`)

`afk.sh` uses `docker sandbox run claude .`, part of Claude Code's Docker sandbox feature. Before running it:

1. Check the [Claude Code Docker docs](https://docs.anthropic.com/en/docs/claude-code/docker) for the exact image name and any required `docker plugin install` step.
2. Confirm `ANTHROPIC_API_KEY` is exported in your WSL2 shell (step 3 above).
3. Confirm `gh auth status` shows authenticated — the script calls `gh issue list` and `gh issue comment`.

### Running the ralph scripts

```bash
# From a WSL2 terminal in the project root:
bash ralph/once.sh      # single iteration, no Docker needed
bash ralph/afk.sh 5     # up to 5 sandboxed iterations
```
