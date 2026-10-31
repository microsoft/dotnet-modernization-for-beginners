# BookCatalog: a Copilot app upgrade example

<!-- repo-only:start -->
> [!TIP]
> **Prefer the web experience?** [Open this page on the course website](https://microsoft.github.io/dotnet-modernization-for-beginners/#/reference?path=examples%2Fassessments%2Fcopilot-app%2FREADME.md) for the best reading experience and navigation.
<!-- repo-only:end -->

This example documents a BookCatalog upgrade using the GitHub Copilot desktop app on October 30, 2026.
It starts with .NET Framework 4.8 and ends with an agent-reported standalone ASP.NET Core MVC app on .NET 10.
EF6 remains the data-access library.

Follow [Modernize with the GitHub Copilot app](../../../03-prerequisites/copilot-app.md) for the learner steps.
The screenshots here describe one run. They aren't checks of another generated application.

## Assessment and migration

The prompt box accepts a local folder through **+ > Folder...**.
The selected folder becomes conversation context without a separate repository-registration step.

![The prompt-box menu offers Folder to attach the local BookCatalog directory directly.](../../../03-prerequisites/images/copilot-app-add-folder.png)

The initial request selects the `shared-legacy-app` folder and asks for .NET 10 with a dashboard canvas.

![The upgrade request names .NET 10 and asks Copilot to use a canvas to follow the work.](../../../03-prerequisites/images/copilot-app-request.png)

The assessment identifies incompatible route-registration APIs.
Some finding text names `net8.0`, although the selected scenario target is `net10.0`.
That mismatch needs explanation rather than changing the intended target.

![The Assessment tab shows route-registration findings in BookCatalog's Framework host.](../../../03-prerequisites/images/copilot-app-assessment.png)

The plan begins with baseline checks, a parallel host, and migration of the catalog.

![The initial dashboard tasks cover the baseline, parallel host, and catalog migration.](../../../03-prerequisites/images/copilot-app-baseline.png)

The parallel-host task introduces ASP.NET Core alongside the Framework host.
Its temporary routing uses adapters and a YARP reverse proxy.

![The parallel-host task describes the temporary compatibility and proxy-routing boundary.](../../../03-prerequisites/images/copilot-app-core-host.png)

The agent then moves the book controller, routes, Razor views, and styles.
The plan keeps the EF6 data model and shared lab schema.

![The dashboard tracks the migration of Razor views and CSS after the book controller.](../../../03-prerequisites/images/copilot-app-views.png)

At 88:00, the video shows 9 of 11 tasks complete, with final validation still in progress.
This frame isn't the final state shown in the later screenshots.

![Near the video's end, final cross-host validation remains in progress with 9 of 11 tasks complete.](../../../03-prerequisites/images/copilot-app-validation.png)

## Changing the end state

The learner asks why the Framework host remains and authorizes its removal.
The agent explains that it had retained the host as a fallback.
It revises the plan to remove the host and validate one standalone .NET 10 app.

![The learner requests removal of the Framework host, and the agent explains the revised plan.](../../../03-prerequisites/images/copilot-app-retirement-decision.png)

The later completion message reports removal of the Framework project, YARP, and unused compatibility dependencies.
It reports a successful Release build and controlled runtime checks.
It also states that no test project existed in that workspace, so automated tests were not run.

![The completion message reports the standalone host, build and runtime results, and no automated test run.](../../../03-prerequisites/images/copilot-app-completion-report.png)

A refreshed summary reports **11/11 tasks complete** and the saved plan's changed end state.

![The refreshed summary reports all tasks complete and explains the decision to retire the Framework host.](../../../03-prerequisites/images/copilot-app-completion-summary.png)

## Task completion and build records

The dashboard shows all tasks complete, but its build card says **Not run yet** and **No build recorded in this session**.
That missing record doesn't independently establish whether the reported build command passed or failed.

![The Overview tab shows 11 of 11 tasks complete while its build card has no recorded build.](../../../03-prerequisites/images/copilot-app-completed-overview.png)

The **Execution** tab reports 11 complete tasks, with none in progress or failed.

![The Execution tab reports 11 completed tasks, zero in progress, and zero failed.](../../../03-prerequisites/images/copilot-app-completed-tasks.png)

## Final report in Canvas

The conversation offers the final report as a document card.
The message identifies automated tests and production schema checks as follow-up work.
It doesn't authorize deployment.

![The completion conversation offers a final report card and names remaining operational follow-up work.](../../../03-prerequisites/images/copilot-app-report-card.png)

The report describes one replacement host added, one legacy host removed, and EF6 retained.

![The Canvas report describes the completed standalone application and removal of the temporary migration boundary.](../../../03-prerequisites/images/copilot-app-report-canvas.png)

These screenshots establish agent-reported completion, not independently rerun verification of the generated application.
They don't establish the learner's browser persistence result.
Use the lesson's build and add/edit/restart checks on the actual application.

## Source notes

The six video frames are from 01:00, 03:00, 08:00, 15:00, 55:00, and 88:00.
Additional screenshots cover the folder menu, plan revision, completion messages, dashboard, and report.
Chat screenshots are cropped to omit account details and personal filesystem paths. Their retained text is unchanged.
The source commit and installed app and plugin versions weren't recorded.
Counts, model names, and UI labels can differ between runs.

**[Back: Copilot app lesson](../../../03-prerequisites/copilot-app.md)**
