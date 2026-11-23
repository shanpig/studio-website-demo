# 有譜 AI — Holographic Design Intelligence (v6)

**Site**: https://shanpig.github.io/studio-website-demo/

## Version control workflow

- `main`: public GitHub Pages production demo (automatically deploys after validation).
- `feature/holographic-agent-hud-v6`: centered sci-fi holographic HUD redesign. Design and implementation are kept in an independent development branch.
- New visual/interaction experiments should go through a dedicated `feature/*` branch and pull request; merge after checks. The feature branch is retained for easy comparison with earlier versions via Git history.

## v6 experience

- A **holographic mascot stays at screen center** with animated rings, pulsing energy-core, sci-fi scan grid and system labels.
- The **chat stays in a bottom communication dock**, avoiding a conventional split landing-page layout.
- **Four independent floating windows** appear only when needed: business discovery (left/top), style selector (right/top), revision log (left/bottom), and downloadable client brief (right/bottom).
- Desktop panels can be **dragged and layered**; users can keep several panels open in parallel. On mobile they become vertically stacked, scrollable panels.
- The previous structured workflow is retained: five business questions, four style examples, client review items, downloadable UTF-8 project requirements, and a local-only demo conversation.
- The system has no live LLM, server storage, payment, CRM, or staffed human support. It is a rule-driven and locally executed interactive prototype.

## Quality gates

Run `node tests/smoke.cjs`. The GitHub Actions workflow checks the PR on branch changes; only `main` triggers Pages publishing. Static checks cover JavaScript syntax and referenced IDs, responsive layout hooks, motion reduction, all four HUD windows and local-only handling. **They are not a completed browser, accessibility or security audit.**

## Why this interface

The sales thesis remains: **AI can generate a website, but clients should not have to learn prompting, interface design, security, data management or iteration logistics.** Each floating panel appears at the moment of a decision, reducing cognitive load instead of showing a long generic website.

## Production boundaries

Customer material, actual payment, mail delivery, real data storage, permissions, design reviews and response-time promises must be implemented before offering this as a paid service. The demo does not impersonate real human staff and doesn't describe invented customer case studies as delivered work.
