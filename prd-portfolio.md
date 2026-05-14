## Problem Statement

The current portfolio home page is a plain, text-only hero section with a name, tagline, and two buttons. It makes no visual impression and does not represent the technical depth or personality of the engineer behind it. The resume page is similarly bare — no photo, no timeline, no personality. A visitor landing on the page today has no reason to stay or scroll.

## Solution

Replace the current static home and resume pages with a two-section, single-page experience:

1. **Hero section (full viewport):** A dark, visually rich landing screen with an animated "shooting stars" effect — SVG tech stack logos fly across a live star field, scattering stars as they pass — overlaid with the engineer's name, title, and a single CTA.
2. **Resume section (scroll-revealed):** As the user scrolls down, the hero exits via a parallax transition and a polished resume section is revealed, showing a profile photo, contact info, all skills, and a professional work history timeline.

Both sections live on the `/` route. `/resume` without a token shows the same public preview. `/resume?token=<uuid>` shows the full resume.

## User Stories

1. As a visitor, I want to see a visually impressive landing screen when I open the portfolio, so that I immediately get a sense of the engineer's personality and aesthetic.
2. As a visitor, I want to see SVG tech stack logos flying across a star field in the hero background, so that I can instantly grasp which technologies the engineer works with.
3. As a visitor, I want the stars in the hero to scatter as logos fly through them, so that the animation feels physical and alive rather than a flat loop.
4. As a visitor, I want to see the engineer's name and professional title clearly overlaid on the hero animation, so that I know whose portfolio I am viewing.
5. As a visitor, I want a "See my work ↓" button in the hero, so that I have an explicit invitation to explore further.
6. As a visitor, I want clicking the CTA button to smooth-scroll me to the resume section, so that the transition feels intentional.
7. As a visitor, I want to also be able to scroll down manually to reveal the resume section, so that I am not forced through a scripted interaction.
8. As a visitor, I want the hero to exit via a parallax transition as I scroll, so that the experience feels like uncovering content beneath rather than navigating away.
9. As a visitor, I want a header to appear as I scroll past the hero, so that I can navigate the site without going back to the top.
10. As a visitor, I want the header to have a glass morphism style, so that it looks polished over both dark and light backgrounds.
11. As a visitor, I want to click "About" in the header and be scrolled to the resume preview section, so that I can reach that section from any page.
12. As a visitor, I want to click "Full Resume" in the header and be taken to `/resume`, so that I can access the dedicated resume page.
13. As a visitor on `/resume` without a token, I want to see a sticky banner explaining I am viewing a preview with a "Request full access" link, so that I know more information exists and how to get it.
14. As a visitor, I want clicking "Request full access" to open a mailto link, so that I can reach out to the engineer directly.
15. As a visitor, I want to see the engineer's profile photo, name, title, and location in the resume section, so that the page feels personal and trustworthy.
16. As a visitor, I want to see all of the engineer's skill chips in the resume section, so that I have a complete picture of their technical capabilities.
17. As a visitor, I want to see the engineer's GitHub and LinkedIn links in the resume section, so that I can explore their work further.
18. As a visitor, I want to see a chronological work history timeline in the resume section, so that I can understand the engineer's career progression.
19. As a visitor, I want each timeline entry to show company name, role, date range, and optionally a company logo and tech stack used, so that I can assess the context of each position at a glance.
20. As a visitor, I want the resume section to respect the site's light/dark theme, so that the page is readable in my preferred mode.
21. As a visitor on a mobile device, I want the hero animation to run with reduced particle count and no push physics, so that the page performs well on lower-powered devices.
22. As a visitor on a mobile device, I want the scroll transition to be a simple fade rather than parallax, so that the experience is smooth without fighting the browser.
23. As a visitor who prefers reduced motion, I want the shooting stars animation to be suppressed or replaced with a static state, so that the page is accessible and not disorienting.
24. As the portfolio owner, I want to create custom SVG icons for Claude and Cursor so that my AI tooling expertise is visually represented in the hero animation alongside other tech logos.
25. As the portfolio owner, I want all personal data — name, photo, skills, work history, contact links — to live in a single `portfolio.config.ts` file, so that updating my portfolio never requires touching component code.
26. As a developer forking this project, I want a typed `PortfolioConfig` interface with autocomplete and compile-time validation, so that I can fill in my own data without guessing field names or breaking the build.
27. As a developer forking this project, I want the profile photo to be optional with a graceful fallback icon, so that the layout never breaks if a photo is not provided.

## Implementation Decisions

### Route architecture

- `/` — single-page scroll experience: `HeroSectionComponent` + `ResumePreviewComponent` (scroll-revealed).
- `/resume` (no token) — renders `ResumePreviewComponent` standalone with a sticky preview banner.
- `/resume?token=<uuid>` — renders `ResumeFullComponent` (future; token validation is client-side for now).
- `ResumePreviewComponent` is a shared component used on both routes — not duplicated.
- Router config: `anchorScrolling: 'enabled'` + `scrollPositionRestoration: 'enabled'` to support `/#about` cross-route navigation.

### Navigation

- Logo click → `/`
- "About" nav link → `[routerLink]="'/'" [fragment]="'about'"` — navigates to `/` and auto-scrolls to the `#about` anchor. Works from any route.
- "Full Resume" nav link → `/resume`
- "Home" nav link removed — logo handles this.

### Modules to build or modify

**`HeaderScrollService`** (new, singleton)
Tracks whether the hero section is in view using `IntersectionObserver`. Exposes `heroVisible: Signal<boolean>`. The header component consumes this to show/hide itself and the hero component uses it to drive the parallax. SSR-safe via `isPlatformBrowser`.

**`HeroSectionComponent`** (new, replaces home page content)
Full-viewport dark section. Renders `ShootingStarsCanvasComponent` as background. Overlays name, title, and "See my work ↓" CTA button. CTA click smooth-scrolls to `#about`. Manual scroll also works — both paths trigger the parallax via `HeaderScrollService`.

**`ShootingStarsCanvasComponent`** (new, deep module)
Custom Canvas animation. Renders a live star field. SVG tech logos fly across the canvas at varying speeds and angles; stars within a radius of each logo are pushed/scattered as it passes, then drift back. Inputs: `icons: TechIcon[]`, `prefersReducedMotion: boolean`, `isLowPerf: boolean`. On `isLowPerf: true`, disables push physics and reduces particle count by ~60%. On `prefersReducedMotion: true`, stops the animation loop entirely. No animation internals exposed.

**`TechStackConfig`** (new, constant)
Typed list of `TechIcon[]` sourced from Devicons SVGs. Methodologies (Agile, Scrum, Kanban) are excluded — they appear in skill chips only. Claude and Cursor entries reference custom SVGs in `src/assets/icons/`.

**`DevicePerformanceService`** (new, singleton)
Exposes `isLowPerf: Signal<boolean>`. Derived from viewport width (`< 768px`) and optionally `navigator.hardwareConcurrency`. Consumed by `ShootingStarsCanvasComponent` and `ScrollTransitionService` to switch behavior on mobile.

**`ScrollTransitionService`** (new, singleton)
Drives the hero exit transition. On desktop: parallax — hero moves up at a slower rate than scroll, revealing the resume section beneath. On mobile (`isLowPerf: true`): simple `opacity` fade driven by `IntersectionObserver`. SSR-safe.

**`HeaderComponent`** (modify existing)
Reads `heroVisible` from `HeaderScrollService`. Hidden (`opacity: 0`, `pointer-events: none`) when hero is visible; fades in when hero exits. Visual style: `backdrop-filter: blur(12px)` + semi-transparent surface token (glass morphism). Works over both the dark hero and the theme-aware resume section without needing to know which is behind it.

**`ResumePreviewComponent`** (new, replaces current ResumeComponent content)
Shared between `/` (scroll section, id=`about`) and `/resume` (standalone). Shows: profile photo (with `account_circle` Material icon fallback if not provided), name, title, location, GitHub + LinkedIn links, all skill chips, and the work history timeline. Does not show: email, achievements. On `/resume` without a token, a sticky banner at the top reads "You're viewing the public preview. [Request full access →]" — the link is a `mailto:` to the configured email address.

**`TimelineComponent`** (new, shared/components)
Reusable vertical timeline. Input: `entries: TimelineEntry[]`. Each entry renders `company`, `role`, `dateRange`, and optionally `logo` (image) and `techStack` (chips). Purely presentational — no knowledge of resume data or preview/full distinction.

**`PortfolioConfig`** (new, `src/portfolio.config.ts`)
Single source of truth for all personal data. Structure uses two explicit sections:

```ts
export const config: PortfolioConfig = {
  hero: {
    name: 'Enrique Enciso',
    title: 'Software Engineer',
  },
  preview: {
    photo: 'assets/photo.jpg',       // optional — falls back to account_circle
    location: 'Mexico',
    github: 'https://github.com/enriqueenciso',
    linkedin: 'https://linkedin.com/in/enriqueenciso',
    skills: ['Angular', 'TypeScript', ...],
    timeline: [
      {
        company: 'Acme Corp',
        role: 'Senior Engineer',
        dateRange: '2022 – present',
        logo: 'assets/logos/acme.svg',       // optional
        techStack: ['Angular', 'NestJS'],     // optional
      }
    ]
  },
  full: {
    email: 'enriquejaviere@gmail.com',
    timeline: [
      {
        company: 'Acme Corp',
        role: 'Senior Engineer',
        dateRange: '2022 – present',
        achievements: [
          'Led migration to Angular 21',
          'Reduced bundle size by 40%',
        ]
      }
    ]
  }
}
```

`full.timeline` entries are matched to `preview.timeline` entries by `company` + `role`. TypeScript enforces required fields; optional fields (`photo`, `logo`, `techStack`) are explicitly typed as optional.

### Tech stack in shooting stars

**Top skills (hero animation + resume chips):** Angular, Angular CLI, React, TypeScript, JavaScript, Git, GitHub, Node.js, RxJS, Claude (custom SVG), Cursor (custom SVG), Playwright, Visual Studio Code, CSS, Sass, HTML.

**Other skills (resume chips only, also in animation):** PostgreSQL, MySQL, Selenium, Windows, Linux, macOS, Next.js, Tailwind, AWS, Docker, Java, Spring Boot, Bootstrap, PrimeNG, Angular Material, Jasmine, Karma, NestJS, Express.js, Zod, MongoDB, Redis, GraphQL, GitHub Actions, Vercel, Jest, Vitest, Webpack, Vite.

**Excluded from animation (chips only):** Agile, Scrum, Kanban — no Devicon SVGs, methodology badges add no visual value next to framework logos.

### Header appearance

Hidden on hero load. Fades in (`opacity` + `pointer-events`) when `heroVisible` becomes `false`. Style: `backdrop-filter: blur(12px)` + semi-transparent `--mat-sys-surface` token. No changes to the existing `mat-toolbar` DOM structure.

### Scroll transition

- **Desktop:** CSS `transform: translateY` driven by scroll position. Hero moves up at ~0.5× scroll rate. Resume section is positioned beneath the hero and revealed as the hero slides up.
- **Mobile:** `IntersectionObserver` fires at 50% threshold; hero fades out via `opacity` transition. No scroll math, no `transform`.
- Both paths controlled by `ScrollTransitionService`; components bind to its exposed signals.

### SSR safety

All browser APIs (`canvas`, `IntersectionObserver`, `matchMedia`, `navigator.hardwareConcurrency`, `scroll`) are guarded behind `isPlatformBrowser`, consistent with the existing `ThemeService` pattern.

### Reduced motion

`ShootingStarsCanvasComponent` reads `window.matchMedia('(prefers-reduced-motion: reduce)')` on init. If true, the animation loop does not start and the canvas renders a static star field.

## Testing Decisions

Good tests verify observable behavior from the outside — not implementation details like private methods or internal signals.

**`ShootingStarsCanvasComponent`**
Test that: given an `icons` input, the canvas element is rendered; given `prefersReducedMotion: true`, `requestAnimationFrame` is never called; given `isLowPerf: true`, the canvas still renders (animation runs, just simplified).

**`HeaderScrollService`**
Test that: `heroVisible` starts `true`; when a stub `IntersectionObserver` fires a non-intersecting entry, `heroVisible` becomes `false`; when it fires an intersecting entry, `heroVisible` returns to `true`.

**`DevicePerformanceService`**
Test that: `isLowPerf` is `true` when viewport width is below 768px (stub `window.innerWidth`); `false` above it.

**`ScrollTransitionService`**
Test that: on desktop (not `isLowPerf`), scroll events update the hero transform signal; on mobile (`isLowPerf`), the `IntersectionObserver` path is used instead.

**`TimelineComponent`**
Test that: given an `entries` input, the correct number of timeline items renders; each item displays `role`, `company`, and `dateRange`; entries without `logo` render without a broken image; entries without `techStack` render without a chips section.

**`ResumePreviewComponent`**
Test that: the preview banner renders on `/resume` without a token; the banner does not render when used as the scroll section on `/`; when `photo` is absent from config, the fallback icon renders.

Prior art: see `src/test-setup.ts` for the `matchMedia` mock pattern to follow for browser API stubs.

## Out of Scope

- **Token-gated full resume** (`/resume?token=...`) — `ResumeFullComponent` and token validation logic; tracked separately.
- **Contact form** — tracked separately; CTA uses `mailto:` for now.
- **Vercel deployment and GitHub Actions CI** — tracked separately.
- **NestJS API** — tracked separately.
- **SEO** (meta tags, Open Graph, JSON-LD) — tracked separately.
- **"About" page** — a dedicated route explaining the tech stack used to build this portfolio itself; tracked separately.
- **Template / white-label mode** — promoting `portfolio.config.ts` as a first-class fork-and-fill template with documentation, schema export, and a setup guide; tracked separately. The config structure built in this PRD is the foundation.
- **Dark/light theme toggle UI changes** — existing `ThemeService` is sufficient.
- **TypeORM / Prisma** — no backend in this phase.

## Further Notes

- Profile photo is available and will be added to `src/assets/` before `ResumePreviewComponent` is implemented.
- Custom SVGs for Claude and Cursor are required before the full `TechStackConfig` can be finalized. These should be created and added to `src/assets/icons/` as a prerequisite task.
- The reference portfolio at https://virgenherrera.github.io/virgenherrera/ is used as content structure reference only — not a visual target.
- Two prototype questions remain open and should be resolved before full implementation: (1) exact push/scatter visual for the star field, (2) specific parallax easing feel on desktop. A `/prototype` dev-only route will host these comparisons and is deleted once decisions are locked.
- `full.timeline` matching to `preview.timeline` by `company` + `role` key is a convention, not enforced by TypeScript. A runtime warning in dev mode would help catch mismatches.
