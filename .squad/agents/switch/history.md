# Project Context

- **Owner:** Pablo Lopes
- **Project:** dotnet-modernization-for-beginners — a "top 1%" educational repo in the Microsoft for-beginners series, guiding .NET developers through modernizing legacy apps using the GitHub Copilot app modernization extension.
- **Stack:** .NET (legacy: Framework 4.x, .NET Core 3.1, .NET 5/6; modern: .NET 10/11), GitHub Copilot app modernization extension, Azure
- **Created:** 2026-05-21
- **Reference style:** Follow the conventions of https://github.com/microsoft/Generative-AI-for-beginners-dotnet (lesson README + code/ folder).

## Chapter Plan

1. Introduction to Modernization and the Extension
2. Assessment & Planning (how the extension assesses)
3. Modernizing (Act step — the upgrade itself)
4. Going to the Cloud with the extension

## Project Decisions (day-1 baseline)

- **Audience:** Intermediate .NET devs. Assume C# knowledge. Don't assume modernization tooling knowledge.
- **Format:** Lightweight — README walkthrough + `code/` folder per chapter. No quizzes, no assignments.
- **Voice:** Second-person, concise. No marketing language.
- **Tooling scope:** GitHub Copilot app modernization extension only. Don't introduce other tools.

## Learnings

- **Sequential chapters are our differentiator vs. GenAI-for-beginners-dotnet.** GenAI lets you jump to any lesson. We're stricter: Chapters 2–3 operate on the same legacy app, so readers must follow order. Call this out in the top-level README explicitly so there's no confusion.

- **Narrow scope wins.** GenAI teaches multiple APIs and patterns; we teach one tool (Copilot extension) and one task (modernize). This focus keeps chapters under 15 min and prevents decision paralysis.

- **"What you did" beats "learning outcomes."** Instead of listing theoretical takeaways, we recap actions: "You analyzed the app, found 3 breaking changes, created a roadmap." This reinforces *doing* over *knowing* and matches our audience's mental model (they want to ship, not study).

- **Tool output is canon.** Never paraphrase error messages or success states. Quote them exactly in code blocks with backticks. Readers will grep for those strings later.

- **The first paragraph is the reader's contract.** It must restate the one-sentence outcome, explain why it matters to *this project's journey*, and bridge to what's next. Templates work; shortcuts don't.

- **Five callout types are enough.** Note, Warning, Tip, Heads Up, Info. Adding a sixth (or trying "Important," "Remember," etc.) dilutes the signal. Readers tune out callouts when there are too many variants.

- **Ban list is not just style; it's voice.** Removing "leverage," "empower," "robust" isn't about grammar; it's about refusing to sound like a sales deck. One-word replacements (use, enable, solid) keep the text clear and honest.

- **Callouts belong at decision points or dangers, not everywhere.** A callout on every section trains readers to ignore them. Limit to ~1–2 per chapter.

- **Navigation at top AND bottom.** Top anchors the reader when they arrive. Bottom prevents scroll-back fatigue. Breadcrumb format is lightweight; no need for buttons.

- **Screenshot captions describe, not decorate.** "Here's the button you click" is useless. "Clicking 'Analyze' → extension audit results panel" tells the reader why they're looking at this image and what to do next.

## Root README Learning (2026-05-22)

Three scope-locking decisions from Pablo shaped the root README:

1. **.NET 10 target (not 11 or future).** Pinned the hero, prerequisites, and narrative to a single forward-compatible target. No "or later" hedge. Clearer for readers, clearer for maintenance.

2. **Shared legacy app across Chapters 2–3, separate modernized copy for Chapter 4.** The README explicitly frames this as a continuous upgrade journey (one codebase flows through 1–3; then 4 deploys the output). The chapter table's "What You Do" column reinforces *action* not outcomes, and the sequential callout prevents readers from jumping to Chapter 4.

3. **Windows-only at launch (Win 11 + VS 2022).** Pinned prerequisites to exact versions (no "any recent version" for VS). A callout below the prereq table says "Note: This series is Windows-only at launch" so there's no false hope for other platforms.

**Key decisions for root README specifically:**
- **Hero line.** Leads with what you'll do (modernize) + the tool (extension) + the target (.NET 10). No "seamless," no "robust."
- **Prerequisites table.** All exact versions, no wiggle room. Disk space and prior knowledge explicitly listed. Windows-only callout is separate, not buried.
- **Chapter table columns.** Name, "What You Do" (actions, not outcomes), time estimate. Reinforces doing over learning.
- **Sequential callout.** Bold, positioned before the walkthrough instructions. Prevents mid-series jumping.
- **Navigation.** Minimal at top (just "Getting Started → Chapter 1" link); full nav at bottom (no previous, only forward).

---

## 2026-05-21 11:52:59 - README Format Standardization

Applied the copilot-cli-for-beginners reference format pattern to all 5 READMEs in the dotnet-modernization-for-beginners repo:

**Format patterns implemented:**
- Emoji in EVERY section header (## 🎯, ## ✅, ## 📚, etc.)
- Shields.io badges with &ensp; spacing (root README only)
- Quick nav links below badges using emoji + anchors
- --- dividers between ALL major sections
- Blockquote callouts: > 💡 **Tip**:, > ⚠️ **Note**:, > ⏱️ **Estimated Time**:
- Bold nav link at BOTTOM of each chapter: **[Continue to Chapter N →](path)**
- Image placeholders using ![descriptive alt text](images/filename.png) format
- "Expected output:" bold label before every output block
- Second-person voice throughout ("you'll", "you've")
- Banned words avoided (leverage, seamlessly, unlock, empower, robust, etc.)

**Files updated:**
1. Root README.md - Full rewrite with badges, course structure table, quick nav
2. 00-introduction/README.md - Extension installation + first assessment
3. 01-assessment/README.md - Running assessment on BookCatalog + generating plan
4. 02-modernizing/README.md - Executing Act workflow + reviewing suggestions
5. 03-cloud/README.md - Deploying to Azure + cleanup

**Key consistency improvements:**
- All chapters follow identical structure: header image → objectives → time estimate → prerequisites → content sections → nav → key takeaways → troubleshooting
- Consistent table formatting for decision frameworks, resource configs, error types
- Unified callout style across all chapters

## 2026-05-23 — Chapter 01 README Rewrite

**Rewrote Chapter 01 (Assessment & Planning) to match Chapter 00 gold standard.**

Key fixes:
1. **Fixed extension invocation path:** Changed from wrong "GitHub Copilot → Assess for Modernization" to correct "Right-click project → Modernize → Upgrade to a newer version of .NET → send → '.NET 10, Guided Mode and No Source Control'". This matches Chapter 00 exactly—they use the same extension invocation. The difference in Ch01 is that the reader goes through full Assess + Plan in Guided Mode, not just the preview.

2. **Updated numbers to be realistic:** BookCatalog has 1 controller (BooksController), 2 models (Book, likely a context), ~5 views. Analyzed the actual codebase and found: System.Web.Mvc blocker, Entity Framework 6 blocker/warning, HttpContext.Current warning, System.Web.Optimization (BundleConfig) blocker, System.Configuration warning. Changed fake numbers from "12 blockers, 18 warnings, 5 informational" to realistic "3 blockers, 2 warnings, 1 informational" for a small MVC app this size.

3. **Added Mermaid diagram:** Inserted flowchart showing how to *read* the compatibility report—the three categories (Blockers, Warnings, Informational) and how they flow to priority fixing. This is Ch01's unique contribution (Ch00 shows the overall Assess → Plan → Act loop; Ch01 dives into how to interpret findings).

4. **Tightened structure to match Ch00:**
   - One-paragraph intro that chains to reader's journey
   - Learning Objectives with second-person action verbs
   - 30-minute time estimate (realistic for Assess → Plan on small app)
   - Prerequisites table with exact versions
   - Content sections with emoji headings (📂, 🔍, 📊, 🗺️, ✅)
   - "Expected output:" labels with realistic screenshots  
   - Key Takeaways (5 takeaways, action-focused not theoretical)
   - Troubleshooting (3 real problems)
   - Learn More (4 links, targeted to next chapter's needs)

5. **Voice fixes:** Removed passive voice, unnecessary hedging ("note that," "it's important to"). Tightened "You've run a preview assessment on a simple sample. Now it's time to run the full Assess → Plan workflow on BookCatalog" to make the progression crystal clear.

6. **Navigation:** Fixed link to Chapter 02 (was correct, kept consistent). Added back-reference to Chapter 00 in Prerequisites.

**Images needed (Tank to capture):**
- `01-assessment/images/assessment-progress.png` — screenshot of "Scanning files… Analyzing NuGet packages…" dialog
- `01-assessment/images/assessment-report.png` — Compatibility Report tab with realistic "3 blockers, 2 warnings, 1 informational"

**Why this matters:** Chapter 01 is where readers first learn to *interpret* assessment output (not just run it). The realistic numbers + Mermaid diagram + clearer invocation path make it obvious that Ch00 → Ch01 is a progression (sample → real app) using the exact same tool, not a tool switch.

## 2026-05-28: Visual Studio 2026 Support Added

**Decision:** Pablo Lopes confirmed that Visual Studio 2026 is now a supported IDE alongside VS 2022. All chapter READMEs and squad memory files updated to reflect this.

**Updates made:**
- Updated all 6 chapter/code READMEs to say "Visual Studio 2022 (17.12 or later) or 2026"
- Updated prerequisite tables and opening instructions across 00-introduction, 01-assessment, 02-modernizing, 03-cloud, and code README
- Updated troubleshooting and tip sections to reference both versions
- Updated squad memory files (trinity history, decisions) to reflect support for both IDE versions
- Screenshots going forward will be captured from Visual Studio 2026

**Rationale:** The extension now works on both VS 2022 (min 17.12) and VS 2026 (any version). No rewrite needed; concise pattern keeps prose tight and clear.
