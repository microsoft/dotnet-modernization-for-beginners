# Squad Decisions

## Initial Project Plan (2026-05-21)

**Status:** Proposed — awaiting Pablo Lopes approval  
**Prepared by:** Morpheus, Trinity, Switch, Niobe, Tank (team planning session)  
**Session:** Initial project planning fan-out

---

### Top 1% Criteria & Definition

A guide earns "top 1%" status when a reader can verify ALL of the following:

| # | Criterion | Test |
|---|-----------|------|
| 1 | **Time-to-first-success ≤ 20 minutes** | Reader runs the extension's assessment on the sample app within 20 minutes of cloning the repo (including prereq install). |
| 2 | **100% reproducibility on stated prereqs** | Every step works on a clean machine with documented prerequisites. No "works on my machine." Tank tests every merge on fresh VMs. |
| 3 | **One learning outcome per chapter, stated up front** | Each chapter opens with a single sentence: "By the end, you will be able to ___." If we can't write that, the chapter isn't ready. |
| 4 | **Concept-before-tool** | Every tool action is preceded by a "why" paragraph. No button-tour content without explaining underlying decisions. |
| 5 | **Prerequisites honesty** | We list EXACT versions, disk space, and "you should already know" bullets. We don't say "some .NET experience" — we say what specific skills are assumed. |

**Differentiation:** We show the happy path, name sharp edges, and tell readers what we're NOT covering so they don't waste time looking for it.

---

### 4-Chapter Arc

#### Chapter 1: Introduction to Modernization and the Extension

| Element | Content |
|---------|---------|
| **Learning Outcome** | The reader will be able to explain WHY modernization matters (security, support, performance, ecosystem) and install the GitHub Copilot app modernization extension ready for use. |
| **Sets Up Next Chapter** | Reader has the extension installed; knows the three-phase mental model (Assess → Plan → Modernize); is primed to run an assessment. |
| **Out of Scope** | No actual assessment run (that's Chapter 2). No code changes. No CLI tools. No history of every .NET version. |
| **Decision the Reader Makes** | "Is modernization the right move for my codebase, or should I rewrite/retire?" |

#### Chapter 2: Assessment & Planning

| Element | Content |
|---------|---------|
| **Learning Outcome** | The reader will be able to run the extension's assessment on a legacy app, interpret the findings, and articulate a prioritized upgrade plan. |
| **Sets Up Next Chapter** | Reader has an assessment report; understands which issues are blockers vs. noise; has a mental model for attack order. |
| **Out of Scope** | No code changes yet. No manual fixes. No Azure. No AppCAT/upgrade-assistant comparisons. |
| **Decision the Reader Makes** | "Which issues do I tackle first, and which do I accept as tech debt?" |

#### Chapter 3: Modernizing — The Upgrade Itself

| Element | Content |
|---------|---------|
| **Learning Outcome** | The reader will be able to execute the extension's modernization workflow to upgrade the shared legacy app to .NET 10+, resolving blockers identified in Chapter 2. |
| **Sets Up Next Chapter** | App compiles and runs on modern .NET; reader understands the diff; ready to consider cloud deployment. |
| **Out of Scope** | No cloud migration (that's Chapter 4). No deep-dive into every NuGet replacement. No multi-project orchestration (single-project sample). |
| **Decision the Reader Makes** | "Do I accept the extension's suggested fixes, or do I override?" |

#### Chapter 4: Going to the Cloud

| Element | Content |
|---------|---------|
| **Learning Outcome** | The reader will be able to use the extension's cloud-migration flow to deploy the modernized app to Azure (following the tool's default target). |
| **Sets Up Next Chapter** | N/A — final chapter. Reader has a deployed app and understands the full modernization lifecycle. |
| **Out of Scope** | No custom Azure architectures. No Kubernetes. No multi-region. No cost optimization deep-dives. We follow the extension's default path. |
| **Decision the Reader Makes** | "Is the extension's default Azure target right for my workload, or do I need to diverge?" |

**Named Weakness:** Chapter 4 uses a different code artifact than Chapters 2–3 (pre-modernized copy vs. upgraded-in-place). This is intentional (isolation from code issues) but could confuse readers. Mitigation: Chapter 4 opens with a callout explaining the separation.

---

### Repo Structure

```
dotnet-modernization-for-beginners/
├── README.md                    # Repo overview, prereqs, "start here"
├── 00-introduction/
│   ├── README.md                # Chapter 1 walkthrough
│   └── code/                    # Minimal sample (if any)
├── 01-assessment/
│   ├── README.md                # Chapter 2 walkthrough
│   └── code/ → ../shared-legacy-app/
├── 02-modernize/
│   ├── README.md                # Chapter 3 walkthrough
│   └── code/ → ../shared-legacy-app/
├── 03-cloud/
│   ├── README.md                # Chapter 4 walkthrough
│   └── code/                    # Self-contained modernized app ready for deploy
├── shared-legacy-app/           # The "before" app (Chapters 2 & 3 share this)
│   ├── src/
│   └── README.md                # "This is the legacy app. Don't modify it directly."
└── .squad/                      # Team coordination (not reader-facing)
```

**Key decision:** `shared-legacy-app/` lives at repo root. Chapters 2–3 reference it. Chapter 4 uses a separate, pre-modernized copy.

---

### Legacy App Archetype

**Selected: ASP.NET MVC 5 + Entity Framework 6 on .NET Framework 4.8**

**Candidates evaluated:**
- Candidate A (MVC 5 + EF6) — ✅ **CHOSEN** — most common legacy shape, direct migration path, extension-supported, real-world relevance
- Candidate B (Console + EF Core on .NET 5) — ❌ Too modern; limited teaching moments; no UI for verification
- Candidate C (Multi-project solution) — ❌ Too complex; violates 20-minute first-success target

**Why Candidate A:**
1. Extension parity: The Copilot extension is purpose-built for this stack
2. Pedagogical clarity: Readers see largest conceptual gaps (ViewBag → VMs, ConfigurationManager → IConfiguration, HttpContext.Current → DI)
3. Time-to-first-success: Small enough (~8–12 files) to run assessment within 15 minutes
4. Real-world weight: Every enterprise .NET shop has a MVC 5 + EF6 web app gathering dust
5. Reproducibility: Windows + Visual Studio 2022 is standard; extension handles the flow

**Sample shape:**
- One MVC project targeting .NET Framework 4.8
- Web.config with dev/prod transforms
- 2–3 controllers, Models folder with EDMX designer model, Views with Razor v2
- LocalDB (no external SQL Server dependency)
- Size: ~8–12 files, ~2K LOC
- Blockers: 1 (EF6 → EF Core)
- Warnings: 2–3 (Framework 4.8 EOL, obsolete packages, HttpClient patterns)

---

### Technical Strategy

#### Version Pinning Policy

| Artifact | Pinning | Rationale |
|----------|---------|-----------|
| **.NET SDK** | Minimum + tested on exact (e.g., 8.0.100) in `global.json` | Extension behavior can vary with SDK; exact pins ensure reproducibility |
| **NuGet packages** | Exact MAJOR.MINOR in `Directory.Packages.props` or `.csproj` | Allow PATCH auto-bump; lock MAJOR.MINOR to avoid surprise breaking changes |
| **GitHub Copilot extension** | Version badge in Repo README + per-chapter README (e.g., "Tested on v0.2.5") | Cloud-migration flow may change between extension versions |
| **Visual Studio** | Minimum version (e.g., v17.8) in Repo README | IDE features evolve; document minimum known-good version |
| **Target .NET after modernization** | .NET 10 if stable; .NET 8 LTS if .NET 10 slip (OPEN QUESTION for Pablo) | Balance forward-compatibility with stability |

#### Extension UX Moments per Chapter

**Chapter 1:** Marketplace page, installation confirmation, extension sidebar, welcome screen/tutorial prompt

**Chapter 2:** Project selection flow, assessment scanning progress, compatibility report panel, blocker list with justification, warning categorization, plan export/summary

**Chapter 3:** Modernization start action, first suggestion panel with old/new code, code diff view with line-by-line highlights, reader decision gate (Accept/Review/Skip), multiple suggestions in sequence, compilation check per batch, success screen

#### Non-Negotiable Visual Artifacts

**Chapter 1:** Marketplace page, IDE after installation, extension welcome screen, extension active badge

**Chapter 2:** Full compatibility report panel, blocker detail (EF6 example), warning detail (Framework 4.8 example), prioritized action list, plan summary export

**Chapter 3:** First modernization suggestion panel, zoomed diff view, "Show alternatives" flow, batch compilation check, success screen, (bonus) modified file in editor

**Global:** Terminal showing prerequisite check, sample app structure in Solution Explorer

#### Technical Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Extension UI changes mid-project** | Screenshots stale; steps reference missing UI | MEDIUM | Pin extension version; 48-hour re-test on new release; re-capture screenshots if needed |
| **Shared legacy app scope creep** | Sample becomes too complex; 20-min target fails | LOW | Finalize sample before writing Chapters 2–3; Morpheus guards scope |
| **.NET 10 release slip** | Guide targets wrong runtime | MEDIUM | Start with .NET 8 LTS; note .NET 10+ forward-compatible; adjust target per timeline |
| **Extension Windows-only** | macOS/Linux developers can't follow | MEDIUM | Document "Tested on Windows + VS 2022; VS Code support pending"; re-run if VS Code arrives |
| **LocalDB issues** | Reader can't open sample | LOW | Provide setup script; document fallback to SQL Server Express |
| **NuGet packages disappear** | Broken restore | LOW | Pin to stable widely-used versions; document alternatives if delisted |
| **Assessment output differs from plan** | Chapter 2 description won't match reader's screen | MEDIUM-HIGH | Validate extension behavior before locking Chapter 2; adjust if needed |

---

### Writing Strategy

#### Top-Level README Structure

```markdown
# .NET Modernization for Beginners
## Upgrade legacy .NET apps to modern versions using GitHub Copilot

### Hero Section
- What this is, Who it's for, Time to complete (~2–3 hours total)

### Prerequisites (High-Level)
- .NET 8+ SDK, IDE (VS 2022 or VS Code), GitHub account + Copilot subscription, basic C#

### Quick Start
- Fork/clone, navigate to Chapter 1, follow READMEs in sequence

### The 4-Chapter Journey
[Table: Chapter #, Title, What You'll Do, Time]

### How to Use This Series
- Work chapters in order (2–3 operate on same sample app)

### How to Contribute
- PRs for code, clarity, new patterns, translations

### License, Part of for-beginners Family, Getting Help
```

#### Per-Chapter README Template

```markdown
# Chapter [#]: [TITLE]

> **You'll finish when:** [ONE-SENTENCE OUTCOME]

---

## What You'll Learn
- [Skill #1 — verb form]
- [Skill #2]
- [Skill #3]

## Prerequisites
- [Prerequisite #1]
- [Prerequisite #2]

## Walkthrough

### [Section A Title]
[2–3 short paragraphs + screenshot/code block if applicable]

### [Section B Title]
[Repeat pattern]

---

## What You Just Did
[Recap: 2–3 sentences. Reader should feel "I did X, which means Y is now true."]

## Next Steps
Move to **[Chapter +1]** to [continue the journey].

## Troubleshooting

### Error: `[Error Message]`
[Brief explanation and fix.]

## Learn More
- [Link #1]
- [Link #2]
- [Link #3]

## Code
Complete working code samples live in the `code/` folder. See [README](./code/README.md) for how to run them.
```

#### Voice Rules

- **Second-person only:** "You fork the repo" — never "Developers fork"
- **One action per sentence:** ❌ "Install, verify, and open." ✅ "Install. Verify. Open."
- **Ban list (25 words):** leverage, seamlessly, unlock, empower, robust, cutting-edge, in order to, the following, Note that, It's important to, essentially, basically, + others
- **Three-adjective rule:** Cut to one adjective max
- **Never paraphrase tool output:** Quote exactly in code blocks
- **Code block intro:** Colon, never "the following code"
- **Screenshots:** Always caption descriptively (not cute): `![Screenshot: [action] → [what you see]](path)`
- **Keyboard / Menu / Path formatting:** `Ctrl+Shift+P`, **File > New > Project**, `src\Models\User.cs`
- **Error sidebars:** Use only 5 standardized callout types (Note, Warning, Tip, Heads Up, Info)

#### Callout Vocabulary (Standardized)

| Type | Use When | Example |
|------|----------|---------|
| **Note:** | Helpful context; not blocking | Extension auto-detects .NET versions above 3.1. |
| **Warning:** | Risk of breakage or data loss | Do not modify the app while the extension is scanning. |
| **Tip:** | Shortcut or pro move | Press `Ctrl+Shift+P` to open the command palette. |
| **Heads up:** | Surprising but not dangerous | Extension rewrites your `csproj` file. |
| **Info:** | Optional context or tangent | Want a deep dive? See [this Learn module](link). |

#### Navigation Strategy

**Position:** Top and bottom of each chapter README

**Format:** Breadcrumb + Previous / Next

```markdown
---
**← [01 Introduction](../01-intro/README.md) | [02 Assessment](../02-assessment/README.md) →**
---
```

**Special cases:**
- **Chapter 1:** No "Previous" link (entry point)
- **Chapter 4:** No "Next" link; offer a closing pointer ("Share your work with #dotnet-beginners")

#### For-Beginners Series Alignment

**What we're copying:**
1. Top-level README: hero + prerequisites + chapter table + links to family
2. Lesson folder naming: `01-name`, `02-name` (not `chapter-1`, not `lesson_1`)
3. Companion `code/` folder per lesson (not central `samples/`)
4. Short, actionable chapter READMEs (10–15 min to read and execute)
5. Badge links to for-beginners family

**What we're doing differently:**
1. **Sequential, not modular:** Can't skip to Chapter 4; Chapters 2–3 operate on same app
2. **Narrower scope:** Exactly one tool, one task (Copilot extension, .NET modernization)
3. **"What you did" recap instead of "Learning outcomes":** Action-oriented, not theory-oriented
4. **Hands-on-first, theory-light:** Almost pure walkthrough; theory in "Learn More" links

---

### Chapter 4: Cloud Deployment

#### Sample App

**Shape:** Separate from Chapters 2–3 (pre-modernized ASP.NET Core Razor Pages + EF Core on .NET 10)

**Why separate:** Chapters 2–3 readers upgrade a shared legacy app in-place. Chapter 4 readers need a clean, already-modern app so they can focus on cloud deployment, not code fixes. Isolation prevents "but my app is broken from Chapter 3" tangents.

**Minimum viable:** 1 web project, 1 LocalDB/SQLite, Home page, Product listing page (reads DB via EF Core), Add product form (model binding, POST, redirect), Contact page (form without persistence), ~6–8 Razor pages, ~1K–1.5K LOC. Deployable to Azure App Service or Container Apps.

#### "Follow the Tool" Plan

**Extension cloud-migration flow (assumed 5-phase journey):**

1. **Project Selection & Azure Sign-In** (~3–5 min): Reader selects project, signs in to Azure via GitHub OAuth
2. **Resource Configuration** (~3–5 min): Extension prompts for app name, region (default: East US), tier (default: Free), database (default: Yes; Azure SQL), Key Vault (default: No for beginners), App Insights (default: No)
3. **Resource Creation** (~5–10 min): Extension creates resource group, App Service plan, web app, Azure SQL database (if selected) with progress indicators
4. **Code Deployment** (~3–5 min): Extension compiles (`dotnet publish`), uploads, deploys to Azure, injects connection string
5. **Verification & Live URL** (~2–3 min): Extension displays live app URL; reader opens in browser; verifies database works

**Recommended defaults:** Free tier, East US region, Azure SQL Database, no Key Vault, no App Insights

**⚠️ Confidence caveat:** Extension cloud-migration flow needs live validation before Chapter 4 is finalized. Niobe flagged this as TBD.

#### Chapter 4 Prerequisites

**New (beyond Chapters 1–3):**
- Azure subscription with free tier available ($200 free credits recommended)
- Azure CLI (optional but recommended for troubleshooting; v2.60+)

**Hardware/Network:**
- Internet connection (required for Azure APIs)
- ~500 MB disk space (app build + Azure CLI)
- ~5 minutes uninterrupted time

#### Cleanup Section

**Goal:** Reader gets back to zero Azure cost in <5 minutes without orphaned resources.

**Steps:**
1. Identify resource group (via Azure Portal or `az group list`)
2. Delete resource group (via Portal "Delete resource group" or `az group delete --name rg-{name} --yes --no-wait`)
3. Verify cleanup (via Portal Cost Management or `az group exists`)
4. (Optional) Revoke extension's Azure access at github.com/settings/applications

**Cleanup automation:** Provide `cleanup-azure.ps1` script in Chapter 4 `code/` folder

#### Out-of-Scope Boundaries

**Explicitly NOT covered (with pointers to Learn More):**
- Custom domains & SSL certificates
- Advanced identity (Azure AD, OAuth2, 2FA)
- CI/CD pipelines (GitHub Actions, Azure Pipelines)
- Multi-region, HA, disaster recovery
- Cost optimization deep-dives
- Kubernetes or advanced orchestration

#### Cost Honesty

**Upfront transparency section in Chapter 4 README:**

```markdown
## Cost Expectations

Free tier (no payment method required): $0/month for 30-day deployment
- App Service (Free tier): $0 (1 GB memory, 1 shared core)
- Azure SQL Database (Free tier): $0 for first 12 months
- Total: **$0** (covered by free credits)

If you exceed free tier or after free credits expire:
- App Service (Basic tier, B1): $12–15/month
- Azure SQL Database (basic tier, S0): $15–20/month
- Total: **~$25–35/month**

Why it's safe: Free tier is quota-protected (can't accidentally overspend on free tier). Cleanup is mandatory and straightforward. 30-day rule: if you complete and delete immediately, you pay $0.
```

#### Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Extension cloud flow unstable/incomplete** | Deployment hangs or fails; reproducibility breaks | MEDIUM | Tank + Niobe full end-to-end test before publication; fallback plan (manual Azure deployment via Portal/CLI) |
| **Reader has no free credits** | Surprise $25 bill after Chapter 4 | LOW | Explicit prerequisite to create new free subscription; Warning callout about paid subscriptions |
| **Deployment succeeds but app doesn't work** | 404, 500, database connection errors | MEDIUM | Validation steps after deploy (click Products page to verify DB); troubleshooting checklist (connection string injection, static file publish, migrations) |
| **Reader forgets to clean up** | Surprise bill 30 days later | MEDIUM | Mandatory cleanup checklist at end of chapter; sticky reminder after each success; make cleanup prominent (not buried at bottom) |
| **Chapter 4 sample too complex or too simple** | Time budget blows or lesson feels toy-ish | LOW | Agreed shape (1 project, 1 DB, 6–8 pages, ~1.5K LOC); Tank deploys and times it (target: 15–25 min); if too complex, Trinity trims; if too simple, Trinity adds one feature |

---

### QA & Reproducibility Strategy

#### "Top 1%" Reproducibility Criteria (Testable)

1. **First-Success Time:** Every reader who starts on stated prerequisites (OS + .NET 8 SDK + IDE) and follows README without improvisation reaches outcome within documented time budget (±20%) on first attempt, on both Windows and macOS.

2. **Zero Assumed Prerequisites:** Every prerequisite needed to complete is listed in Prerequisites section or is a prereq of a listed item (no surprise installs mid-chapter).

3. **Exact Reproducibility — No Improvisation:** If reader copies every command exactly as written with listed prerequisites, command either (a) runs successfully, or (b) produces documented error with documented workaround.

4. **Cross-Platform Parity:** Chapter works identically on Windows + VS 2022 and macOS + VS Code, with no hidden OS-specific caveats (all called out with "On Windows:" or "On macOS:" labels).

5. **Screenshot Authenticity:** Every screenshot was captured from described code/tool (not stock images, not outdated UIs). Captions are precise and descriptive.

#### Prerequisites Validation Matrix

| Prerequisite | Where Called Out | How Reader Confirms | Validated By | Re-eval Trigger |
|---|---|---|---|---|
| **Windows 10/11 OR macOS 12+ OR Ubuntu 22.04 LTS** | Repo README + per-chapter | `systeminfo` (Windows), `system_profiler` (macOS), `lsb_release` (Linux) | Tank on each OS | Per quarter or OS patch release |
| **.NET 8.0 SDK minimum** | Repo README + Ch 1 README | `dotnet --version` and `dotnet --list-sdks` | Tank | Per SDK patch |
| **.NET 10 SDK** | Ch 4 README | `dotnet --list-sdks` | Tank (Ch 4 only) | Per SDK patch |
| **Visual Studio 2022 (v17.8+) OR VS Code (1.90+)** | Repo README + per-chapter | VS: `Help > About`, VS Code: `Help > About` | Tank | Per major version bump |
| **GitHub Copilot extension** | Ch 1 README | Check extension version in VS/VS Code Extensions view | Tank | After every extension release (48-hr re-test) |
| **GitHub account + Copilot subscription** | Repo README hero | `gh auth status` or visit github.com/settings/copilot | Reader (smoke test notes it) | User-dependent |
| **Git (2.30+)** | Repo README | `git --version` | Tank | Per git patch release |
| **Azure account (Ch 4)** | Ch 4 README | `az account show` | Tank (Ch 4 only) | Per Azure policy change |
| **8 GB RAM minimum** | Repo README hero | Task Manager / Activity Monitor / `free -h` | Tank (noted, not verified each test) | Once at baseline |
| **10 GB free disk** | Repo README hero | `dir C: /s` / `df -h` / `df -h /` | Tank (noted, not verified each test) | Once at baseline |

#### Per-Chapter Acceptance Gate (20-Item Checklist)

**A chapter is NOT approved for merge until ALL pass:**

**A. Code & Build (6 items):**
- [ ] Sample app builds without warnings on .NET 8+
- [ ] Sample app runs with documented output
- [ ] All file paths in README resolve correctly
- [ ] All code blocks are syntactically valid
- [ ] No hardcoded secrets (API keys, connection strings, PII)
- [ ] `global.json` exists at repo root with .NET 8.0 minimum

**B. Prerequisites & Environment (5 items):**
- [ ] Every prerequisite tested on fresh machine (Windows 11, macOS, Ubuntu)
- [ ] Version-check command works as written
- [ ] Every "If you don't have it" link is live and valid (no 404s)
- [ ] Extension version (if applicable) documented in badge
- [ ] Azure prerequisites include cost estimates

**C. README Walkthrough (5 items):**
- [ ] Every command runs successfully without modification
- [ ] Every screenshot matches current extension version & UI
- [ ] Every UI path is exact (not vague "go to menu")
- [ ] No implicit steps (Tank can't add steps Tank has to infer)
- [ ] All inline code, file paths use correct syntax

**D. Structure & Navigation (4 items):**
- [ ] Clear, single learning outcome in hero paragraph
- [ ] Navigation links at top and bottom (← Prev | Next →)
- [ ] "What you'll learn" section has actionable verbs
- [ ] "What you just did" recap summarizes outcome, not contents

**E. Testing & Smoke Pass (5 items):**
- [ ] Full smoke test on Windows 11 + VS 2022 (end-to-end)
- [ ] Full smoke test on macOS + VS Code (end-to-end)
- [ ] Cleanup steps return environment to baseline
- [ ] Time-to-first-success within budget ±20%
- [ ] All troubleshooting steps verified to actually solve named error

**F. Prose & Consistency (4 items):**
- [ ] No banned words present
- [ ] All callouts use 5 standardized types, used sparingly
- [ ] Second-person voice throughout
- [ ] All error messages quoted exactly (no paraphrasing)

**G. Handoff & Continuity (3 items):**
- [ ] Chapter output state matches next chapter's input assumptions
- [ ] Shared legacy app not modified in ways that break next chapter
- [ ] No content duplication (if content needed in both, link to one source)

#### Smoke Test Protocol

**Test Matrix:**
| Environment | OS | IDE | Extension | .NET SDK | Frequency |
|---|---|---|---|---|---|
| Primary | Windows 11 (latest) | VS 2022 v17.11+ | Latest | 8.0+, 10.0+ (Ch 4) | Every chapter; before merge |
| Secondary | macOS 14+ | VS Code 1.95+ | Latest | 8.0+, 10.0+ (Ch 4) | Every chapter; before merge |
| Tertiary (if resources) | Ubuntu 22.04 LTS | VS Code 1.95+ | Latest | 8.0+, 10.0+ (Ch 4) | Spot-check quarterly |

**Smoke test runbook:**
1. Provision clean machine (install only prerequisites listed in chapter README)
2. Record state: OS build, SDK versions, IDE version, extension version
3. Clone repo: `git clone ... && cd dotnet-modernization-for-beginners`
4. Follow every step in README exactly (copy-paste, no shortcuts)
5. For each command: compare actual output to expected output in README
6. For each UI action: take screenshot, compare to README description
7. At end: run cleanup, verify environment is "clean"
8. Record total time (must be within chapter budget ±20%)
9. If smoke test fails: document exact step, expected vs. actual, and file ticket

**Failure handling:** Tank does NOT fix failures. Tank documents blocker, assigns to owner (Trinity/Switch/Morpheus/Niobe), chapter remains blocked until re-test passes.

---

### Hard Scope Cuts (Explicit Refusals)

| Cut | Why |
|-----|-----|
| **No quizzes or assignments** | Pablo signed off on lightweight format. Quizzes add maintenance burden; don't fit "get running fast" ethos. |
| **No upgrade-assistant CLI** | Tooling scope: extension-only. CLI is different workflow, different audience. Brief mention OK; using it is out. |
| **No multi-project/solution samples** | One project keeps sample debuggable in 20 minutes. Multi-project is advanced content for follow-up guide. |
| **No .NET version history deep-dive** | Two-sentence mention in Chapter 1. Link to official docs for curious. |
| **No AppCAT or try-convert tooling** | Surveying ecosystem contradicts "teach ONE tool well" mandate. |
| **No custom Azure architectures, Kubernetes, multi-region** | Follow extension's default path. Advanced deployment is post-guide learning. |
| **No custom domains, advanced identity, CI/CD, cost optimization** | Out-of-scope for Chapter 4. Provide "Learn More" pointers for each. |

---

### Reviewer Gates — Merge Criteria

**Content Gates (Morpheus):**
- Single learning outcome stated in first paragraph
- No "tool tour" — every action has preceding "why"
- Out-of-scope section present and sharp
- Decision reader makes is explicit
- Prerequisites are exact

**Technical Gates (Tank):**
- All commands run on clean Windows 11 + VS 2022 machine
- All commands run on clean macOS + VS Code machine
- Sample code compiles and runs
- Extension version pinned or range documented
- No broken links

**Prose Gates (Switch):**
- Tone matches Microsoft Learn style (second person, active voice)
- No jargon without definition on first use
- Callouts (NOTE, TIP, WARNING) used sparingly and correctly

**Cross-Chapter Gates (Morpheus):**
- Handoff to next chapter is explicit
- No content duplicated across chapters
- Shared legacy app state consistent with chapter expectations

---

### Open Questions for Pablo

1. **Target .NET version:** Is .NET 10 stable enough by launch, or should we target .NET 8 LTS and note .NET 10 as forward-compatible?
2. **Extension version pinning:** Do you have a release schedule from the extension team? Can we coordinate?
3. **macOS parity:** Is VS Code on macOS a hard requirement, or "best effort"? (Tank needs to know for testing matrix.)

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
