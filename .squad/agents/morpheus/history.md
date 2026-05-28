# Project Context

- **Owner:** Pablo Lopes
- **Project:** dotnet-modernization-for-beginners — a "top 1%" educational repo in the Microsoft for-beginners series, guiding .NET developers through modernizing legacy apps using the GitHub Copilot app modernization extension.
- **Stack:** .NET (legacy targets: Framework 4.x, .NET Core 3.1, .NET 5/6; modern targets: .NET 10/11), GitHub Copilot app modernization extension (VS / VS Code), Azure (cloud target follows the extension's default flow)
- **Created:** 2026-05-21

## Chapter Plan

1. Introduction to Modernization and the Extension
2. Assessment & Planning (how the extension assesses)
3. Modernizing (Act step — the upgrade itself)
4. Going to the Cloud with the extension

## Project Decisions (day-1 baseline)

- **Sample strategy:** Hybrid — shared "before" legacy app for Chapters 2–3, separate self-contained samples for Chapters 1 and 4.
- **Audience:** Experienced .NET devs on Framework 4.x / .NET Core 3.1 / .NET 5/6 who need both modernization concepts AND tool guidance. Not beginners to C#.
- **Tooling scope:** Strictly the GitHub Copilot app modernization extension (the agentic VS / VS Code experience). No upgrade-assistant CLI, no try-convert, no AppCAT in scope.
- **Cloud target:** Whatever the extension's cloud-migration flow targets by default. Follow the tool.
- **Chapter format:** Lightweight — README walkthrough + `code/` folder per chapter. No quizzes, no assignments, no video placeholders (yet).

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->

### 2026-05-21 — Master Plan Structural Decisions

**Scope cuts proposed:**
- No quizzes/assignments (lightweight format confirmed)
- No upgrade-assistant CLI, AppCAT, or try-convert (extension-only scope)
- No multi-project samples (20-minute time-to-success constraint)
- No .NET version history deep-dive (link to docs instead)

**Repo structure decision:** `shared-legacy-app/` at repo root, not nested. Chapters 2–3 reference it; Chapter 4 uses a separate pre-modernized copy for isolation.

**"Top 1%" defined as testable criteria:** Time-to-first-success ≤ 20 min, 100% reproducibility, one outcome per chapter, concept-before-tool, prerequisites honesty.

**Named weakness:** Chapter 4 breaks code continuity (uses pre-modernized copy). Mitigation is explicit callout at chapter start.

**Reviewer gates established:** Content (Morpheus), Technical (Tank), Prose (Switch), Cross-Chapter (Morpheus). All must pass before merge.

### 2026-05-21 — Scaffold Created with Scope Lock Updates

**Structural decisions implemented:**
- Created 4 chapter folders (`00-introduction/`, `01-assessment/`, `02-modernizing/`, `03-cloud/`) with meaningful README stubs (not placeholder text)
- Each chapter README includes: Title, What You'll Learn, Learning Outcome, Prerequisites, What's in This Chapter (6-8 detailed sections), What You'll Need, Navigation
- Folder naming convention: `0N-kebab-case-name/` for sequential chapter structure

**Scope lock changes incorporated:**
- **.NET 10 directly:** All chapters target .NET 10 preview SDK (no .NET 8/9 intermediate steps)
- **Continuity update:** Ch 2-3-4 now share the same evolving app (`shared-legacy-app/`). Only Ch 0 is standalone. This replaces the old "Ch 4 uses separate pre-modernized copy" plan.
- **Windows-only at launch:** Prerequisites explicitly state Win 11 + VS 2022 (no macOS/Linux/VS Code variants yet)

### 2026-05-28 — Platform Scope Corrected

**Update:** The GitHub Copilot app modernization extension runs in Visual Studio, VS Code, and GitHub.com — not VS-exclusive as initial docs implied. This course covers the Visual Studio workflow (Windows only). Cross-platform paths (VS Code and GitHub.com) are documented as available but not covered by this course. All references updated.

**Shared legacy app strategy:**
- Created `shared-legacy-app/` at repo root (ASP.NET MVC 5 + EF6 + .NET Framework 4.8)
- Ch 1 assesses it, Ch 2 modernizes it, Ch 3 deploys the modernized output
- Trinity owns this folder; chapters reference it via relative paths

**Content plan per chapter (implemented in README stubs):**
- **Ch 0:** Why modernize, decision framework (modernize vs. rewrite vs. retire), install extension, first assessment on standalone sample
- **Ch 1:** Assess shared app, read report (blockers/warnings/informational), generate upgrade plan, export plan
- **Ch 2:** Execute Act workflow, review diffs, accept/override suggestions, resolve compilation errors, validate .NET 10 app runs
- **Ch 3:** Cloud-migration workflow, review Azure resources provisioned, deploy to Azure, verify deployment, cleanup

**Learnings:**
- Chapter stubs must be opinionated and specific (6-8 numbered sections) — not generic placeholders. This gives future writers clear content boundaries.
- Continuity (Ch 2-3-4 sharing one app) required careful prerequisite chaining in each README.
- Navigation links at bottom of each README create clear forward/backward flow.
