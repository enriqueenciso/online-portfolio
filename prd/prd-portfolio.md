## Problem Statement

The current portfolio home page is a plain, text-only hero section with a name, tagline, and two buttons. It makes no visual impression and does not represent the technical depth or personality of the engineer behind it. The resume section is similarly bare — no photo, no timeline, no personality. A visitor landing on the page today has no reason to stay or scroll.

## Solution

Replace the current static home page with a two-section, single-page experience on `/`:

1. **Hero section (full viewport):** A dark, visually rich landing screen with a canvas animation — SVG tech stack logos fly across a live star field, scattering stars as they pass, with mouse-reactive push physics — overlaid with the engineer's name, title, and a single CTA.
2. **Resume section (scroll-revealed):** As the user scrolls, the hero exits via a scroll-driven transition and a polished resume section is revealed, showing a profile photo, contact info, all skills, and a professional work history timeline.

Both sections live on `/`. There is no `/resume` route. All visitors see the full resume — no gating, no token required. See ADR-0001.

## User Stories

1. As a visitor, I want to see a visually impressive landing screen when I open the portfolio, so that I immediately get a sense of the engineer's personality and aesthetic.
2. As a visitor, I want to see SVG tech stack logos flying across a star field in the hero background, so that I can instantly grasp which technologies the engineer works with.
3. As a visitor, I want the stars in the hero to scatter as logos fly through them, so that the animation feels physical and alive rather than a flat loop.
4. As a visitor, I want to see the engineer's name and professional title clearly overlaid on the hero animation, so that I know whose portfolio I am viewing.
5. As a visitor, I want a "See my work ↓" button in the hero, so that I have an explicit invitation to explore further.
6. As a visitor, I want clicking the CTA button to smooth-scroll me to the resume section, so that the transition feels intentional.
7. As a visitor, I want to also be able to scroll down manually to reveal the resume section, so that I am not forced through a scripted interaction.
8. As a visitor, I want the hero to slide off as I scroll, so that revealing the resume section beneath feels intentional.
9. As a visitor, I want a header to appear as I scroll past the hero, so that I can navigate the site without going back to the top.
10. As a visitor, I want the header to have a glass morphism style, so that it looks polished over both dark and light backgrounds.
11. As a visitor, I want to click "About" in the header and be scrolled to the resume section, so that I can reach that section from any page.
12. As a visitor, I want to see the engineer's profile photo, name, title, and location in the resume section, so that the page feels personal and trustworthy.
13. As a visitor, I want to see all of the engineer's skill chips in the resume section, so that I have a complete picture of their technical capabilities.
14. As a visitor, I want to see the engineer's email, GitHub, and LinkedIn links in the resume section, so that I can reach out directly.
15. As a visitor, I want to see a chronological work history timeline in the resume section, so that I can understand the engineer's career progression.
16. As a visitor, I want each timeline entry to show company name, role, date range, achievements, and optionally a company logo and tech stack used, so that I can assess the context and impact of each position.
17. As a visitor, I want the resume section to respect the site's light/dark theme, so that the page is readable in my preferred mode.
18. As a visitor on a mobile device, I want the hero animation to run with reduced particle count and no push physics, so that the page performs well on lower-powered devices.
19. As a visitor on a mobile device, I want the scroll transition to be a simple fade rather than a transform, so that the experience is smooth without fighting the browser.
20. As a visitor who prefers reduced motion, I want the hero animation to be replaced with a static state — logos and stars visible but not moving — so that the page is accessible and not disorienting.
21. As the portfolio owner, I want to create custom SVG icons for Claude and Cursor so that my AI tooling expertise is visually represented in the hero animation alongside other tech logos.
22. As the portfolio owner, I want all personal data — name, photo, skills, work history, contact links — to live in a single `portfolio.config.ts` file, so that updating my portfolio never requires touching component code.
23. As a developer forking this project, I want a typed `PortfolioConfig` interface with autocomplete and compile-time validation, so that I can fill in my own data without guessing field names or breaking the build.
24. As a developer forking this project, I want the profile photo to be optional with a graceful fallback icon, so that the layout never breaks if a photo is not provided.

## Implementation Decisions

### Route architecture

- `/` — single-page scroll experience: `HeroSectionComponent` + `ResumeSectionComponent` (scroll-revealed, `id="about"`).
- No `/resume` route — removed. See ADR-0001.
- Router config: `anchorScrolling: 'enabled'` + `scrollPositionRestoration: 'enabled'` to support `/#about` fragment navigation.

### Navigation

- Logo click → `/`
- "About" nav link → `[routerLink]="'/'" [fragment]="'about'"` — navigates to `/` and auto-scrolls to the `#about` anchor. Works from any route.
- No "Full Resume" link — header is navigation-only, reserved for future routes.
- "Home" nav link removed — logo handles this.

### Scroll exit transition

Owned by `HomeComponent`. As the user scrolls, `HomeComponent` computes `exitProgress (0 → 1)` via `@HostListener('window:scroll')` and applies it to the hero container:

- **Desktop:** `transform: translateY(${-60 * exitProgress}px) scale(${1 - 0.05 * exitProgress})` + `opacity: max(0, 1 - (exitProgress - 0.3) / 0.7)` — "Float Away": -60 px lift, scale to 0.95, fade delayed until 30 % scroll. Hero lags behind scroll, creating a parallax feel.
- **Mobile (`DevicePerformanceService.isLowPerf`):** `opacity` only — no `transform`. Smooth, no scroll math fighting the browser.

No `ScrollTransitionService` or wrapper component. `HomeComponent` guards browser API access with `isPlatformBrowser`.

### Modules to build or modify

**`HeroCanvasComponent`** (new — replaces `StarFieldComponent`)
Single canvas-based component. Owns both the star field and the SVG logo animation. One RAF loop, one canvas element. Reads `DevicePerformanceService` for branching. No animation internals exposed.

- **Desktop:** stars + flying logos + push physics. Both mouse position and logo positions scatter stars.
- **Mobile (`isLowPerf`):** stars + flying logos, push physics off, ~60% fewer stars.
- **`prefersReducedMotion`:** RAF loop stopped; stars and logos rendered once at fixed positions — content visible, no motion.

**`HeroSectionComponent`** (new)
Full-viewport dark section. Renders `HeroCanvasComponent` as background. Overlays name, title, and "See my work ↓" CTA. CTA smooth-scrolls to `#about`. Purely presentational — no scroll or transition logic.

**`TechStackConfig`** (new, constant)
Typed list of `TechIcon[]` sourced from Devicons SVGs. Methodologies (Agile, Scrum, Kanban) excluded — they appear in skill chips only. Claude and Cursor entries reference custom SVGs in `src/assets/icons/`.

**`DevicePerformanceService`** (new, singleton)
Exposes `isLowPerf: Signal<boolean>` and `prefersReducedMotion: Signal<boolean>`. Derived from `window.innerWidth < 768` and `window.matchMedia('(prefers-reduced-motion: reduce)')`. Consumed by `HeroCanvasComponent` and `HomeComponent`. SSR-safe via `isPlatformBrowser`.

**`HomeComponent`** (modify existing)
Composes `HeroSectionComponent` + `ResumeSectionComponent`. Owns scroll exit logic: listens to `window:scroll`, computes `exitProgress`, applies `transform`/`opacity` to the hero container. Branches on `DevicePerformanceService.isLowPerf` for desktop vs mobile transition.

**`HeaderComponent`** (modify existing)
Owns its own scroll visibility check: shows when `window.scrollY > window.innerHeight * 0.8`. No shared service needed. Fades in via `opacity` + `pointer-events` transition. Style: `backdrop-filter: blur(12px)` + semi-transparent `--mat-sys-surface` token. Navigation only — no CTAs.

**`ResumeSectionComponent`** (new — replaces `ResumeComponent`)
Full resume, always. Shows: profile photo (with `account_circle` Material icon fallback if not provided), name, title, location, email, GitHub + LinkedIn links, all skill chips, and the work history timeline via `TimelineComponent`. No gating, no preview/full distinction.

**`TimelineComponent`** (new, `shared/components`)
Reusable vertical timeline. Input: `entries: TimelineEntry[]`. Iterates entries and renders a `TimelineEntryComponent` for each. Purely presentational — no knowledge of resume data or context.

**`TimelineEntryComponent`** (new, `shared/components`)
Renders a single timeline entry. Single input: `entry: TimelineEntry`. Renders: `company`, `role`, `dateRange` (required); `logo`, `techStack` chips, `achievements` (optional). Purely presentational.

**`PortfolioConfig`** (new, `src/portfolio.config.ts`)
Single source of truth for all personal data. Flat structure — no preview/full split:

```ts
export interface TimelineEntry {
  company: string;
  role: string;
  dateRange: string;
  logo?: string;
  techStack?: string[];
  achievements?: string[];
}

export interface PortfolioConfig {
  hero: {
    name: string;
    title: string;
  };
  resume: {
    photo?: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    skills: string[];
    timeline: TimelineEntry[];
  };
}

export const config: PortfolioConfig = {
  hero: {
    name: 'Enrique Enciso',
    title: 'Software Engineer',
  },
  resume: {
    photo: 'assets/photo.jpg',
    location: 'Mexico',
    email: 'enriquejaviere@gmail.com',
    github: 'https://github.com/enriqueenciso',
    linkedin: 'https://linkedin.com/in/enriqueenciso',
    skills: ['Angular', 'TypeScript', '...'],
    timeline: [
      {
        company: 'Acme Corp',
        role: 'Senior Engineer',
        dateRange: '2022 – present',
        logo: 'assets/logos/acme.svg',
        techStack: ['Angular', 'NestJS'],
        achievements: ['Led migration to Angular 21', 'Reduced bundle size by 40%'],
      },
    ],
  },
};
```

### Tech stack in shooting stars

**Top skills (hero animation + resume chips):** Angular, Angular CLI, React, TypeScript, JavaScript, Git, GitHub, Node.js, RxJS, Claude (custom SVG), Cursor (custom SVG), Playwright, Visual Studio Code, CSS, Sass, HTML.

**Other skills (resume chips + animation):** PostgreSQL, MySQL, Selenium, Windows, Linux, macOS, Next.js, Tailwind, AWS, Docker, Java, Spring Boot, Bootstrap, PrimeNG, Angular Material, Jasmine, Karma, NestJS, Express.js, Zod, MongoDB, Redis, GraphQL, GitHub Actions, Vercel, Jest, Vitest, Webpack, Vite.

**Excluded from animation (chips only):** Agile, Scrum, Kanban — no Devicon SVGs, methodology badges add no visual value next to framework logos.

### SSR safety

All browser APIs (`canvas`, `matchMedia`, `scroll`, `window.innerWidth`) are guarded behind `isPlatformBrowser`, consistent with the existing `ThemeService` pattern.

## Testing Decisions

Good tests verify observable behavior from the outside — not implementation details like private methods or internal signals.

**`HeroCanvasComponent`**
Test that: given an `icons` input, the canvas element is rendered; given `prefersReducedMotion: true`, `requestAnimationFrame` is never called; given `isLowPerf: true`, the canvas still renders (animation runs, just simplified).

**`DevicePerformanceService`**
Test that: `isLowPerf` is `true` when viewport width is below 768px (stub `window.innerWidth`); `false` above it. `prefersReducedMotion` reflects the `matchMedia` mock value.

**`HomeComponent`**
Test that: `exitProgress` is `0` when `scrollY` is `0`; approaches `1` as scroll advances through the hero height; on `isLowPerf`, only `opacity` is applied (no `transform`).

**`HeaderComponent`**
Test that: header is hidden when `scrollY` is `0`; becomes visible when `scrollY` exceeds `innerHeight * 0.8`.

**`TimelineComponent`**
Test that: given an `entries` input, the correct number of `TimelineEntryComponent` instances renders.

**`TimelineEntryComponent`**
Test that: `role`, `company`, and `dateRange` always render; entries without `logo` render without a broken image; entries without `techStack` render without a chips section; entries without `achievements` render without an achievements list.

**`ResumeSectionComponent`**
Test that: when `photo` is absent from config, the fallback icon renders; email, GitHub, and LinkedIn links render with correct `href` values.

Prior art: see `src/test-setup.ts` for the `matchMedia` mock pattern to follow for browser API stubs.

## Out of Scope

- **Contact form** — tracked separately; no CTA in resume section for now.
- **"Schedule a call" CTA** — future feature; placeholder for a Calendly or similar integration.
- **Vercel deployment and GitHub Actions CI** — tracked separately.
- **NestJS API** — tracked separately.
- **SEO** (meta tags, Open Graph, JSON-LD) — tracked separately.
- **"About" page** — a dedicated route explaining the tech stack used to build this portfolio itself; tracked separately.
- **Template / white-label mode** — promoting `portfolio.config.ts` as a first-class fork-and-fill template with documentation and a setup guide; tracked separately.
- **Dark/light theme toggle UI changes** — existing `ThemeService` is sufficient.
- **TypeORM / Prisma** — no backend in this phase.

## Further Notes

- Profile photo is available and will be added to `src/assets/` before `ResumeSectionComponent` is implemented.
- Custom SVGs for Claude and Cursor are required before `TechStackConfig` can be finalized. These should be created and added to `src/assets/icons/` as a prerequisite task.
- The reference portfolio at https://virgenherrera.github.io/virgenherrera/ is used as content structure reference only — not a visual target.
- Both prototype questions resolved (see issue #18): parallax uses "Float Away" (-60 px, delayed fade, scale 0.95); star push physics randomly interpolates between Gentle Wake (80 px, 1.0 force) and Hard Scatter (160 px, 2.8 force) on a 5–12 s timer. Stars use a varied colour palette and size distribution. `/prototype` route deleted.
