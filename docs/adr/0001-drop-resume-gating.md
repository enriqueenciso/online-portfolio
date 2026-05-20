# Drop resume gating — show full resume to all visitors

The original PRD designed a token-gated resume: visitors without a URL token (`?token=<value>`) saw a preview with email and achievements hidden; token holders saw everything. We dropped this entirely — all visitors now see the full resume on `/`.

The gating was meant to solve two problems: scraper deterrence and a contact funnel. Neither holds up. The canvas animation and Angular SSR rendering already deter automated scrapers — bots don't execute RAF loops or wait for scroll events. The contact funnel argument collapses at the wrong moment: a recruiter who lands on the portfolio from a job application shouldn't hit friction before seeing your best work. Full content makes a stronger impression than withheld content.

## Considered Options

- **Keep full gating** — token URL for full resume, preview for everyone else. Adds token infrastructure, mode-switching in `ResumeSectionComponent`, and a `preview`/`full` split in `PortfolioConfig`. Rejected: friction outweighs benefit.
- **Soft gating** — show all content but gate a PDF download behind the token. Rejected: the PDF format is out of scope for this phase.
- **Drop gating entirely** — chosen.

## Consequences

- No token infrastructure needed (`environment.resumeToken`, query param parsing, mode signals).
- `PortfolioConfig` is flat — no `preview`/`full` split.
- `ResumeSectionComponent` has one mode, one template. Simpler to build and test.
- The `/resume` route is removed. Only `/` exists.
- If stricter enforcement is ever needed, it belongs in a NestJS API (already planned as a future feature) — not in client-side logic.
