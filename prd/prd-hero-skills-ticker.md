## Problem Statement

The hero section is visually striking but communicates nothing about the engineer's technical breadth until the visitor scrolls to the resume. The flying tech-logo canvas animation hints at a stack, but the selection is fixed and small. A visitor who does not scroll never sees the full skills picture. There is no ambient signal in the hero that conveys the depth of the engineer's toolkit.

## Solution

Add a slow auto-scrolling band of skill chips (a marquee ticker) to the hero section, positioned between the typed identity text and the scroll CTA. The ticker displays all skills from all categories in a flat, continuously looping stream. It runs passively in the background — no interaction required — and pauses on hover so visitors can read individual chips. On reduced-motion preference, the ticker stops and a static truncated list is shown instead.

## GitHub Issue

https://github.com/enriqueenciso/online-portfolio/issues/43

## Dependencies

- **Requires issue #42 to land first.** Accent color tokens (`--mat-sys-primary*`) and the `DevicePerformanceService.prefersReducedMotion` pattern must be available before this component is built.

## User Stories

1. As a first-time visitor, I want to see a flowing band of skill chips in the hero so that I understand the engineer's technical breadth before I scroll.
2. As a visitor, I want the ticker to scroll slowly and continuously so that it feels alive rather than static, without demanding my attention.
3. As a visitor, I want the ticker to pause when I hover over it so that I can read individual chips without them scrolling past.
4. As a visitor who prefers reduced motion, I want the ticker to stop scrolling and show a static list instead so that the page respects my accessibility preferences.
5. As a visitor on a low-performance device, I want the ticker to behave the same as on desktop (it is CSS-driven, not canvas-based) so that no special performance branch is needed.
6. As a developer, I want the ticker to source its chips from the existing `PortfolioConfig.skillCategories` data so that no duplicate data definition is introduced.
7. As a developer, I want the ticker to be a self-contained component with no knowledge of `HeroSectionComponent`'s internals so that it can be tested and modified in isolation.

## Implementation Decisions

### Data source

- Flat list derived at render time from `PortfolioConfig.skillCategories` — all Tier 1 and Tier 2 skills concatenated across all five categories, in display order.
- No separate config field. No deduplication needed (skills are already unique across categories per the skills table in `prd-visual-overhaul.md`).

### Animation mechanism

- Pure CSS `@keyframes` marquee (`transform: translateX`) on a duplicated chip list so the loop is seamless. No JavaScript animation library.
- The chip list is rendered twice end-to-end in the DOM; CSS animates the full double-width container so the seam is invisible.
- `animation-play-state: paused` on `:hover` / `:focus-within` stops the scroll.
- `@media (prefers-reduced-motion: reduce)`: animation disabled; only the first copy of the list is shown, truncated to fit one row.

### Reduced-motion integration

- Reads `DevicePerformanceService.prefersReducedMotion` signal in addition to the CSS media query, consistent with how `HeroCanvasComponent` handles the same preference.
- When `prefersReducedMotion` is `true`: component renders a single static row of chips (Tier 1 only, all categories) — no ticker, no duplicate list.

### Chip style

- Chips use the universal pill shape established in issue #42.
- Light, low-contrast styling appropriate for a hero overlay (semi-transparent background, muted border) — distinct from the sidebar's full-contrast chip style so the ticker reads as ambient decoration, not a navigation element.
- No expand toggles, no Tier labels, no category headings in this context.

### Component structure

- `HeroSkillsTickerComponent` — standalone, `shared/components`. Input: `categories: SkillCategory[]`. Internal: flattens skills, duplicates list for seamless loop, drives animation via CSS class + `DevicePerformanceService`.
- `HeroSectionComponent` passes `config.skillCategories` to the ticker. No other changes to `HeroSectionComponent`.

### Positioning in hero

- Below the typed identity text (name + title), above the "See my work ↓" CTA.
- Full width of the hero, no horizontal padding clipping.
- `overflow: hidden` on the host element to mask chips scrolling out of frame.

## Testing Decisions

Good tests verify observable outputs, not animation state or CSS property values.

**`HeroSkillsTickerComponent`**

- Given `categories` input, the correct total chip count renders (sum of all Tier 1 + Tier 2 across all categories, doubled for the seamless loop — or halved if `prefersReducedMotion` is `true`).
- When `prefersReducedMotion` is `true`, the animation CSS class is absent and only one copy of the chip list renders.
- Chip text values match the flattened skill names from the input.

Prior art: `skills-category-row.spec.ts` for the chip-rendering pattern; `hero-canvas.spec.ts` for the `DevicePerformanceService` mock pattern.

## Out of Scope

- Interactive filtering or grouping of skills in the ticker.
- Tier labels or category headings in the ticker view.
- Per-chip click handlers or navigation.
- Ticker in any section other than the hero.
- Any changes to `SkillsSectionComponent` or sidebar skills (covered in issue #42).

## Further Notes

- The ticker is purely decorative in the hero context. Recruiters looking to confirm a specific skill should use the structured `SkillsSectionComponent` in the sidebar (issue #42). The two surfaces serve different purposes: ambient breadth signal (hero) vs. scannable reference (sidebar).
- Chip animation speed should feel slow enough to read — approximately 30–40 seconds for a full loop pass as a starting point. Final speed is a visual judgement call at implementation time.
- If the hero layout becomes crowded after this component is added, the CTA button spacing or typed-text margins are the first candidates for compression — not the ticker height.
