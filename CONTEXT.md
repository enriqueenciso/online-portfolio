---
name: portfolio-context
description: Domain glossary for the online-portfolio project. Canonical terms only — no implementation details.
---

# Portfolio — Domain Glossary

## Visitor

A person who opens the portfolio URL in a browser.

## Hero section

The full-viewport, visually animated landing section that is always the first thing a visitor sees. Contains the engineer's name, title, and a CTA to scroll down.

## Resume section

The content section below the hero. Always reachable by scrolling. Single mode — all content visible to all visitors (see ADR-0001). Two-column layout on desktop (sidebar + main column), single column on mobile.

## ScrollExitBehavior

The scroll-driven hero exit animation. Owned entirely by `HomeComponent` — no dedicated service or wrapper component. As the user scrolls, `HomeComponent` computes an `exitProgress (0 → 1)` signal and applies `transform: translateY` + `opacity` to the hero's container. On mobile (`DevicePerformanceService.isLowPerf`), only `opacity` is applied. Heroes are purely presentational; they do not know about the exit transition.

## DevicePerformanceService

A singleton Angular service that exposes `isLowPerf: Signal<boolean>` and `prefersReducedMotion: Signal<boolean>`. Consumed by `HeroCanvasComponent` (to reduce particle count and disable push physics on mobile) and the scroll transition (to switch from parallax to fade on mobile). Source of truth for performance-based branching — components do not read `window.innerWidth` or `matchMedia` directly.

## HeroCanvasComponent

A single canvas-based component that owns both the star field and the SVG logo animation. Replaces the former `StarFieldComponent`. Reads `DevicePerformanceService` for performance branching. One RAF loop, one canvas element.

Behavior by mode:

- **Desktop:** stars + flying logos + push physics (logos and mouse both scatter stars)
- **Mobile (`isLowPerf`):** stars + flying logos, push physics off
- **`prefersReducedMotion`:** animation loop stopped; stars and logos rendered once at fixed positions — content visible, no motion

## TimelineComponent

A purely presentational shared component that renders a vertical timeline structure. Input: `entries: TimelineEntry[]`. Iterates entries and renders a `TimelineEntryComponent` for each. Entries with `collapsed: true` are hidden by default behind a "Show N earlier roles" toggle; the toggle only renders when at least one entry has `collapsed: true`. No knowledge of `PortfolioConfig` or resume context.

## TimelineEntryComponent

A purely presentational shared component that renders a single timeline entry. Single input: `entry: TimelineEntry`. Renders company, logo (optional), role, date range, tech stack chips (optional), and achievements (optional). No knowledge of what section it lives in.

## TimelineEntry

The typed interface for a single timeline entry. Defined in `src/portfolio.config.ts` alongside `PortfolioConfig`. Fields: `company`, `role`, `dateRange` (required); `logo`, `techStack`, `achievements`, `summary`, `collapsed` (optional). `collapsed: true` marks roles that are hidden by default in the timeline (e.g. early research positions less central to the engineering narrative).

## PortfolioConfig

The single source of truth for all personal data (name, photo, location, bio, skill categories, timeline, education, certifications, contact links). A flat typed constant — no preview/full split (see ADR-0001). All fields are always accessible; components decide what to render based on their own presentation logic, not by reading different config namespaces.

## ProfileSidebar

The sticky left column of the resume section. Contains the engineer's photo, name, title, bio, and contact links. On desktop: sticky at `top: 64px`, 280 px wide. On mobile: collapses to a compact horizontal strip at the top of the resume section.

## SkillCategory

A named grouping of related skills with two visibility tiers. Tier 1 skills are always visible; Tier 2 skills are hidden behind a per-category expand toggle. Five categories in display order: Frontend, AI & Workflows, Backend & Data, DevOps & Tooling, Testing & QA.

## EducationSection

The section below the timeline. Renders the engineer's formal degree as a single entry and certifications as compact badge cards. Part of the main content column in the resume section.

## Header

The site navigation bar. Hidden while the hero section is on screen; fades in once the hero scrolls out of view. Purpose: navigation to future routes. Contains no CTAs. Owns its own scroll threshold check (`window.scrollY > viewport height`) — no shared service needed.
