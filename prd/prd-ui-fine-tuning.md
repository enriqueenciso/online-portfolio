## Problem Statement

The portfolio visual identity feels unfinished. The resume section blends into the hero with no clear separation, the profile sidebar has structural and spacing problems (photo touches the header on scroll, the engineer's name is buried inside a photo overlay), contact links use generic icons with no brand identity, and the page reads as a stark black-and-white document with no accent color to guide the eye. Chips and badges across the page lack a consistent shape language. The theme-toggle button switches state with no animation. Taken together, these gaps make the portfolio feel like a functional prototype rather than a polished professional product.

## Solution

Introduce a single accent color (`#519CDF`) as a custom Angular Material 3 tonal palette — the single source of truth in `styles.scss`, from which all `--mat-sys-primary*` tokens derive automatically. Apply it to nav links, section headings, timeline decoration, and contact badge interactions. Restructure the ProfileSidebar so the name appears above the photo, add Location and a brief one-sentence bio, move Skills into the sidebar with a mobile-friendly expand/collapse, and replace the generic contact link row with brand-logo pill badges. Establish pill shape as the universal chip language across the entire page. Resolve the resume section card shape via a prototype (three variants — tracked in issue #44). Add box-shadow depth to the header. Animate the theme-toggle with a custom CSS morph component, keeping a simpler fallback component for reference.

## GitHub Issues

- https://github.com/enriqueenciso/online-portfolio/issues/42 (this PRD)
- https://github.com/enriqueenciso/online-portfolio/issues/43 (hero skills ticker — out of scope here, depends on this)
- https://github.com/enriqueenciso/online-portfolio/issues/44 (resume card shape prototype — sub-task)

## User Stories

1. As a visitor, I want the portfolio to have a recognizable accent color so that I immediately perceive a designed, intentional brand instead of a generic template.
2. As a visitor, I want nav links in the header to highlight in the accent color on hover so that interactive affordance is clear and on-brand.
3. As a visitor, I want section headings inside the resume to use the accent color so that I can quickly scan the page hierarchy.
4. As a visitor in dark mode, I want accent-colored elements to stay legible so that contrast ratios remain accessible.
5. As a visitor, I want the header to cast a subtle shadow so that I perceive it as a floating layer above the content.
6. As a visitor scrolling the resume on desktop, I want the sidebar to have enough top clearance to never overlap the header so that the profile photo and name are always fully visible.
7. As a visitor, I want to see the engineer's name above the photo in the sidebar so that the name is always legible regardless of photo contrast.
8. As a visitor, I want to see the engineer's title and location directly below the photo so that I have immediate professional context without reading the full resume.
9. As a visitor, I want to read a brief one-sentence bio below the location on desktop so that I get a quick sense of the engineer's profile before scanning the full experience.
10. As a mobile visitor, I want the sidebar to show the name full-width at the top, a two-column row below it (photo + title + location on the left; contact badges on the right), and a collapsible skills row below that, so that the layout makes efficient use of limited vertical space.
11. As a mobile visitor, I do not need to see the bio in the sidebar so that the mobile layout stays compact.
12. As a mobile visitor, I want a "Show Skills" expand toggle below the photo/badges row so that I can access the full skills list without it occupying vertical space by default.
13. As a desktop visitor, I want the full skills list displayed in the sidebar so that I can view all skill categories without navigating away from the sidebar.
14. As a visitor, I want contact links displayed as pill-shaped brand badges (with official logos for Email, GitHub, and LinkedIn) rather than plain text links so that the links feel polished and immediately recognizable.
15. As a visitor, I want clicking the email badge to open my mail client pre-addressed to the engineer so that contacting them requires zero friction.
16. As a visitor, I want contact badges to change to the accent color on hover so that interactive affordance is consistent with the rest of the page.
17. As a visitor, I want all chips across the page (skill chips, tech stack chips, contact badges) to use a consistent pill shape so that the page has a coherent visual language.
18. As a visitor, I want the theme-toggle button to animate smoothly between the sun and moon states so that the transition feels intentional rather than an abrupt icon swap.
19. As a visitor on any screen size, I want the resume section to be visually distinct from the hero section so that I clearly know where the resume begins.
20. As a visitor, I want the Skills section removed from the main resume column so that the main column stays focused on experience and education.
21. As a developer, I want the accent color defined once as a custom Angular Material 3 palette in `styles.scss` so that all `--mat-sys-primary*` tokens derive from it automatically without a parallel custom-property system.
22. As a developer, I want the tonal palette to adapt to both light and dark modes via Material's built-in theme generation so that I never manually manage color values for each mode.
23. As a developer, I want two theme-toggle components (a CSS-morph variant and a scale-plus-fade variant) so that the simpler fallback is available without being deleted.

## Implementation Decisions

### Accent color — custom Material 3 palette

- Replace `mat.$azure-palette` in `styles.scss` with a custom Material 3 tonal palette seeded from `#519CDF` (HSL approximately 210°, 68%, 60%).
- The derivation strategy is the **monochromatic HSL tonal scale** — keep Hue and Saturation fixed, vary Lightness across steps (0 through 100). Equivalent to Tailwind's `sky-100` through `sky-900`; analogous to Material Design 3's tonal palettes (which use OKLch internally, but HSL is sufficient for this phase).
- Generating a valid Material 3 palette Sass map from the seed requires computing tonal values at stops 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100. Use the [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) as a one-time step at setup.
- All existing `var(--mat-sys-primary)` usages (timeline dot, skill category toggles, toggle button ripple) automatically pick up the new color. No parallel `--accent-*` custom property system is introduced.
- `$blue-palette` (currently used as `tertiary`) can be replaced with a complementary palette derived from the same seed or left as-is — decided at implementation time.

### ProfileSidebar restructure — desktop

- New vertical stack (top to bottom): **Name → Photo → Title → Location → Bio → Contact Badges → Skills**.
- Name is a standalone sibling element rendered _above_ `<app-avatar>`, not a text overlay on the photo. `AvatarComponent` loses its `.name-overlay` and `name` input entirely.
- Bio is a single sentence (down from the current two-sentence paragraph). Content update lives in `portfolio.config.ts`. Rendered on desktop via `ProfileBioComponent`; hidden on mobile.
- Location is already present in `PortfolioConfig` (value: `'Jalisco, México'`) — this is a rendering addition only, no config change needed. Rendered as a new line below Title, with a pin icon.
- Sticky top offset increases from `64px` (header height) to `64px + gap` so the name never sits flush against the header edge during scroll.

### ProfileSidebar restructure — mobile

- **Row 1:** Name, `width: 100%`.
- **Row 2:** Two columns — left: Photo + Title + Location stacked and vertically centered; right: Contact Badges stacked.
- **Row 3:** "Show Skills" expand toggle that reveals the full `SkillsSectionComponent` inline below. Skills collapsed by default.
- Bio hidden (`display: none`) on mobile.
- Expand/collapse uses Angular Animations (already available via `provideAnimationsAsync()` in `app.config.ts`) for a smooth height transition — no new animation dependency.

### SkillsSectionComponent relocation

- Removed from `ResumeSectionComponent`'s main column.
- Full component (all five `SkillCategory` groups, Tier 1 always visible, Tier 2 behind per-category expand toggles) rendered inside `ProfileSidebarComponent`.
- Desktop: always visible below Contact Badges. Mobile: hidden behind the "Show Skills" toggle.
- No truncation or condensing — the existing Tier 1/Tier 2 mechanism already handles density.

### Universal pill chip language

- All chips and badges across the page adopt full `border-radius` (pill / capsule shape).
- Applies to: skill chips in `SkillsSectionComponent`, tech stack chips in `TimelineEntryComponent`, and the new contact badges in `ProfileLinksComponent`.
- Implemented once at the Material theme level or a shared chip style token — not per-component overrides.

### ProfileLinksComponent — contact badges

- Three badges: **Email** (envelope SVG icon + `"Email"` label, `mailto:enriquejaviere@gmail.com`), **GitHub** (Invertocat SVG + `"GitHub"` label), **LinkedIn** (in-logo SVG + `"LinkedIn"` label).
- Shape: pill (full `border-radius`), outlined border using `var(--mat-sys-primary)` (the new accent), icon left + label right.
- Hover state: background fills to a light accent tint (`--mat-sys-primary-container`), text and icon shift to `--mat-sys-on-primary-container`. Transition `200ms ease`.
- SVGs are inline within the component template — no third-party icon library introduced.
- `mailto:` is the current target for the email badge. Re-pointing to a `#contact` anchor is deferred to issue #2.

### Header enhancements

- `box-shadow` added to the `.visible` state of `mat-toolbar` — neutral `rgba` shadow (not accent-tinted) to convey elevation without competing with the accent color.
- Nav link hover changes from `opacity: 0.7 → 1` to `color: var(--mat-sys-primary)` at full opacity.
- Brand name link (`"Enrique Enciso"`) stays `var(--mat-sys-on-surface)` — neutral. Accent is reserved as a navigational signal.
- Active/current-route nav link uses `var(--mat-sys-primary)` at full opacity.

### Theme-toggle components

Two standalone components, both importable by `HeaderComponent`:

**`ThemeToggleMorphComponent`** (active):

- Custom CSS morph based on the [mary.codes sun/moon icon technique](https://mary.codes/blog/programming/menu_sun_moon_animated_css_icons/).
- Structure: a `<div class="darkmode-icon">` with eight `<span class="ray">` children. The circle scales, a masking `::after` pseudo-element disappears, and the eight rays rotate + translate outward in a staggered sequence (parent animates over `0.75s`, rays over `0.5s`).
- Toggle selector adapted from `[data-theme="dark"]` to `body.dark &` — consistent with the project's established dark mode mechanism (`ThemeService` toggles `.dark` on `<body>`).
- Wrapped inside the existing `mat-icon-button` to preserve ripple, focus ring, and `aria-label` accessibility.
- `prefers-reduced-motion`: CSS `@media (prefers-reduced-motion: reduce)` skips the keyframe animation and swaps icons immediately.

**`ThemeToggleSimpleComponent`** (fallback, not deleted):

- Two `<mat-icon>` elements (`light_mode` / `dark_mode`) with a CSS `@keyframes` scale + opacity crossfade driven by a signal-toggled class.
- Kept as a standalone, importable component. The header imports `ThemeToggleMorphComponent` as the active variant; swapping to the simple variant is a one-line import change.

### Resume section visual depth

- Deferred to prototype issue #44. Three variants will be built and evaluated before a shape is committed:
  - **Variant A:** Contained card (max-width, horizontal margin, full border-radius, box-shadow).
  - **Variant B:** Full-bleed band (full viewport width, box-shadow, no border-radius).
  - **Variant C:** Top-rounded only (full width, `border-radius` on top edge, rises from hero).
- All variants use `--mat-sys-primary-container` (or equivalent accent surface token) for the background tint in both light and dark modes.
- The winning variant from the prototype feeds back into the final implementation of this issue.

### Accent applied to headings

- Section headings (`h2`, `h3`) inside the resume section use `var(--mat-sys-primary)` or a darker on-surface variant depending on contrast in each mode.
- Timeline dot (`::before` pseudo-element, currently `var(--mat-sys-primary)` with the azure palette) automatically adopts the new color once the palette is replaced.

## Testing Decisions

Good tests verify observable outputs — rendered DOM structure, input binding, signal state changes, CSS class toggling — not internal implementation details or animation timing.

**`ProfileSidebarComponent`**

- Name element renders above `<app-avatar>` in the DOM on desktop.
- `location` input is rendered as a text node.
- `ProfileBioComponent` is present on desktop (`md:` viewport), absent on mobile.
- `SkillsSectionComponent` is rendered; on mobile it is behind a toggle and hidden by default.
- "Show Skills" toggle changes the expand signal and renders the skills section.

**`AvatarComponent`**

- No element with `.name-overlay` class exists in the DOM.
- `name` input no longer accepted / no longer rendered inside the avatar wrapper.

**`ProfileLinksComponent`**

- Email badge renders with `href="mailto:enriquejaviere@gmail.com"` and label `"Email"`.
- GitHub badge renders with the correct external URL.
- LinkedIn badge renders with the correct external URL.
- Hover class is applied on `mouseenter` / removed on `mouseleave`.

**`ThemeToggleMorphComponent`** and **`ThemeToggleSimpleComponent`**

- When `ThemeService.isDark` is `false`, the light-mode CSS class is applied.
- When `ThemeService.isDark` is `true`, the dark-mode CSS class is applied.
- Animation itself (`@keyframes`) is purely presentational and not tested.

Prior art: existing `*.spec.ts` files in `profile-sidebar/`, `avatar/`, and `profile-links/` provide the baseline structure.

## Out of Scope

- Hero section skills ticker — tracked in issue #43. Depends on this issue landing first (accent tokens must be available).
- Resume section card shape — deferred to prototype issue #44. Implementation of the winning shape re-enters scope once the prototype decision is made.
- Contact form and contact section — tracked in issue #2. Email badge points to `mailto:` until then.
- Full OKLch/HCT color science — HSL tonal scale is sufficient for this phase.
- Accessibility audit beyond ensuring accent colors meet WCAG AA contrast ratios on their respective surfaces.
- Any structural changes to `HeroSectionComponent` or `HeroCanvasComponent`.
- PDF download gating — see ADR-0001.
- `FooterComponent` changes.

## Further Notes

- `location` is already defined in `PortfolioConfig` (`'Jalisco, México'`) but not rendered anywhere in the sidebar. This is a rendering-only addition.
- `bio` content must be shortened to one sentence in `portfolio.config.ts` as part of this work. Exact wording is the engineer's call; the current two-sentence version is the starting point.
- The [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) is the recommended tool for generating the Sass tonal palette map from the `#519CDF` seed color. Run it once, copy the output Sass map into `styles.scss`.
- The mary.codes technique uses `[data-theme="dark"]` as its selector. Adapt it to `body.dark &` to stay consistent with `ThemeService` — no new selector convention should be introduced.
- Related issues: #43 (hero skills ticker, out of scope here), #44 (resume card shape prototype, sub-task).
