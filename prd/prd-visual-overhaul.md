## Problem Statement

The current portfolio lacks visual structure and professional polish in the areas that matter most to visitors (recruiters, engineers, collaborators). The resume section is a flat, unstructured block — a basic profile header, a wall of ~50 undifferentiated skill chips, and a two-entry timeline with no descriptions or achievements. There is no bio, no sense of career narrative, and no visual hierarchy to guide the reader's eye. The hero section is visually impressive as a canvas animation but anonymous — it carries no identity signal and could belong to any developer.

As a result, visitors cannot quickly understand who Enrique is, what he specialises in, or what he has accomplished — the section fails its primary job.

## Solution

Redesign the resume section into a structured two-column layout (sidebar + main column) that mirrors the clarity of a polished CV. Enrich the content with a full 8-role work history, a bio, categorised collapsible skills, and an education/certifications section. Enhance the hero section with an identity layer (GSAP entrance animations + typed.js typewriter) on top of the existing canvas, and open a collaborative research spike for a potential full hero rework using a newer animation library.

## GitHub Issue

https://github.com/enriqueenciso/online-portfolio/issues/26

## User Stories

### Resume — Layout & Structure

1. As a recruiter visiting the portfolio, I want to see a two-column layout with a sidebar on the left and a timeline on the right, so that I can identify who Enrique is at a glance while reading his experience.
2. As a visitor on desktop, I want the sidebar to remain sticky as I scroll through the timeline, so that Enrique's identity stays visible throughout my reading.
3. As a visitor on mobile, I want the sidebar to collapse into a compact horizontal profile strip at the top of the resume section, so that the timeline gets full-width space without losing the identity context.
4. As a visitor, I want a clear visual connector (vertical line + date nodes) on the timeline, so that I can track the chronological narrative of Enrique's career at a glance.

### Resume — Sidebar

5. As a recruiter, I want to see Enrique's photo, name, and title prominently in the sidebar, so that I immediately associate the portfolio with a real person.
6. As a visitor, I want to read a short 2–3 sentence bio in the sidebar, so that I understand Enrique's focus and career aspiration in under 10 seconds.
7. As a recruiter, I want to see contact links (email, GitHub, LinkedIn) in the sidebar, so that I can reach out without hunting through the page.
8. As a developer of the portfolio, I want the avatar (photo + name + title), bio, and contact links to be separate components, so that each can be restyled or replaced independently without affecting the others.
9. As a developer, I want the contact links component to support optional fields, so that links can be added or removed from config without breaking the layout.

### Resume — Skills

10. As a recruiter, I want skills grouped into labelled categories (Frontend, AI & Workflows, Backend & Data, DevOps & Tooling, Testing & QA), so that I can quickly scan the areas most relevant to an open role.
11. As a visitor, I want the most important skills (Tier 1) to be visible immediately when I land on the skills section, so that I don't need to expand anything to see Angular, TypeScript, React, etc.
12. As a visitor, I want each skill category row to be independently expandable, so that I can reveal the full depth of a specific category without expanding all of them.
13. As a visitor, I want the AI & Workflows category to appear second (after Frontend), so that Enrique's investment in AI-assisted development is immediately visible as a differentiator.
14. As a developer, I want skill tiers defined in config (not hardcoded in templates), so that updating which skills are Tier 1 vs Tier 2 requires no template changes.

### Resume — Timeline

15. As a recruiter, I want each timeline entry to show a one-sentence summary of the role, so that I can quickly understand the context before reading the achievement bullets.
16. As a recruiter, I want to see 2–4 achievement bullets per role with metrics where available, so that I can assess impact rather than just responsibilities.
17. As a visitor, I want to see compact tech stack badges on each timeline entry, so that I can scan the technologies used per role without reading the full text.
18. As a visitor, I want the 6 most recent roles to be fully detailed by default, so that the timeline is rich without being overwhelming.
19. As a visitor, I want the 2 earliest roles (pre-2016) to be collapsed behind a "Show earlier roles" toggle, so that I can access the full career history if I want it without it cluttering the default view.
20. As a visitor, I want the collapsed earlier roles to expand inline (not a modal or new page), so that the reading flow is not interrupted.

### Resume — Education & Certifications

21. As a recruiter, I want to see Enrique's education (Universidad Politécnica de Chiapas, Software Engineer, 2010–2014) in a dedicated section below the timeline, so that the academic background is findable without dominating the page.
22. As a recruiter, I want to see Enrique's certifications (Build Deepsearch in TypeScript, Agentic AI Engineering, IBM Agile Advocate) displayed as compact badge cards, so that his active investment in learning is visible at a glance.
23. As a developer, I want education and certifications defined in portfolio.config.ts, so that adding a new certificate requires only a config change.

### Hero — Identity Enhancement

24. As a first-time visitor, I want to see Enrique's name and title animate in with a staggered entrance on page load, so that the hero feels intentional and polished rather than static.
25. As a visitor, I want the title to cycle through Enrique's specialisations via a typewriter effect (e.g. "Frontend Engineer", "Angular Specialist", "Team Lead"), so that the hero communicates depth of identity in a compact space.
26. As a visitor, I want the CTA button to animate in after the title, so that the entrance sequence draws my eye to the next action.
27. As a developer, I want GSAP to handle entrance animations and typed.js to handle the typewriter effect, so that each concern has a dedicated, well-supported library with minimal overlap.
28. As a visitor who prefers reduced motion, I want entrance animations to be skipped or minimised, so that the portfolio respects my accessibility preferences.

### Hero — Research Spike

29. As a developer, I want a documented evaluation of 2–3 alternative hero animation libraries (proposed by both developer and owner), so that a decision on a potential full hero rework is made with evidence rather than assumption.
30. As the portfolio owner, I want to share reference works for hero evaluation, so that the final library choice reflects my aesthetic preferences alongside technical merit.
31. As a developer, I want the research spike to produce a go/no-go recommendation before any rework of the existing canvas component begins, so that no current functionality is broken speculatively.

### Content

32. As the portfolio owner, I want all 8 roles in my work history populated in portfolio.config.ts with accurate dates, summaries, achievements, and tech stacks, so that the timeline reflects my full career narrative.
33. As the portfolio owner, I want the sidebar bio to read: "Full-Stack Engineer with 10+ years building user-facing products across enterprise and start-up environments. Angular & TypeScript specialist who leads teams, owns features end-to-end, and cares deeply about the craft — from architecture to pixel."
34. As the portfolio owner, I want the skill list rationalised and deduped across the 5 categories, so that no skill appears twice and the list reflects current relevance.

## Implementation Decisions

### Data layer — portfolio.config.ts

- Add interfaces: `SkillCategory` (name, tier1: string[], tier2: string[]), `Education` (institution, degree, dateRange), `Certificate` (title, issuer, year).
- Add `bio` string field to `preview`.
- Extend `TimelineEntry` with a `summary?: string` field (one-sentence role context, shown above bullets).
- Populate all 8 timeline roles in `full.timeline` with summary, achievements, and techStack. The 6 recent roles map to `preview.timeline`; the 2 earliest (IBM, Sistema Chiapaneco) are present in `full.timeline` only and rendered behind the "Show earlier roles" toggle.
- Replace the flat `skills: string[]` array with `skillCategories: SkillCategory[]` — 5 entries in the order: Frontend, AI & Workflows, Backend & Data, DevOps & Tooling, Testing & QA.
- Add `education: Education` and `certificates: Certificate[]` to `preview`.

### Skill categories and tiers

| #   | Category         | Tier 1 (always visible)                       | Tier 2 (expand to show)                                                          |
| --- | ---------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | Frontend         | Angular, TypeScript, React, RxJS/NgRx, SCSS   | JavaScript, HTML5, Tailwind, Next.js, Bootstrap, PrimeNG, Angular Material       |
| 2   | AI & Workflows   | Cursor, LLMs, AI-assisted dev, GitHub Copilot | —                                                                                |
| 3   | Backend & Data   | Node.js, NestJS, PostgreSQL, Docker, Zod      | GraphQL, MongoDB, Redis, MySQL, SQL Server, Java, Spring Boot, Express.js, Maven |
| 4   | DevOps & Tooling | Git, GitHub Actions, Azure, AWS, Vercel       | Jenkins, Webpack, Vite, Figma, Jira                                              |
| 5   | Testing & QA     | Playwright, Jest, Vitest                      | Jasmine, Karma, Selenium, Test Automation                                        |

### Work history — 6 detailed + 2 collapsed

**Detailed (preview.timeline):**

1. Backbase — Senior Software Engineer, Aug 2025–Present
2. Kunai / WEX — Senior Software Engineer, Mar 2023–Jun 2025
3. The Ksquare Group / CBRE — Senior Software Engineer, Mar 2021–Dec 2022
4. EPAM Systems — Senior Software Engineer, Sep 2019–Mar 2021
5. Softtek / HP — Full-Stack Developer, Jan 2019–Aug 2019
6. IBM — Full-Stack Developer, Feb 2016–Oct 2018

**Collapsed behind toggle (full.timeline only):** 7. Sistema Chiapaneco de Radio, Televisión y Cinematografía — Software Developer & IT Support, Apr 2014–Sep 2015 8. Universidad Politécnica de Chiapas — Software Developer & Researcher, Jan 2013–Dec 2013

### Shared components — sidebar

- `AvatarComponent` — inputs: `photo`, `name`, `title`. Presentational only.
- `ProfileBioComponent` — input: `bio: string`. Presentational only.
- `ProfileLinksComponent` — input: `links: { email?: string; github?: string; linkedin?: string }`. Renders only non-null links. Uses icon + text pattern.
- `ProfileSidebarComponent` — orchestrates the three above. Handles `position: sticky; top: 64px` on `md:` breakpoint. Collapses to horizontal strip below `md:`.

### Shared components — skills

- `SkillsCategoryRowComponent` — inputs: `category: SkillCategory`. Internal `expanded = signal(false)`. Always renders `tier1` chips; conditionally renders `tier2` chips + "Show less" when expanded; renders "+ N more" count chip when collapsed. Animation: `max-height` CSS transition, no JS animation library needed.
- `SkillsSectionComponent` — input: `categories: SkillCategory[]`. Renders one `SkillsCategoryRowComponent` per category. Each row's expand/collapse state is independent.

### Shared components — timeline

- `TimelineEntryComponent` — extend template to render `entry.summary` as a muted paragraph above the achievements list. Tech stack badges move below achievements. Visual connector (dot + vertical line) added via CSS pseudo-elements on the host.
- `TimelineComponent` — add `showEarlier = signal(false)` internal state. Entries beyond index 5 are hidden behind a "Show 2 earlier roles ↓" button. Toggle only rendered when `entries().length > 6`.

### New component — education

- `EducationSectionComponent` — inputs: `education: Education`, `certificates: Certificate[]`. Renders education as a single timeline-style entry, certs as a row of small cards (title + issuer + year). Placed below `TimelineComponent` inside the main column.

### Resume section restructure

- `ResumeSectionComponent` — replace current single-column template with a two-column CSS Grid layout (`grid-cols-[280px_1fr]` on `md:`, single column below). Left cell: `ProfileSidebarComponent`. Right cell (top to bottom): section heading, `TimelineComponent`, `EducationSectionComponent`, `SkillsSectionComponent`.

### Hero enhancement

- Install `gsap` and `typed.js` as dependencies.
- On `ngAfterViewInit` (browser-only, guarded with `isPlatformBrowser`): GSAP timeline fades/slides in name → typed.js typewriter starts (300ms delay) → CTA button slides up on typed.js `onComplete`.
- `prefers-reduced-motion`: skip GSAP and typed.js entirely, render text immediately.
- `HeroCanvasComponent` is untouched.

### Hero research spike (separate story, not blocking)

- Evaluate 2–3 candidate libraries collaboratively (developer proposes, owner shares references).
- Criteria: bundle size, Angular compatibility, visual impact, SSR safety.
- Produces a go/no-go recommendation before any canvas rework begins.

### Responsive breakpoints

- Desktop (`md:` ≥ 768px): two-column grid, sidebar sticky at `top: 64px`.
- Mobile (< `md:`): single column, sidebar as horizontal flex strip (avatar left, name/title/links right).

## Testing Decisions

Good tests verify observable behaviour from the outside — what the template renders given inputs or interactions — not internal signal values or private methods. Follow the pattern in `timeline.spec.ts` and `timeline-entry.spec.ts`.

### High priority (logic)

- `SkillsCategoryRowComponent` — Tier 1 chips always visible; Tier 2 hidden by default; "show more" reveals Tier 2 and changes label; "show less" collapses; no toggle when Tier 2 is empty.
- `TimelineComponent` — ≤6 entries: no toggle renders; >6 entries: entries past index 5 hidden, toggle visible; clicking toggle reveals all entries.
- `TimelineEntryComponent` — summary renders when provided, absent when not; achievements count correct; tech chips render; logo present/absent handled gracefully.
- `ProfileLinksComponent` — each link renders when provided, absent when omitted; all three together.

### Low priority (presentational)

- `AvatarComponent` — photo renders with correct src/alt; fallback icon when photo absent.
- `ProfileBioComponent` — bio text renders.
- `ProfileSidebarComponent` — all three sub-components render when inputs provided.
- `SkillsSectionComponent` — one row per category.
- `EducationSectionComponent` — education entry renders; correct cert card count.

### Hero

- `HeroSectionComponent` — name and title render in DOM; animation libraries mocked/noop in test environment; no SSR errors (platform guard).

## Out of Scope

- Hero full rework — deferred until research spike produces a library decision.
- Contact form / NestJS API.
- Projects showcase section.
- Token-gated full resume (`/resume?token=`).
- SEO meta tags / Open Graph.
- Dark/light mode theming changes beyond existing `ThemeService`.
- Vercel deployment / CI pipeline changes.
- `HeaderComponent` or `FooterComponent` changes.
- Company logos for timeline entries (config shape supports them, asset sourcing is a separate task).

## Further Notes

- The existing `HeroCanvasComponent` is not modified in this story — it runs as the background layer. The identity layer sits above it at `z-10`.
- The `portfolio.config.ts` dev-mode validation guard (checking `preview.timeline` vs `full.timeline` alignment) needs updating to accommodate the 6/2 entry split.
- Full work history source of truth: see memory file `user_work_history.md`.
- Approved sidebar bio: _"Full-Stack Engineer with 10+ years building user-facing products across enterprise and start-up environments. Angular & TypeScript specialist who leads teams, owns features end-to-end, and cares deeply about the craft — from architecture to pixel."_
