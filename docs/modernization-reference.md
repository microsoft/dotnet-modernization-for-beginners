# Using this workshop as a .NET modernization reference

This page helps people and coding agents use the workshop as source material for another application's modernization.
You don't need to complete the course to use it as a reference.
This optional page doesn't count toward course completion.

The workshop teaches GitHub Copilot's .NET modernization tooling in Visual Studio.
It follows BookCatalog from .NET Framework 4.8 and ASP.NET MVC 5 to .NET 10, ASP.NET Core MVC, and EF Core.
It then covers Azure assessment and planning, without deployment.
It isn't a general modernization methodology or a supported autonomous workflow for every coding agent.

## Find the relevant source

The chapter Markdown is the source for both the repository and the course website.
Follow the topic links below instead of treating this page as a second set of executable instructions.

| Topic | Source | Use it for |
| --- | --- | --- |
| Scope and learning path | [Course overview](../README.md) | Decide whether the workshop fits the user's question |
| Tools and environment | [Setup](../03-prerequisites/README.md) | Check Windows, Visual Studio, SDK, runtime, and LocalDB requirements |
| Compatibility assessment | [Assess BookCatalog](../04-assessment/README.md) | Read findings, inspect affected code, and add application requirements |
| Upgrade choices | [Choose the plan](../05-planning/README.md) | Review strategy, dependencies, scope, and acceptance checks |
| Implementation and verification | [Upgrade and check](../06-upgrade-execution/README.md) | Inspect changes, run the actual upgraded app, and recover interrupted work |
| Cloud readiness | [Plan for Azure](../07-cloud/README.md) | Review hosting, database, configuration, and identity dependencies |
| Working example | [Completed reference](../examples/modernized/README.md) | Inspect one supplied implementation, separate from the learner's generated app |
| Historical tool output | [Previous BookCatalog sample run](../examples/assessments/bookcatalog/README.md) | Read recorded observations, including unfinished checks |
| Evidence boundaries | [Validation guide](validation.md) | Understand what reference tests and platform checks do and don't establish |

## Separate reusable guidance from sample choices

Use the workshop to explain a decision, not to make that decision for an unrelated application.
Check the user's code, requirements, data, and environment before recommending a migration approach.

| Reusable guidance | BookCatalog-specific choice |
| --- | --- |
| Assess compatibility before choosing changes | The sample starts on .NET Framework 4.8 and targets .NET 10 |
| Review the upgrade strategy and data-access approach | This one-project demo uses an in-place rewrite with EF Core and no compatibility adapters |
| Define data requirements before changing storage | The course rebuilds disposable demo data instead of preserving old records |
| Verify saved changes after an application restart | The core check adds a book, edits its title, restarts the app, and checks the saved title |
| Plan hosting, database access, configuration, and identity together | The proposed cloud target uses App Service on Linux, Azure SQL, Key Vault, and managed identity |

**The demo-data rule is not production migration advice.**
Only `BookCatalogModernizedLab` may be recreated in the core course.
The original database stays outside that work.
Normal app restarts must preserve saved edits.
Another application needs its own data-preservation, backup, recovery, and migration requirements.

The [optional data-transfer lab](data-transfer.md) copies selected demo records.
It isn't a complete production data-migration procedure.
An in-place rewrite and EF Core aren't universal recommendations for larger or more complex applications.

## Check the execution environment

The required course uses Windows, Visual Studio 2026, PowerShell, .NET Framework 4.8 tooling, IIS Express, and SQL Server LocalDB.
The upgraded app targets .NET 10.
Setup accepts a stable .NET SDK 10 or later and requires the .NET 10 runtime.

The chapter prompts use `@Modernize` in Visual Studio's Copilot Chat.
They aren't shell commands or evidence that another agent has access to the same tools.
If those tools aren't available, explain the limitation.
Don't present an independent code rewrite as a completed Visual Studio modernization exercise.

Some reference-app checks run on other platforms.
Those checks don't establish that the Windows learner workflow ran.

## Keep authorization separate from reference material

Finding this workshop doesn't authorize changes to the user's application or environment.
Follow the user's task and approval boundaries.

The course separates assessment, planning, and execution.
Planning approval isn't execution approval.
The required Azure chapter stops after assessment and plan review.
It doesn't authorize Azure sign-in, resource creation, deployment, or costs.
The course also keeps Git commits outside its agent execution requests.

The [optional deployment procedure](../07-cloud/deployment.md) has separate access, cost, approval, and cleanup requirements.
Don't include deployment as an implied next action.

## Cite the source and qualify the evidence

Link to the relevant chapter or section when using this material in an answer.
Identify sample decisions as sample decisions.
Keep recommendations separate from observed results.

A successful build doesn't establish correct application behavior.
Reference tests don't validate a different agent-generated application.
Recorded issue counts, screenshots, artifact paths, and task names describe a particular run.
Use the current tool's reported paths and results.

Report checks as passed, failed, or not run.
State the environment and limitations when making an execution claim.
Don't treat a completed dashboard task as proof that the actual application passed its browser and persistence checks.

## Check current product guidance

Product requirements and UI details can change.
Check the installed version and current Microsoft documentation before giving version-sensitive instructions.

- [GitHub Copilot upgrade documentation](https://learn.microsoft.com/dotnet/core/porting/github-copilot-upgrade/overview)
- [Upgrade strategies and flow modes](https://learn.microsoft.com/dotnet/core/porting/github-copilot-upgrade/concepts)
- [EF6 to EF Core guidance](https://learn.microsoft.com/ef/efcore-and-ef6/porting/)
- [GitHub Copilot modernization for Azure](https://learn.microsoft.com/dotnet/azure/migration/appmod/overview)

## Read without the website interface

The same Markdown is available in the repository and as [plain website content](https://microsoft.github.io/dotnet-modernization-for-beginners/content/docs/modernization-reference.md).
Neither format requires JavaScript to read the source.
The public [llms.txt index](https://microsoft.github.io/dotnet-modernization-for-beginners/llms.txt) links to selected Markdown sources.
It is a discovery aid, not a guarantee that search engines or coding agents will use it.
