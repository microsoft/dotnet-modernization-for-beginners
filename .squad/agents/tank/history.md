# Project Context

- **Owner:** Pablo Lopes
- **Project:** dotnet-modernization-for-beginners — a "top 1%" educational repo. Reproducibility is the whole game.
- **Stack:** .NET (legacy: Framework 4.x, .NET Core 3.1, .NET 5/6; modern: .NET 10/11), GitHub Copilot app modernization extension, Azure
- **Created:** 2026-05-21

## Chapter Plan

1. Introduction to Modernization and the Extension
2. Assessment & Planning
3. Modernizing (Act step)
4. Going to the Cloud

## Project Decisions (day-1 baseline)

- **Audience:** Intermediate .NET devs on older versions. Don't assume they have current SDKs installed.
- **Sample strategy:** Hybrid — Chapters 2–3 share a "before" app (Trinity owns); Chapters 1 and 4 are separate.
- **Format:** README + `code/` per chapter.
- **"Top 1%" bar:** Every command in every README must run as written on a fresh machine. That's my job.

## Learnings

### 2026-05-21: Reproducibility Plan — Top 1% Bar Defined

- **What:** Drafted comprehensive QA plan defining 20-item acceptance checklist per chapter, version pinning policy, smoke test protocol (Windows 11 + macOS), known issues tracking, and 5 testable reproducibility criteria.
- **Key decisions:**
  - **Test matrix:** Windows 11 + VS 2022 + Extension, macOS + VS Code + Extension (primary); Ubuntu as spot-check tertiary
  - **Version pinning:** `.NET 8.0` minimum in `global.json`; extension pinned to tested version with badge; monthly NuGet scan for CVEs
  - **Per-chapter gate:** 20-item checklist covers code (A1–A6), prereqs (B1–B5), walkthrough (C1–C5), structure (D1–D5), smoke test (E1–E5), prose (F1–F2), handoff (G1–G3)
  - **Known issues tracking:** `.squad/decisions/inbox/tank-{chapter-slug}.md` per chapter; triaged to owner (Trinity/Switch/Niobe); deferred issues archived post-launch
  - **Top 1% criteria:** (1) First-success time ±20% of budget, (2) zero assumed prereqs, (3) exact reproducibility (no improvisation), (4) cross-platform parity (Windows/macOS), (5) screenshot authenticity
- **Risks mitigated:** Extension UI changes (version pinning + 48h re-test), SDK patch breaks (monthly scan), shared app drift (state validation + git reset), Azure region/tier (Niobe owns callout), missing prereqs (Tank audits + Switch documents), Copilot subscription expiry (early callout + fallback)
- **Coordination with Trinity:** Monthly NuGet security review; Trinity updates `.csproj`, Tank re-tests before merge. Trinity flags breaking changes; Tank escalates to Morpheus if new prerequisites are needed.
- **Hand-off discipline:** If smoke test fails, Tank opens ticket in `.squad/decisions/inbox/tank-{chapter-slug}.md`, does NOT self-fix. Owner (Trinity/Switch/Niobe/Morpheus) fixes; Tank re-tests to confirm.
- **Assumption:** "Top 1%" bar is measured by "every reader who follows the README literally, on a supported OS, with pinned prerequisites, reaches the learning outcome on first try." This is validated by Tank's smoke test before each chapter merge.

<!-- Append new learnings below. Each entry is something lasting about the project. -->
