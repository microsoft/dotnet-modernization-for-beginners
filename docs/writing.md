# Writing guide

Write short, direct English without changing technical meaning. Teach the next decision and action, not the entire architecture at once.

The subject is GitHub Copilot's .NET modernization tooling in Visual Studio. This isn't a general modernization-methodology workshop.

The optional [Copilot app route](../03-prerequisites/copilot-app.md) follows a recorded desktop-app workflow after Setup.
Keep it separate from the seven required chapters and their in-place rewrite.
Its side-by-side approach keeps EF6, a shared lab schema, and temporary compatibility routing.
The learner later revises the plan to retire the Framework host and finish with one .NET 10 app.
Desktop-app requests activate the built-in upgrade workflow, not Visual Studio's `@Modernize` entry point.
Start from the prompt box's Folder attachment, with Autopilot and Approve all tool permissions.
Keep assessment, planning, execution, and validation automatic. Don't add a required prompt between each stage.
Write the lesson for public learners, not for the person providing demonstration materials.
Keep recording history, screenshot provenance, and run-specific evidence in the linked example, not in the learner procedure.
Keep the upgrade request short. Use stage-specific steering prompts rather than repeating the migration specification.
Distinguish agent-reported completion from independently executed checks, including missing dashboard build records.

Use `asd-ste100` for clear actors, consistent terms, and precise conditions. Use `rewrite-matt-voice` for natural explanations, contractions, and functional headings.

Let the technical detail carry the interest. Don't invent an anecdote or tool response to make the writing lively.

## Teaching pattern

Each lesson needs a clear starting state, a useful change or decision, and observable exit evidence.

Explain the concept before the action that needs it. Keep its purpose, instructions, and expected result close together.

Introduce a technical term before its first use in a prompt or procedure.
Give a short definition where the learner needs it, not only in an optional reference.
For application components, name their BookCatalog responsibility instead of listing technologies.
Don't reteach assumed C# and MVC basics unless the next action needs a distinction.

Use **what, why, and how** as a reasoning check, not mandatory headings.

Keep one useful participation point near a tool action. Let learners read a report, review choices, add a requirement, or inspect a result.

Don't require a source-evidence table or questionnaire after every section. A copied prompt alone doesn't establish understanding.

Give learners a chance to decide, predict, inspect, or attempt a change before showing worked reasoning.

Keep the continuing BookCatalog project. Distinguish supplied helpers from learner application code and from product features.

Preserve standalone sample quickstarts. Do not make reference users complete the course merely to run an example.

## Required path and optional work

Keep all seven numbered chapters completable: Start here, introduction, Setup, assessment, planning, execution, and Azure planning.

The introduction explains the project and tool workflow. Setup checks existing tools before installation and finishes with running and exploring BookCatalog.

Use `03-prerequisites/README.md#check-before-installing` for readiness links and `03-prerequisites/README.md#run-bookcatalog` for the app shortcut. Adjust relative paths to the linking file.

The modernization agent writes the learner's assessment and plan. Copilot Chat is the interface, not the actor that writes these artifacts.

Explain why assessment matters: it identifies changes for the selected framework and gives the learner a report to share with their team or management.

Assessment edits are optional. Learners can keep an adequate report, edit it manually, or ask the modernization agent to add context.

Generate the plan immediately after the planning introduction. Then explain the generated choices and ask the learner to review them.

Start the planning prompt with `@Modernize create plan.md for .NET 10 migration`.
State the target, application scope, chosen approach, demo-data rules, and planning-only boundary.

Require an in-place ASP.NET Core MVC rewrite on .NET 10 with EF Core. Don't keep the old host, shared schema, YARP, or System.Web adapters.

Add one explicit plan requirement: add a book, edit it, restart the app, and confirm that the saved edit remains.

Execution ends with the learner's upgraded app passing that check. Azure planning stops before provisioning.

Treat `BookCatalogModernizedLab` as disposable demo data. Let EF Core rebuild the schema and seed it, recreating the database when needed.

Don't reset or replace records on every startup. Remove data-preservation gates from the core path, including backups, snapshots, source checks, and ID/date comparisons.

Keep [advanced checks](advanced-checks.md), [author filtering](author-filter.md), and the [workbook](learner-record.md) optional.

[Data transfer](data-transfer.md) is a standalone opt-in reference. Don't add its prerequisites to assessment, planning, execution, or deployment.

Start that exercise from its own untouched legacy clone. Don't assume the core learner copy retains its old configuration or records.

Keep warnings that apply to explicit imports in that reference. Don't change executable helper safeguards to simplify prose.

Optional deployment prepares EF Core schema and seeds, then tests new cloud records. Link the standalone transfer reference instead of adding snapshot branches.

Keep cost, public-access, credential, identity, resource-approval, and cleanup warnings visible.

## Rules for authors

1. State one instruction per sentence.
2. Name the actor in procedures.
3. Aim for at most 20 words per instruction where precision permits.
4. Keep descriptions within 25 words where practical.
5. Use one topic per paragraph.
6. Replace prose semicolons with separate sentences.
7. Use the same term for the same concept.
8. Preserve uncertainty, conditions, warnings, and scope limits.

Keep commands, identifiers, product names, and quoted output exact. Do not remove a safety condition to shorten a sentence.

Use strict structural rules for procedures and errors. Use approachable technical prose for explanations.

Use contractions where they read naturally. Keep humor occasional, and never let it weaken a warning or dismiss a difficult step.

Do not claim that a rewrite proves technical accuracy or official ASD-STE100 compliance.

## Terms used in this course

| Term | Meaning |
| --- | --- |
| Assessment | Findings about what must change for the selected framework |
| Requirement | A learner-owned condition the result must satisfy |
| Plan | Chosen actions, dependencies, order, and acceptance checks |
| Task specification | Instructions and acceptance conditions for a unit of planned work |
| Progress | Agent-updated execution state, which still needs evidence |
| Runnable group | Coupled changes with a stated runnable boundary |
| Checkpoint | Reviewed Git commit with its recorded checks |
| Compatibility | Whether source, binaries, or behavior work with a change |
| Business priority | Importance of the affected behavior to its users |
| Carry-forward record | One of two stable learner-created records selected for the optional data-transfer lab |
| Throwaway record | A separate record used for edits and destructive checks |
| Snapshot | Versioned export of selected source records and their stored values |
| Preview | Nonmutating inspection of the proposed selected-record copy |
| Apply | Explicit transactional selected-record import |
| Verify | Comparison of stored target values with the source snapshot |
| Managed identity | Azure identity the running application uses for supported service access |
| Core completion | Learner-confirmed outcomes for all seven numbered chapters, from Start here through Azure planning |

Do not use seed, copy, and schema migration as synonyms.

Use **modernization agent** for the actor and **Copilot Chat** for the interface. Both required journeys start through Visual Studio's Modernize experience.

Begin every pasted Visual Studio upgrade request with `@Modernize`. Name the open solution, selected UI action, and scope before the prompt.

Use a short request for the current stage, not a repeated specification of the entire upgrade.
The agent can inspect the project and choose implementation details within the reviewed requirements.
Don't prescribe package versions, code layout, or every rejected alternative unless the task needs that detail.

Save the chosen approach in the plan and scenario instructions.
Have learners inspect those files before asking the agent to execute the reviewed plan.
Execution prompts should refer to that plan rather than repeat it.
Keep approval boundaries explicit, including restrictions on application changes, commits, Azure access, and deployment where needed.

Recovery prompts can be more detailed.
Name the error or conflicting decision and the saved files that need correction.
Protect completed work and require review before execution resumes.
For optional deployment, retain the configuration names, identity requirements, schema and seed behavior that the supplied helpers require.
Don't remove a required contract merely to shorten a prompt.

Document actual artifact paths and purposes. Do not assume Azure and framework-upgrade state share a schema.

## Executable content

State the shell, directory, file, action, and expected result. This learner path uses Windows, Visual Studio 2026, and PowerShell.

Describe the SDK requirement as a stable .NET SDK 10 or later. The application target remains .NET 10.

Distinguish SDK selection from runtime availability. Keep the .NET 10 runtime components installed for local execution, even with a later SDK.

Use Windows paths in commands. Keep URL and Markdown link syntax valid.

Add native-command error checks when later steps depend on success. Distinguish an external command's exit code from a PowerShell cmdlet error.

Mark every placeholder and explain its replacement. Do not assume selected record IDs, issue counts, package patches, or promised failures.

Name a code fragment's insertion point. Say whether it is an example, focused edit, or complete replacement.

Never hide approval, cost, data, or destructive-action warnings inside optional explanation.

## Evidence and continuity

Offer the [learner record](learner-record.md) as an optional detailed workbook. Never make it a condition for continuing.

Keep commands for maintainers and actual execution records in [validation](validation.md).

Keep deeper demonstrations and review criteria in the optional [instructor companion](instructor-guide.md). Do not require instructor reading or a presentation.

Separate planned checks, source inspection, local execution, rendered-page review, live Azure results, and observed learner understanding.

Identify a recorded example's source commit, product version, stage, and artifact path. Label excerpt boundaries and redactions.

Keep recorded tool output exact. Don't rewrite a quotation to satisfy language checks or present instructor text as a real result.

A reference test does not validate a different learner-generated application. A date-only screenshot does not prove stored timestamp preservation.

Preserve public chapter routes and existing deep links. Keep compact compatibility anchors with links when moving sections to an optional reference.

Use direct canonical links for normal navigation. An old local anchor doesn't redirect to another document on its own.

Retain compatible completion marks when a lesson's outcome narrows. New Setup completion starts incomplete.
Start here also starts incomplete for existing readers. Don't award completion from an earlier reading mark.

If a required action genuinely changes, revise only the affected completion criterion. Preserve the learner's theme and valid resume destination.

Keep the existing era styles and Setup's concert-poster interlude. Artwork and optional routes don't change the seven-step completion count.
The Copilot app route has its own Autopilot flight-deck theme and seasonal scene.
Keep its SVG workflow and Setup's route-comparison diagram aligned with the actual control flow and final application checks.

## Language checks

The project uses [ASD-STE100-inspired guidance](https://github.com/danyuchn/asd-ste100-skill). The included linter checks structural patterns, not the official ASD dictionary.

The vendor copy comes from commit `7d4a135a199a5d7447c4886bcd7ffe742a627bc9`. Its MIT license remains in `tools\vendor\STE-LICENSE`.

The wrapper excludes code, historical records, and third-party notices. It treats table cells separately.

Include Setup and new authored optional pages in the wrapper's file list. Preserve quoted technical outputs during review.

From the repository root, use `npm run test:language`. On Windows, a direct check is:

```powershell
py -3 -B tools\check-language.py
if ($LASTEXITCODE -ne 0) { throw "Review the language findings." }
```

Review each finding in context. For example, deleting a database and removing a package are different operations.

Passing a structural check does not establish teaching quality. Reread the complete learner sequence after edits.
