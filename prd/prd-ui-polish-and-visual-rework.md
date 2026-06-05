## Problem Statement

Several small friction points accumulate into a portfolio that reads as unfinished despite otherwise solid foundations. The contact pills render in a single vertical column — on wide screens they never wrap, and on narrow screens they overflow rather than reflow. Skill category groups in the sidebar bleed into each other because the only visual separator is a small text header, making it hard to tell where one category ends and the next begins. The Education & Certifications block has no heading of its own and sits flush against the experience timeline, so the page hierarchy at the bottom of the main column is unclear. The Tier 1 skill chips for several categories include too many items, diluting the "first impression" that Tier 1 is meant to convey. Finally, the overall color palette is intentionally monochromatic with a single accent, which keeps things safe but misses an opportunity: assigning distinct semantic hues to different content categories (skill groups, status badges, interactive elements) would make the page scannable at a glance and give it the polished, designed feel that a single accent cannot achieve on its own.

## Solution

Fix the four low-complexity issues directly: switch contact pills to a wrapping row on desktop while keeping vertical on mobile, increase inter-group spacing in the skills section with a subtle divider, add an "Education & Certifications" `<h2>` with top padding, and update `portfolio.config.ts` to trim Tier 1 per category and add Claude Code to the AI group. For the larger visual rework, run a styling exploration phase — try multiple color approaches in the browser, pick a direction, then document the chosen system in this PRD so future development has a reference point.

## GitHub Issues

- [#53](https://github.com/enriqueenciso/online-portfolio/issues/53) — Contact pills: responsive flex wrap
- [#54](https://github.com/enriqueenciso/online-portfolio/issues/54) — Skills section: inter-group spacing + divider
- [#55](https://github.com/enriqueenciso/online-portfolio/issues/55) — Education & Certifications: section header + top padding
- [#56](https://github.com/enriqueenciso/online-portfolio/issues/56) — Skills Tier 1 content update
- [#57](https://github.com/enriqueenciso/online-portfolio/issues/57) — UI visual rework (prototype)

## User Stories

1. As a visitor on a narrow screen, I want the contact pills to remain in a vertical column so that they fit naturally inside the narrow grid cell next to the photo.
2. As a visitor on a desktop screen, I want the contact pills to display in a centered, wrapping row so that the badge row feels balanced and uses the wider sidebar width effectively.
3. As a visitor scanning the sidebar, I want clearly separated skill category groups with visible spacing and a subtle divider, so that I can tell at a glance that "Frontend" and "AI & Workflows" are distinct sections.
4. As a visitor reading the resume main column, I want an "Education & Certifications" heading above the education block, so that I understand where the experience timeline ends and the education block begins.
5. As a visitor reading the resume, I want meaningful vertical space between the timeline and the education block, so that the two sections feel distinct and the page hierarchy is clear.
6. As a visitor glancing at Tier 1 skills, I want each category to show only its top three core technologies, so that I immediately know the engineer's strongest tools without scanning a full chip set.
7. As a visitor reading the Frontend skills, I want to see Angular, TypeScript, and React as Tier 1, so that the three primary frameworks are immediately apparent.
8. As a visitor reading the AI & Workflows skills, I want to see Claude Code, Cursor, and GitHub Copilot as Tier 1, so that the specific AI coding tools central to the engineer's daily workflow are visible.
9. As a visitor reading the Backend & Data skills, I want to see Java, Node.js, and NestJS as Tier 1, so that the engineer's core backend technologies are surfaced.
10. As a visitor reading the DevOps skills, I want to see Git, Azure, and AWS as Tier 1, so that the three cornerstone DevOps tools are immediately visible.
11. As a visitor reading the Testing skills, I want to see Playwright, Jest, and Vitest as Tier 1 — no change needed in this category.
12. As a visitor exploring the portfolio, I want the page to use multiple purposeful colors — not just one accent — so that different content categories are immediately distinguishable by color as well as by label.
13. As a visitor in light mode, I want category-specific colors to remain legible and accessible, so that the richer palette does not compromise readability.
14. As a visitor in dark mode, I want the multi-hue color system to adapt correctly, so that colors remain accessible and on-theme rather than appearing washed out.
15. As a visitor, I want skill category chips to carry a distinct hue per category (e.g. blue for Frontend, violet for AI, green for Backend), so that I can pattern-match categories visually across the sidebar.
16. As a visitor reading the timeline, I want tech stack chips to use a color scheme consistent with the multi-hue system, so that the same technology always uses the same chip color regardless of where it appears.
17. As a visitor, I want cleaner card surfaces with refined shadows or borders, so that the layout reads as intentionally designed rather than flat and uniform.
18. As a developer, I want the Tier 1 content changes to live only in `portfolio.config.ts`, so that no component logic or template changes are needed for a content-only update.
19. As a developer, I want the contact-pills layout change to be a CSS-only fix with a responsive breakpoint, so that no template or component logic changes are needed.
20. As a developer, I want the education section header to be rendered by `EducationSectionComponent` itself (not injected by the parent layout), so that the component remains self-contained.
21. As a developer, I want the chosen color system documented in this PRD once a direction is selected, so that future development can match it without guessing.
22. As a developer, I want the winning color system to be expressed as design tokens (custom properties or Angular Material palette overrides), so that colors are defined once and consumed consistently across components.

## Implementation Decisions

### Item 1 — Contact pills: responsive flex wrap

- On **mobile** (below `768px`): `.links` keeps `flex-direction: column; gap: 0.5rem` — the badges column in the mobile sidebar grid is `auto`-width, so a horizontal row would break the photo/badges grid balance.
- On **desktop** (`≥768px`): `.links` switches to `flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 0.5rem`.
- The `768px` threshold matches the existing sidebar breakpoint in `profile-sidebar.scss` — no new breakpoint introduced.
- No template change required — the `<ul>` / `<li>` / `<a class="badge">` structure is unchanged. `.badge` already has `display: inline-flex`, which is correct for a wrapping row.

### Item 2 — Skills section: inter-group spacing + divider

- Increase the `gap` on the `SkillsSectionComponent` `:host` from `1rem` to `2rem`.
- Add a subtle top border to each `SkillsCategoryRowComponent` host (e.g. `1px solid var(--mat-sys-outline-variant)`) to reinforce the group boundary visually.
- The first category should suppress its top border (`:first-child` rule) so there is no border above the topmost group.
- No structural template changes required.

### Item 3 — Education & Certifications: header and top padding

- Add an `<h2>` with the text "Education & Certifications" at the top of `EducationSectionComponent`'s template. Heading level is `h2` — matching the sibling "Experience" `<h2>` already in `resume-section.html`. These are peer sections, not nested ones.
- Style the heading identically to the "Experience" heading: `text-4xl font-bold mb-8` Tailwind classes + `color: var(--mat-sys-primary)`.
- Add top padding to `EducationSectionComponent`'s host or root element to create clear breathing room from the last timeline entry above it.
- The heading lives inside the child component — `resume-section.html` does not need to change.

### Item 4 — Skills Tier 1 content update

All changes are data-only in `portfolio.config.ts`. No component or template changes.

**"NestJS" in Backend & Data Tier 1 was always correct** — it was not a data entry error. NestJS (the Angular-inspired Node.js API framework) and Next.js (the React SSR framework) are different technologies. Next.js remains in Frontend tier2 where it already lives; no move is needed.

**"Claude Code"** (Anthropic's agentic coding CLI) is a new Tier 1 addition to AI & Workflows — it does not appear in the current config at all. The label is "Claude Code", not "Claude", to be specific and to pair naturally with Cursor and GitHub Copilot as peer coding tools.

| Category         | Current Tier 1                                | New Tier 1                                    | Demoted to Tier 2                          |
| ---------------- | --------------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| Frontend         | Angular, TypeScript, React, RxJS/NgRx, SCSS   | Angular, TypeScript, React                    | RxJS/NgRx, SCSS (prepend to tier2)         |
| AI & Workflows   | Cursor, LLMs, AI-assisted dev, GitHub Copilot | Claude Code _(new)_, Cursor, GitHub Copilot   | LLMs, AI-assisted dev (move to tier2)      |
| Backend & Data   | Node.js, NestJS, PostgreSQL, Docker, Zod      | Java _(promoted from tier2)_, Node.js, NestJS | PostgreSQL, Docker, Zod (prepend to tier2) |
| DevOps & Tooling | Git, GitHub Actions, Azure, AWS, Vercel       | Git, Azure, AWS                               | GitHub Actions, Vercel (prepend to tier2)  |
| Testing & QA     | Playwright, Jest, Vitest                      | Playwright, Jest, Vitest                      | _(no change)_                              |

Demoted items should be prepended to their category's `tier2` array so they remain prominent after the expand toggle rather than buried at the end.

### Item 5 — UI visual rework (prototype)

This item is an open styling exploration — not a feature with deliverable variants or toggle infrastructure. The workflow is: try color approaches directly in the browser, evaluate visually in both light and dark mode, pick a direction, then commit.

**What "done" means:** Once a color direction is chosen, this PRD is updated with:

- The chosen color system (which hues per category, token strategy — e.g. custom Angular Material 3 tonal palettes vs. Tailwind custom properties vs. a hybrid).
- The rationale (why this approach over the alternatives tried).
- Any layout changes introduced as a side effect.

This gives future development a single reference point without requiring a Figma file or a separate ADR.

**Prototype goal:** Explore beyond the current single `--mat-sys-primary` accent. The reference aesthetic (colored pill badges per semantic category, clean surfaces, strategic multi-hue usage) should inform the direction — but the goal is to apply the _principle_ (semantic color per category) to the existing light/dark system, not to copy a dark-only aesthetic.

**Variant directions to explore (not exhaustive):**

- _Direction A — Category hues:_ Assign a distinct color per skill category (e.g. blue for Frontend, violet for AI & Workflows, emerald for Backend, amber for DevOps, rose for Testing). Apply as chip background tints. Timeline tech-stack chips use the same color for the matching category. Non-category surfaces stay neutral.
- _Direction B — Status badges on timeline:_ Treat timeline entries with a colored role-type badge (e.g. "Senior", "Lead", "Full-Stack") in a distinct hue per role type. Skill chips remain the primary accent. Surfaces gain subtle colored backgrounds per section.

**Technology scope:**

- Base stays on Angular Material + Tailwind v4.
- Custom Angular Material 3 tonal palettes per category are the preferred token mechanism — avoids a parallel custom-property system.
- Any additional library introduced during exploration must be explicitly weighed against the cost of a new dependency before being committed.

## Testing Decisions

Good tests verify external behavior observable in the DOM — rendered structure, text content, CSS classes, signal-driven state changes — not internal implementation details or animation timing.

**ProfileLinksComponent**

- On desktop viewport: verify the `.links` element uses `flex-direction: row` (or equivalent) rather than `column`.
- On mobile viewport: verify the `.links` element uses `flex-direction: column`.
- Existing tests for `href` values, badge labels, and hover-class toggling continue to apply.
- Prior art: `profile-links.spec.ts`.

**SkillsSectionComponent / SkillsCategoryRowComponent**

- Verify that adjacent category rows have measurable vertical separation larger than the previous `1rem` value.
- Verify that each `SkillsCategoryRowComponent` (except the first) has a visible top border applied.
- Prior art: `skills-section.spec.ts`, `skills-category-row.spec.ts`.

**EducationSectionComponent**

- Verify an `<h2>` element with text "Education & Certifications" is rendered.
- Existing tests for cert cards, institution, degree, and date range continue to apply.
- Prior art: `education-section.spec.ts`.

**portfolio.config.ts (Tier 1 content)**

- The config file itself is plain data — no unit tests directly on it.
- Integration-level: verify that `SkillsSectionComponent` renders exactly three Tier 1 chips for each of the five categories when given the updated config. This catches regressions if a future config edit accidentally extends Tier 1 again.
- Add a spec case to `skills-section.spec.ts` that provides the production config and asserts Tier 1 chip counts per category.

**UI visual rework (prototype)**

- No automated tests during the exploration phase.
- Once a direction is committed, visual regression tests (e.g. Playwright screenshot comparison) are the appropriate follow-up mechanism — deferred to a separate issue.

## Out of Scope

- Changes to the Hero section or HeroCanvasComponent.
- Adding new contact links beyond Email, GitHub, and LinkedIn.
- Accessibility audit beyond ensuring new accent colors meet WCAG AA contrast ratios on their respective surfaces.
- PDF download gating or token-gated resume logic.
- Full OKLch/HCT color science — HSL tonal scales are sufficient for this phase.
- Structural changes to timeline entries (content or order).
- FooterComponent changes.
- Backend or API work.
- Variant-switching infrastructure (query params, routes, dev toggles) — the prototype is a direct styling exploration, not a feature with selectable modes.

## Further Notes

- The reference screenshot that inspired Item 5 uses very dark surfaces, colored rank-hierarchy pill badges in distinct hues, and per-item category labels each with a different background color. The key takeaway is the _principle_ — semantic color per category — not the dark aesthetic. Apply it to the existing light/dark system.
- "Claude Code" is the specific Anthropic agentic coding CLI, distinct from the Claude model name. The Tier 1 chip reads "Claude Code" to pair naturally with Cursor and GitHub Copilot as peer tools.
- NestJS (Backend & Data) and Next.js (Frontend tier2) are different technologies and live in different categories. No move is needed for Next.js.
- Demoted Tier 1 items should be prepended to `tier2` arrays, not appended, so they remain the most visible items after the expand toggle.

## Chosen Direction (to be filled after prototype)

_This section is intentionally blank. Once a color direction is selected during the prototype phase, document here: the chosen hue assignments, token strategy, rationale, and any layout changes introduced._
