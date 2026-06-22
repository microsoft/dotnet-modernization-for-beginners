# Dotnet Modernization for Beginners - Editorial and Product Plan

## 1) Why This Plan Exists
This course is strong, but it needs sharper differentiation.

Primary value proposition:
- We do not just run modernization.
- We teach people how to interpret assessment reports and upgrade plans as decision artifacts.

This plan turns your feedback into a practical v1 execution path plus a v2 CLI roadmap.

## 2) Research Summary (Current State)
Based on the current repository content:
- The root README positions the course clearly and already frames Assess -> Plan -> Act well.
- Chapter 00 is detailed and includes meaningful report interpretation.
- Chapters 01-03 contain substantial content, but some messaging and structure still read like implementation walkthroughs more than decision-making guidance.
- The root README still states Chapters 01-03 are skeletons, which is now stale and should be corrected.
- Mermaid diagrams are used heavily and some are likely fragile across renderers due to dense node labels and styling.
- Screenshot usage is high in Chapters 01-03 and can be reduced without losing learning outcomes.

## 3) Product Decisions for v1

### 3.1 Scope Boundary (v1)
In scope:
- Visual Studio-first guided workflow
- Single realistic sample app (BookCatalog)
- Deep interpretation of assessment and plan artifacts
- Execution walkthrough focused on key decisions, not every click

Out of scope:
- Multi-project orchestration at scale
- Full CLI-first workflow
- Large enterprise topology and governance variants

### 3.2 Core Positioning Statement
Teach learners how to decide, sequence, and de-risk modernization using report artifacts.

### 3.3 Naming and Terminology Changes
Current issue:
- "02-modernizing" sounds generic and may conflict with marketing language.

Proposed naming:
- New chapter title: "Upgrade Execution"
- Folder option (v1.1): keep folder name for stability, change display title now
- Folder option (later cleanup): rename folder to 03-execution and shift cloud chapter to 04-cloud

Recommendation for immediate v1:
- Change visible title now, defer physical folder rename until after release to avoid broken links and churn.

## 4) Information Architecture Changes

### 4.1 Separate Assessment and Plan
Current issue:
- Assessment and planning are blended in one chapter.

Proposed chapter flow:
1. 00 Introduction
2. 01 Assessment (read and interpret findings)
3. 02 Upgrade Planning (prioritization and execution strategy)
4. 03 Upgrade Execution (formerly Modernizing)
5. 04 Cloud Deployment

Minimal-change v1 path:
- Keep folders as-is for now.
- Split chapter content conceptually with distinct top-level sections and navigation links.
- Introduce explicit handoff artifact at each boundary:
  - Assessment output: report interpretation worksheet
  - Plan output: prioritized migration backlog and risk register

### 4.2 Reduce Step-by-Step Screenshots
Principle:
- Keep screenshots only when they prove an outcome or disambiguate UI state.

Target:
- Reduce screenshot count by 40-60% in Chapters 01-03.

Replace removed screenshots with:
- Short expected output blocks
- "What to verify" checklists
- One decision note per critical transition

## 5) Differentiation Strategy (Against Docs)

### 5.1 What Official Docs Already Do Well
- API-by-API migration guidance
- Platform-specific mechanical steps
- Reference architecture patterns

### 5.2 What This Course Must Do Better
- Explain report semantics and confidence limits
- Teach prioritization under time constraints
- Translate findings into staffing and sequencing decisions
- Show when to modernize, rewrite, or retire
- Capture risk and rollback strategy per phase

### 5.3 Required New Sections Per Chapter
Add a recurring section called "Decision Lens" with:
- What this artifact says
- What it does not say
- How to decide next action
- What to validate before proceeding

## 6) Deep Dive Plan: Reports and Plans (Primary Selling Point)

### 6.1 Assessment Report Deep Dive Module
Learning outcomes:
- Distinguish blocker, warning, informational categories in planning terms
- Map binary/source/behavioral findings to schedule risk
- Estimate effort with confidence bands, not exact promises

Deliverables to add:
- Report anatomy guide (one page)
- Severity-to-action matrix
- False-positive triage checklist
- "Top 10 findings that change timeline" examples

### 6.2 Upgrade Plan Deep Dive Module
Learning outcomes:
- Convert findings into an ordered backlog
- Define dependency-aware task sequencing
- Create stop/go gates between phases

Deliverables to add:
- Planning rubric (impact x effort x risk)
- Task decomposition template
- Exit criteria template for each phase
- Rollback and branch strategy template

### 6.3 Artifact-First Teaching Pattern
For every major phase:
- Start from artifact
- Explain interpretation
- Decide action
- Execute selectively
- Validate outcome

## 7) Mermaid Reliability Fix Plan
Likely causes of rendering failures:
- Overly long node labels
- Aggressive styling and class definitions
- Dense subgraphs and emojis in labels

Standard to adopt:
- Keep node labels short and plain
- Avoid custom class styling unless necessary
- Prefer simple flowchart TD/LR with few branches
- Keep each diagram focused on one concept

Acceptance criteria:
- Every Mermaid block renders in GitHub markdown preview and VS Code markdown preview.
- No diagram exceeds 12 nodes in v1.

## 8) Workstreams, Owners, and Dependencies

### Workstream A - Narrative and Positioning (Owner: Content Strategist)
Tasks:
- Reframe chapter intros around decision-making outcomes
- Add clear differentiator language in root README and chapter openers
Dependency:
- None

### Workstream B - Artifact Deep Dives (Owner: Technical Writer)
Tasks:
- Create assessment report anatomy + interpretation guidance
- Create upgrade planning rubric and templates
Dependency:
- A (messaging guardrails)

### Workstream C - Structure and Navigation (Owner: Content Architect)
Tasks:
- Separate assessment vs planning flow in navigation and chapter sections
- Rename chapter display title to Upgrade Execution
- Update stale "skeleton" note in root README
Dependency:
- A

### Workstream D - Visual and Diagram Hardening (Owner: Docs Engineer)
Tasks:
- Simplify all Mermaid diagrams to stable subset
- Remove nonessential step screenshots and replace with verification checklists
Dependency:
- C (final section boundaries)

### Workstream E - QA and Marketing Alignment (Owner: Editor/Reviewer)
Tasks:
- Terminology pass for consistency with marketing
- Link-check and render-check pass
- Beginner-readability pass
Dependency:
- A, B, C, D complete

## 9) Implementation Sequence (v1)
Week 1:
1. Finalize messaging and terminology (A)
2. Draft report and plan deep-dive content (B)

Week 2:
1. Update chapter structure and navigation (C)
2. Apply Mermaid hardening and screenshot reduction (D)

Week 3:
1. Full QA and marketing review (E)
2. Final signoff and publish

## 10) v2 Roadmap: CLI for Multi-Project Scale
Goal:
- Teach teams how to run the same method across multiple repositories/projects.

v2 additions:
- CLI-first modernization workflow
- Multi-project batching strategy
- Portfolio-level report aggregation
- Standardized plan templates for program management
- Basic automation patterns for repeated assessments

Do not add this to v1 content except:
- One short "What comes next" section linking to v2 roadmap.

## 11) Definition of Done for This Planning Cycle
This plan is complete when:
- Assessment and planning are clearly separated in learner flow.
- Chapter 02 display title is changed to Upgrade Execution.
- Report and plan artifact deep dives are present and substantive.
- Mermaid diagrams are verified in both GitHub and VS Code preview.
- Screenshot density is reduced and replaced with outcome-focused checks.
- Root README no longer claims Chapters 01-03 are skeletons.

## 12) Immediate Next Edit Set (Recommended)
1. Update root README messaging:
- Remove stale skeleton warning
- Introduce artifact-first value proposition in course overview

2. Update chapter headings and nav labels:
- "Modernizing" -> "Upgrade Execution"
- Make explicit split: Assessment outputs -> Planning outputs

3. Add two new reusable callout blocks:
- Decision Lens
- Artifact Breakdown

4. Run a Mermaid stabilization pass across all chapter README files.

5. Reduce screenshot count in Chapters 01-03 using the verification-checklist replacement pattern.

## 13) Execution Tracking
Execution status is tracked in `progress.md`.

Update cadence:
- Update `progress.md` after each completed workstream task.
- Log date, change summary, files touched, and validation notes.
- Keep a short "Next up" section so review is quick.

Status labels:
- Not started
- In progress
- Done
- Blocked
