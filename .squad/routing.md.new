# Work Routing

How to decide who handles what for `dotnet-modernization-for-beginners`.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Chapter scope, structure, sequencing | 🏗️ Morpheus | "Does Chapter 2 need its own sample?", "Cut this section from Chapter 3" |
| Final approval / reviewer gate | 🏗️ Morpheus | Sign-off before a chapter is considered done |
| Legacy "before" app design and code | 🔧 Trinity | Build the shared legacy app for Chapters 2–3 |
| Running the modernization extension | 🔧 Trinity | Capture assess/plan/act output, record extension prompts |
| Modernized "after" code samples | 🔧 Trinity | Code samples for Chapters 1, 2, 3 |
| Chapter README prose | 📝 Switch | Walkthrough text, callouts, navigation, voice consistency |
| Top-level repo README | 📝 Switch | Series overview, prerequisites, how to use |
| Voice / style consistency | 📝 Switch | Cross-chapter editing, headings, scan-ability |
| Chapter 4 sample (cloud) | ☁️ Niobe | Separate self-contained sample for the cloud chapter |
| Azure / cloud-migration walkthrough | ☁️ Niobe | Following the extension's default flow, capturing prompts |
| Cleanup / cost guidance | ☁️ Niobe | Ensuring readers can get back to zero cost |
| Sample reproducibility / smoke tests | 🧪 Tank | Run every command, verify on fresh environment |
| Prerequisites validation | 🧪 Tank | What does the reader actually need installed? |
| Session logging | 📋 Scribe | Automatic — never needs routing |
| Work queue monitoring | 🔄 Ralph | Issue triage loop, backlog tracking |
| Async issue work (well-defined tasks) | @copilot 🤖 | Only if @copilot is added to the team later |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | 🏗️ Morpheus |
| `squad:morpheus` | Scope / structural / review work | 🏗️ Morpheus |
| `squad:trinity` | Legacy app + modernization sample work | 🔧 Trinity |
| `squad:switch` | Prose / README / writing work | 📝 Switch |
| `squad:niobe` | Cloud / Chapter 4 work | ☁️ Niobe |
| `squad:tank` | Verification / reproducibility / testing work | 🧪 Tank |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, **Morpheus** triages it — assigning the right `squad:{member}` label.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by swapping labels.
4. The `squad` label is the "inbox" — untriaged issues waiting for Lead review.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work (e.g., Switch drafting a chapter README while Trinity is still capturing extension output).
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "where's the legacy app?"
4. **"Team, …" → fan-out.** Spawn all relevant agents in parallel.
5. **Reviewer rejection lockout** — if Morpheus or Tank rejects work, a *different* agent revises. Original author is locked out for that revision cycle.
6. **Anticipate downstream work.** Trinity finishing a sample → Tank should run it. Trinity capturing extension output → Switch can start the prose around it.
7. **Cross-chapter changes** — anything touching multiple chapters routes through Morpheus first for sequencing impact.
