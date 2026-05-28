## Problem Statement

The resume section currently has no visual separation from the hero section that precedes it. When the hero scrolls away, the resume content appears on the same background surface with no clear boundary — the page feels like one continuous flat document rather than a composed, layered experience. The correct treatment (card, band, or top-rise) cannot be decided without seeing the options in context with real content.

## Solution

Build a prototype that renders all three candidate resume section card shapes simultaneously on a single route using real resume content. A visual decision is made after reviewing the prototype, and the winning variant feeds back into the implementation of issue #42.

## GitHub Issue

https://github.com/enriqueenciso/online-portfolio/issues/44

## Dependencies

- **Accent color tokens should be available before this prototype is built.** Either land issue #42 first, or stub the accent surface color with the raw `#519CDF` hex in the prototype route. The background tint for all three variants uses `--mat-sys-primary-container` (or equivalent accent surface token).

## User Stories

1. As the portfolio owner, I want to see all three resume card shape variants side-by-side (or toggled) in a browser so that I can make a visual decision without imagining what they would look like.
2. As the portfolio owner, I want each variant to use real resume content (not placeholder text) so that the decision reflects how the shape behaves with actual density and length.
3. As the portfolio owner, I want each variant to be visible in both light and dark mode so that the shape decision accounts for both themes.
4. As a developer, I want the prototype to live on a dedicated route (`/prototype/resume-card`) so that it does not interfere with the production page.
5. As a developer, I want the prototype route to be deleted once the visual decision is made so that no dead code remains in the codebase.

## The Three Variants

### Variant A — Contained card

- Max-width matching the current resume content width (approximately the `max-w-5xl` equivalent).
- Horizontal auto-margin (centered on the page).
- Full `border-radius` on all four corners (e.g. `1.5rem`).
- `box-shadow` for elevation.
- The card visually floats as a panel over the page background.
- Background: `--mat-sys-primary-container` tint (light) / dark equivalent.

### Variant B — Full-bleed band

- Background and shadow span the full viewport width.
- Inner content remains width-constrained (same as current resume section padding).
- No `border-radius`.
- `box-shadow` on the top edge only, conveying that the section sits on top of the hero layer.
- Reads as a section stripe, not a card — similar to how most portfolio and resume sites handle section transitions.

### Variant C — Top-rounded only

- Full viewport width (same as Variant B).
- `border-radius` on the **top edge only** (e.g. `border-top-left-radius: 1.5rem; border-top-right-radius: 1.5rem`).
- No bottom rounding (the page continues below the resume section).
- The section appears to rise up from the hero, creating a "sheet lifting" effect.
- Background: same accent surface tint as the other variants.

## Implementation Decisions

### Prototype route

- Route: `/prototype/resume-card`.
- Lazy-loaded, standalone component: `ResumeCardPrototypeComponent`.
- Contains a variant selector (three buttons or a `<select>`) that swaps between the three card style classes without re-rendering the resume content.
- The three variants are implemented as three CSS classes (e.g. `.card-variant-a`, `.card-variant-b`, `.card-variant-c`) applied to the resume section wrapper. Switching variant = swapping the class.

### Content

- Uses the real `PortfolioConfig` data (same as the production resume section).
- Renders `ProfileSidebarComponent` + the main column (`TimelineComponent`, `EducationSectionComponent`) — does not need to be pixel-perfect, just representative of real content density.

### Cleanup

- The `/prototype/resume-card` route and `ResumeCardPrototypeComponent` are deleted once the decision is recorded.
- The winning CSS class/values are extracted into `ResumeSectionComponent`'s styles as part of the issue #42 implementation.
- Decision is recorded as a comment in the issue #44 GitHub thread before closing.

## Testing Decisions

No tests are written for the prototype component. It is throwaway code by design. The only testable contract is that the prototype route renders without error — a smoke test at most.

## Out of Scope

- Final implementation of the winning variant (returns to issue #42 scope).
- Any changes to resume content or data structure.
- Mobile-specific card shape variations — the prototype evaluates desktop shape only. Mobile handling is decided as part of the issue #42 implementation once the desktop shape is chosen.
- Animations or transitions between variants in the selector (the switcher is a utility, not a feature).

## Further Notes

- All three variants should be previewed at a realistic viewport width (1280px+) and in both light and dark mode before the decision is made.
- The key visual question is whether the resume feels like a **document** (Variant B — flat, authoritative) or a **panel** (Variant A — contained, elevated) or a **rising layer** (Variant C — sheet emerging from hero). Each implies a different page metaphor; the right choice depends on what tone the portfolio should convey.
- Once the decision is made, update issue #42 with the chosen variant and close issue #44.
