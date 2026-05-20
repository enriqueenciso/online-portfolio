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

The content section below the hero. Always reachable by scrolling. Rendered in preview mode or full mode depending on token presence.

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

A purely presentational shared component that renders a vertical timeline structure. Input: `entries: TimelineEntry[]`. Iterates entries and renders a `TimelineEntryComponent` for each. No knowledge of `PortfolioConfig` or resume context.

## TimelineEntryComponent

A purely presentational shared component that renders a single timeline entry. Single input: `entry: TimelineEntry`. Renders company, logo (optional), role, date range, tech stack chips (optional), and achievements (optional). No knowledge of what section it lives in.

## TimelineEntry

The typed interface for a single timeline entry. Defined in `src/portfolio.config.ts` alongside `PortfolioConfig`. Fields: `company`, `role`, `dateRange` (required); `logo`, `techStack`, `achievements` (optional).

## PortfolioConfig

The single source of truth for all personal data (name, photo, location, skills, timeline, contact links). A flat typed constant — no preview/full split. Components decide what to render based on mode, not by reading different config keys.

## Header

The site navigation bar. Hidden while the hero section is on screen; fades in once the hero scrolls out of view. Purpose: navigation to future routes. Contains no CTAs. Owns its own scroll threshold check (`window.scrollY > viewport height`) — no shared service needed.
