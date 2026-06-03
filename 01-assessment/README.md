# Chapter 01: Assessment & Planning
You've installed the extension and run a preview assessment on a simple sample. Now it's time to run the full Assess → Plan workflow on a real legacy app: BookCatalog, an ASP.NET MVC 5 application running on .NET Framework 4.8. 

In this chapter, you'll scan BookCatalog, interpret what blockers (breaks compilation) versus warnings (deprecated but works) versus informational (nice-to-have) mean for your timeline, and generate a prioritized upgrade plan you'll execute in Chapter 02.

## 🎯 Learning Objectives

By the end of this chapter, you'll have:
- Run a full Assess → Plan workflow on BookCatalog using the GitHub Copilot app modernization extension in Guided Mode
- Read a compatibility report: identified which findings are blockers (must fix), warnings (should fix), and informational (optional)
- Understood the difference between binary incompatible (won't compile), source incompatible (needs code edits), and behavioral changes (runtime surprises)
- Generated a prioritized upgrade plan ordered by impact

---

## ✅ Prerequisites

**From Chapter 00:**
- GitHub Copilot app modernization extension installed in Visual Studio 2022 or 2026
- Understanding of the Assess → Plan → Act loop

**For This Chapter:**
- Visual Studio 2022 (17.12 or later) or 2026
- .NET Framework 4.8 SDK
- .NET 10 SDK

---

## 📂 Opening the BookCatalog App

BookCatalog is the sample you'll upgrade through Chapters 01–02. It's a small ASP.NET MVC 5 app with one controller, two models, and a SQL database context on Entity Framework 6. It works fine today on .NET Framework 4.8.

Open the solution:

1. Navigate to `shared-legacy-app/` in this repo.
2. Open `BookCatalog.sln` in Visual Studio 2022 or 2026.

**Expected output:**

```
Solution 'BookCatalog' (1 of 1 project)
  └── BookCatalog.Web (net48)
```

Build it to verify it compiles:

1. Press **Ctrl+Shift+B**.

**Expected output:**

```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

2. Run the app (F5) to verify it works:

![Screenshot: BookCatalog home page shows "Welcome to BookCatalog!"](images/bookcatalog-home.png)

This app is a realistic sample of a legacy .NET Framework app. It has common blockers like `System.Web.Mvc` and `Entity Framework 6`. Being a simple app, like many real-world apps, it has a mix of blockers, warnings, and informational findings that will help you learn how to read the compatibility report and prioritize your upgrade plan.

---

## 🔍 Running the Assessment

Trigger the extension using the same path as Chapter 00, but this time you'll go through both Assess and Plan phases (not just Assess):


1. Right-click the **solution** in Solution Explorer.
2. Select **Modernize**.

![Screenshot: Right-click on solution in Solution Explorer, select "Modernize"](images/trigger-modernize.png)

When the chat window opens, notice that we have options to customize the workflow. Selecting the model and options for modernization. Those options currently include:
- Upgrade to a newer version of .NET (e.g., .NET 10)
- Migrate to Azure
- Explore more modernization options

Plus, you can write your own custom instructions to the chat extension.

![Screenshot: Chat window shows options for modernization](images/modernization-options.png)

We'll select to "Upgrade to a newer version of .NET". Our goal is the same as Chapter 00, to upgrade to .NET 10. Click and send the message.

![Screenshot: Click "Upgrade to a newer version of .NET" option](images/upgrade-dotnet-option.png)

The extension confirms it's starting the workflow and runs a quick state check on your solution:

![Screenshot: Copilot replies "I'll help you upgrade your .NET project to a newer version. Let me first check the current state and load the necessary scenario instructions." with "Getting state" and "Getting solution path" checks](images/modernize-getting-state.png)

It then asks for permission to run a `cd` and inspect the git status of the workspace. Click **Confirm** to allow it.

![Screenshot: Terminal prompt "Do you want to run 'cd' in the terminal?" with cd, git rev-parse, git branch, and git status commands](images/modernize-terminal-confirm.png)

Once initialized, the extension shows the **Upgrade Settings** with the available target frameworks. The default is .NET 10.0 (LTS):

![Screenshot: Upgrade Settings panel listing Target Framework options — .NET 8.0 (LTS), .NET 9.0 (STS), .NET 10.0 (LTS) default, .NET 11.0 (Preview) — with project BookCatalog.Web currently on .NET Framework 4.8](images/upgrade-settings-target.png)

Right below, it lists the available **Flow Mode** options — *Automatic* (default) runs end-to-end, *Guided* pauses after each stage so you can review:

![Screenshot: Flow Mode panel showing Automatic (default) and Guided options](images/upgrade-settings-flow.png)

The extension asks you for the target framework. Type: **".NET 10, Guided Mode"**. 

About source control, you can choose to let the extension create a new branch for the upgrade or skip source control if you prefer to manage it yourself. For this demo, we'll select **Skip source control** to keep things simple, but in a real project, you'd likely want to use source control to track changes and collaborate with your team. Plus, the ability to roll back any undesirable changes can be key when running automated code modifications.

![Screenshot: Chat input with the message ".NET 10, Guided for reviews in my side"](images/upgrade-settings-input.png)

The extension echoes back the choices you made so you can verify them before it kicks off the scan:

![Screenshot: "Settings confirmed:" panel listing Target Framework .NET 10.0 (LTS), Flow Mode Guided, Source Control Skipped (demo)](images/settings-confirmed.png)

It then enters the **Assessment** stage and asks for permission to read the `assessment.md` instructions from the extension's skill folder. Click **Confirm** (or **Always allow** for this session).

![Screenshot: File access prompt "Access file 'assessment.md'?" pointing at the dotnet-version-upgrade skill folder with Confirm/Deny buttons](images/assessment-file-access.png)

The extension scans the code, dependencies, and project configuration. This takes 1–2 minutes! During this time, it looks for known blockers (APIs that won't compile on the target framework), warnings (APIs that are deprecated but still compile), and informational findings (APIs that work but have better alternatives). It also gathers context on the project structure, dependencies, and code patterns to generate a comprehensive compatibility report.

When done, the extension posts an **Assessment Complete** summary in the chat with the project, current and target frameworks, and an overall difficulty rating:

![Screenshot: "Assessment Complete" summary for BookCatalog.Web — Current .NET Framework 4.8 (classic, non-SDK-style, ASP.NET MVC 5 Web App), Target .NET 10.0, Difficulty High](images/assessment-complete.png)

Right after, it lists the **Main Challenges** it found — the architectural conversions you'll need to make (not just a TFM bump):

![Screenshot: "Main Challenges" list — 1. Project format → SDK-style, 2. Routing → endpoint routing, 3. Global filters → middleware, 4. Global.asax.cs → Program.cs, 5. Entity Framework → EF6 init adjustment, 6. Controllers/Views → 89 System.Web.Mvc incompatibilities](images/assessment-main-challenges.png)

Finally, a full compatibility report opens in a new tab:

![Screenshot: Compatibility Report shows 2 blockers, 2 warnings, 1 informational](images/assessment-report.png)

> 💡 **Guided vs. Flow Mode:** You're running Guided Mode, which pauses after Assess so you can read the report before Plan starts. Flow Mode automates everything. Guided lets you understand each phase.

---

## 📊 Reading the Compatibility Report

The report that opens is a Markdown document titled **"Projects and dependencies analysis"**. It's structured top-down, from the 30,000-ft view to the per-project drill-down. Before diving into the sections, it helps to keep the three API categories in mind — they show up everywhere in the report:

```mermaid
flowchart TD
    REPORT["📋 Compatibility Report"]
    
    REPORT --> BLOCKERS["🔴 Binary Incompatible\n(Blockers)"]
    REPORT --> WARNINGS["🟡 Source Incompatible\n(Warnings)"]
    REPORT --> INFO["🔵 Behavioral Change\n(Informational)"]
    
    BLOCKERS --> B1["Won't compile\nin .NET 10"]
    BLOCKERS --> B2["Must fix before\nupgrade"]
    
    WARNINGS --> W1["Compiles, but needs\nre-compile + code edits"]
    WARNINGS --> W2["Should fix\nto avoid future breaks"]
    
    INFO --> I1["Compiles & runs,\nbut behavior may differ"]
    INFO --> I2["Test at runtime"]
    
    B1 --> PRIORITY["Fix Priority:\nBlockers → Warnings → Info"]
    B2 --> PRIORITY
    W1 --> PRIORITY
    W2 --> PRIORITY
    I1 --> PRIORITY
    I2 --> PRIORITY
```

Now let's walk through each section of the report as it renders in the editor.

### Executive Summary

The first section is a quick health check on your solution. It opens with a **Highlevel Metrics** table that tells you how big the upgrade actually is:

| Metric | Count | Status |
| :--- | :---: | :--- |
| Total Projects | 1 | All require upgrade |
| Total NuGet Packages | 6 | 2 need upgrade |
| Total Code Files | 14 |  |
| Total Code Files with Incidents | 6 |  |
| Total Lines of Code | 633 |  |
| Total Number of Issues | 105 | 89 API issues + 7 package issues + 9 project structure issues |
| Estimated LOC to modify | 89+ | at least 14,1% of codebase |

Roughly **14% of BookCatalog's code will need to change** — concentrated in 6 of 14 files. That's small for a real-world migration, but the per-issue mix matters more than the absolute count.

Next, the **Projects Compatibility** table grades each project with a difficulty rating and links straight to its detailed section:

| Project | Target Framework | Difficulty | Package Issues | API Issues | Est. LOC Impact | Description |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| src\BookCatalog.Web\BookCatalog.Web.csproj | net48 | 🔴 High | 7 | 89 | 89+ | Wap, Sdk Style = False |

🔴 **High** here is driven by two things: it's a non-SDK-style **Wap** (Web Application Project), and it has 89 API issues — all in `System.Web.*`. Both signals tell you this is an architectural conversion, not a TFM bump.

The **Package Compatibility** and **API Compatibility** tables break down what's salvageable vs. what needs replacing:

| Status | Count | Percentage |
| :--- | :---: | :---: |
| ✅ Compatible | 4 | 66,7% |
| ⚠️ Incompatible | 0 | 0,0% |
| 🔄 Upgrade Recommended | 2 | 33,3% |
| ***Total NuGet Packages*** | ***6*** | ***100%*** |

| Category | Count | Impact |
| :--- | :---: | :--- |
| 🔴 Binary Incompatible | 83 | High - Require code changes |
| 🟡 Source Incompatible | 6 | Medium - Needs re-compilation and potential conflicting API error fixing |
| 🔵 Behavioral change | 0 | Low - Behavioral changes that may require testing at runtime |
| ✅ Compatible | 237 |  |
| ***Total APIs Analyzed*** | ***326*** |  |

Good news: **no packages are flat-out incompatible** — every NuGet has a path forward. Bad news: **83 binary-incompatible API calls** mean a lot of `using System.Web.Mvc` references won't even compile on .NET 10.

### Aggregate NuGet packages details

This section lists every package, its current version, the suggested target version, and what to do about it:

| Package | Current Version | Suggested Version | Description |
| :--- | :---: | :---: | :--- |
| EntityFramework | 6.4.4 | 6.5.2 | NuGet package upgrade is recommended |
| Microsoft.AspNet.Mvc | 5.2.9 |  | NuGet package functionality is included with framework reference |
| Microsoft.AspNet.Razor | 3.2.9 |  | NuGet package functionality is included with framework reference |
| Microsoft.AspNet.WebPages | 3.2.9 |  | NuGet package functionality is included with framework reference |
| Microsoft.Web.Infrastructure | 2.0.0 |  | NuGet package functionality is included with framework reference |
| Newtonsoft.Json | 13.0.3 | 13.0.4 | NuGet package upgrade is recommended |

Notice that four `Microsoft.AspNet.*` packages have no suggested version — that's the report telling you those are **rolled into the ASP.NET Core framework reference**, so you'll remove the explicit NuGet references entirely. Only `EntityFramework` and `Newtonsoft.Json` get straight version bumps.

### Top API Migration Challenges

This is the most actionable section. It groups the 89 API issues by **technology family** so you can see where to focus:

| Technology | Issues | Percentage | Migration Path |
| :--- | :---: | :---: | :--- |
| ASP.NET Framework (System.Web) | 89 | 100,0% | Legacy ASP.NET Framework APIs for web applications (System.Web.*) that don't exist in ASP.NET Core due to architectural differences. ASP.NET Core represents a complete redesign of the web framework. Migrate to ASP.NET Core equivalents or consider System.Web.Adapters package for compatibility. |

**100% of the API issues are `System.Web.*`** — every blocker traces back to the same root cause. Fix the framework migration and you've solved the whole list.

Right below, the **Most Frequent API Issues** table ranks individual APIs by hit count. The top of the list tells you exactly what your replace-with-ASP.NET-Core work will look like:

| API | Count | Percentage | Category |
| :--- | :---: | :---: | :--- |
| T:System.Web.Mvc.ActionResult | 8 | 9,0% | Binary Incompatible |
| T:System.Web.Mvc.ViewResult | 7 | 7,9% | Binary Incompatible |
| M:System.Web.Mvc.Controller.View(System.Object) | 6 | 6,7% | Binary Incompatible |
| T:System.Web.Mvc.HttpNotFoundResult | 4 | 4,5% | Binary Incompatible |
| M:System.Web.Mvc.Controller.HttpNotFound | 4 | 4,5% | Binary Incompatible |
| T:System.Web.Mvc.ValidateAntiForgeryTokenAttribute | 3 | 3,4% | Binary Incompatible |
| T:System.Web.Mvc.HttpPostAttribute | 3 | 3,4% | Binary Incompatible |
| T:System.Web.Mvc.RedirectToRouteResult | 3 | 3,4% | Binary Incompatible |
| T:System.Web.Mvc.UrlParameter | 3 | 3,4% | Binary Incompatible |
| T:System.Web.HttpContextBase | 1 | 1,1% | Source Incompatible |
| P:System.Web.HttpRequestBase.UserAgent | 1 | 1,1% | Source Incompatible |
| T:System.Web.HttpApplication | 1 | 1,1% | Source Incompatible |

> 💡 **API prefix legend:** `T:` = type, `M:` = method, `P:` = property, `F:` = field. These prefixes come from .NET's XML documentation format.

The pattern is clear: replace `System.Web.Mvc.ActionResult` / `ViewResult` with `Microsoft.AspNetCore.Mvc.IActionResult` / `ViewResult`, swap attributes (`[HttpPost]`, `[ValidateAntiForgeryToken]`) for their `Microsoft.AspNetCore.Mvc` equivalents, and the 83 binary-incompatible hits collapse into a handful of mechanical edits.

The 6 **Source Incompatible** items (`HttpContextBase`, `HttpRequestBase.UserAgent`, `HttpApplication`) are the ones where you'll need an `IHttpContextAccessor` and a new `Program.cs` startup pattern — exactly the "Global.asax.cs → Program.cs" challenge from the assessment summary.

### Projects Relationship Graph

For BookCatalog this section is short — one project, no dependencies — but on larger solutions it becomes invaluable. It renders a Mermaid graph showing which projects depend on which, and marks each one as SDK-style (📦) or classic (⚙️):

```mermaid
flowchart LR
    P1["⚙️ BookCatalog.Web.csproj
    net48"]
```

When you have a multi-project solution, this graph dictates your upgrade order: **start at the leaves and work toward the roots**, so dependencies are already on .NET 10 by the time you upgrade the project that consumes them.

### Project Details

The final section drills into each project individually. For `BookCatalog.Web.csproj` you get the same shape of report as the executive summary, but scoped to that one project — Project Info, a per-project Dependency Graph, an API Compatibility breakdown, and the Technologies and Features list.

The **Project Info** block is the cheat sheet for what kind of conversion you're signing up for:

- **Current Target Framework:** net48
- **Proposed Target Framework:** net10.0
- **SDK-style**: False
- **Project Kind:** Wap
- **Number of Files**: 19
- **Number of Files with Incidents**: 6
- **Lines of Code**: 633
- **Estimated LOC to modify**: 89+ (at least 14,1% of the project)

`SDK-style: False` + `Project Kind: Wap` is the combination that earns the 🔴 High rating: before you can even start fixing API calls, the project file itself has to be rewritten in SDK-style format.

---

## ✅ What the Report Means for Your Timeline

Boiling the whole report down to one decision-making table:

| Finding Type | BookCatalog Count | Action | Effort Signal |
|:---|:---:|:---|:---|
| 🔴 **Binary Incompatible** (Blockers) | 83 | Must fix — won't compile on .NET 10 | Mostly mechanical: `System.Web.Mvc.*` → `Microsoft.AspNetCore.Mvc.*` |
| 🟡 **Source Incompatible** (Warnings) | 6 | Should fix — needs re-compile + small code edits | Architectural: `HttpContext` access pattern, `HttpApplication` → `Program.cs` |
| 🔵 **Behavioral Change** (Informational) | 0 | None this run | — |
| 📦 **Packages to upgrade** | 2 | EF6 → 6.5.2, Newtonsoft.Json → 13.0.4 | Version bumps |
| 📦 **Packages to remove** | 4 | The `Microsoft.AspNet.*` set | Rolled into the framework reference |

The headline numbers (83 / 6 / 0) come straight from the report's API Compatibility table. Together they tell you this is a **one-developer, few-day migration** dominated by find-and-replace work on MVC types, plus one real architectural change (Global.asax → Program.cs).

Remember, **you can edit the assessment to add knowledge or context** that the extension might have missed. For example, if you know that some of those `System.Web.Mvc` hits are in files that are only used for legacy admin pages, you might downgrade their priority from "must fix" to "should fix" and mark them as informational. Or if you have a test project that also has blockers but it's not critical to get running on .NET 10, you could deprioritize it in the plan. 

---

## 🗺️ Generating the Upgrade Plan

Once you've read the report in your Guided Mode session, the extension asks: **"To proceed: approve or continue To adjust: Edit assessment.md or tell me what to change To switch mode: Say continue in automatic mode to stop pausing at stage boundaries** 

At the end of the assessment, Guided Mode pauses and prompts you with three options:

- **To proceed**: approve or say "continue"
- **To adjust**: edit `assessment.md` directly or tell the extension what to change in chat
- **To switch mode**: say "continue in automatic mode" to stop pausing at stage boundaries

Before continuing, this is your chance to amend the assessment if you spot a false positive or want to reprioritize something. For example, you could say: "In the assessment, please mark the `System.Web.Mvc` hits in `AdminController.cs` as informational instead of blockers, since those pages are low-priority for the upgrade."

![Screenshot: Chat input with the message "Continue" to proceed to the Plan phase](images/plan-continue.png)

The extension then moves to the **Plan** phase. It takes the assessment findings and first surfaces a set of **upgrade strategy questions** — one decision at a time, each with a recommendation pre-selected and an explanation of why. The output is saved in `upgrade-options.md` in your project.

**Walk through each question, then at the end you'll send a single message to confirm your choices (or override any default).** We'll come back to that message at the end of this section.

Let's walk through each decision BookCatalog triggers.

### Upgrade Strategy

The first question is how to spread the migration across time. Because BookCatalog is a single project, the extension has only one option:

| Value | Description |
|-------|-------------|
| **All-at-Once** (selected) | The single project is converted to SDK-style, retargeted to net10.0, and all code migrated in one coordinated pass. |

For multi-project solutions you'd also see **Strangler Fig** (migrate one project at a time from the bottom up). With a single project there's no dependency chain to work through, so all-at-once is the only sensible choice.

### Project Structure

Next, how to physically restructure the project during the migration:

| Value | Description |
|-------|-------------|
| **In-place rewrite** (selected) | Replaces the Framework web project with an ASP.NET Core project in one pass. No YARP proxy, no parallel projects. |
| Side-by-side | Creates a new ASP.NET Core project alongside the old one with a YARP proxy; assets migrate incrementally while the old app stays live. Better for large web surfaces. |

BookCatalog is small (1 controller, ~633 LOC), so in-place is the cleaner fit. **Side-by-side** is worth knowing about for larger apps: it keeps the old site live while the new one is built alongside it, routing traffic gradually via a reverse proxy.

> 💡 **YARP** (Yet Another Reverse Proxy) is a Microsoft toolkit used in the side-by-side pattern to route incoming HTTP requests between the old ASP.NET Framework app and the new ASP.NET Core app. This lets you migrate and test incrementally while the old app stays live — at the cost of added infrastructure complexity.

### APIs and Frameworks

89 `System.Web.Mvc` API changes, all with known ASP.NET Core equivalents. The extension recommends resolving them inline:

| Value | Description |
|-------|-------------|
| **Fix Inline** (selected) | Resolve every API change in the same task, including complex ones. No deferred stubs to clean up later. |
| Defer Complex Changes | Stub complex changes to keep the project building, resolve in follow-up subtasks. Better for large bottom-up upgrades. |

**Defer Complex Changes** is the escape hatch for large solutions where you want the project to compile at every step (useful in CI). For BookCatalog, all 89 issues are known patterns, fixing them inline gives you a clean codebase in one pass.


EF6 6.4.4 is detected with a single `DbContext`. The extension flags an important choice here:

| Value | Description |
|-------|-------------|
| **Keep EF6** (selected) | Upgrade EF6 to 6.5.2 and run it on net10.0. Migrate to EF Core later as a separate effort. Lowest risk. |
| Migrate to EF Core | Migrate Entity Framework simultaneously with the .NET upgrade. Two sources of breaking changes at once. |

As we are already doing an architectural migration (System.Web → ASP.NET Core), **we will migrate to Core**, as this is a simple app and we want to get all the benefits of EF Core right away. In a larger app with a complex data layer, it might be safer to *keep* EF6 for now, get the app running on .NET 10, then tackle EF Core as a separate project.

`web.config` holds standard connection strings and `appSettings` — nothing unusual:

| Value | Description |
|-------|-------------|
| **Auto-migrate to .NET Core Configuration** (selected) | Converts web.config to appsettings.json and migrates code to IConfiguration. |
| Manual Migration with Mapping Document | Generates a detailed settings mapping first. More control for complex configs. |

**Manual Migration** is for apps where `web.config` has custom config sections, encrypted values, or environment-specific transforms that need human review before touching. BookCatalog's config is standard, so auto-migration handles it.

With all strategy decisions reviewed, you're ready to generate the final plan. The extension synthesizes all of this into a prioritized sequence of atomic tasks.

Type: **"Continue. but change to use EF Core instead of keeping EF6"** and send. This overrides the default EF6 choice to include the EF Core migration in the same pass as the .NET upgrade — a reasonable call for a small app like BookCatalog.

---

## Plan Output

When you send that message, it then updates `upgrade-options.md` to reflect your change and confirms it understood. Then the extension acknowledges the override and first asks permission to load the `SKILL.md` from its plan-generation module. Click **Confirm**.

![Screenshot: "Access file 'SKILL.md'?" prompt pointing at the plan-generation skill folder with Confirm/Deny buttons](images/plan-skill-access.png)

It generates the two plan artefacts — `plan.md` (+60 lines) and `tasks.md` (+15 lines) — in your project's `.github/upgrades/scenarios/dotnet-version-upgrade/` folder:

![Screenshot: "Now I'll generate the plan and tasks files." with plan.md (+60) and tasks.md (+15) file changes](images/plan-files-generated.png)

Finally, the extension then synthesizes the assessment findings and all strategy decisions into an **Upgrade Plan Summary** in the chat — a quick table you can review before the full plan files are written:

![Screenshot: Upgrade Plan Summary — Strategy: All-At-Once (single project), Target: .NET 10.0, 5 tasks — table with task # / Task / What it does columns, plus key decisions footer](images/plan-summary.png)


The full content of `plan.md` is your Chapter 02 roadmap. It has 5 ordered tasks, each with a clear scope and a "Done when" condition so you know exactly when to move to the next:

**Task 01 — Prerequisites**: Verify .NET 10 SDK is installed, check `global.json` for SDK pins, establish a baseline build. No code changes — just environment validation before anything else runs.

**Task 02 — SDK-style conversion**: Rewrite `BookCatalog.Web.csproj` from classic Wap format to SDK-style and swap `packages.config` for `PackageReference`. The project stays on `net48` through this task so structural and API changes don't mix.

**Task 03 — ASP.NET Core migration**: The main event. Retarget to `net10.0` and replace all 89 `System.Web.*` API hits:
- `Global.asax.cs` + `RouteConfig` + `FilterConfig` → `Program.cs` startup pipeline
- `BooksController` → `Microsoft.AspNetCore.Mvc.Controller`, `IActionResult`, `NotFound()`, `RedirectToAction`, `ValidateAntiForgeryToken`, `ModelState`
- `HttpRequestBase.UserAgent` → ASP.NET Core equivalent
- `web.config` → `appsettings.json` + `IConfiguration`
- Razor views + `_Layout.cshtml` updated for ASP.NET Core conventions
- `Newtonsoft.Json` bumped to 13.0.4; `Microsoft.AspNet.*` packages dropped

**Task 04 — EF Core migration**: Migrate the data layer from EF6 to EF Core (`ApplicationDbContext` + `Book` entity). Replace the `EntityFramework` package with EF Core provider packages, convert the `DbContext` to the options-pattern constructor, register via DI in `Program.cs`, and handle EF6-specific patterns (database initializers → `EnsureCreated`, lazy-loading config).

**Task 05 — Final validation**: Clean build (zero errors, zero warnings), app starts, any tests pass. Document deferred follow-ups (nullable reference types, EF Core migrations).

> 💡 **Why 5 tasks instead of 1?** The plan deliberately isolates failure modes. If task 03 introduces a regression, you know it came from the ASP.NET Core migration — not the SDK conversion or the EF change. Each task is atomic and independently verifiable via its "Done when" condition.

After reviewing the plan summary in the chat, open `plan.md` to see the full details. You can edit this file to adjust task scopes, add notes, or split/merge tasks as needed. The key is that the plan is a living document — generated by the extension but owned and maintained by you.

---

## ✅ You're Ready!

You've run Assess → Plan on a real app, read the compatibility report, and understand what blockers vs. warnings vs. informational mean. You know which changes will block the upgrade (blockers) and which are best practices (warnings and info). In Chapter 02, you'll execute the Act phase: let the extension propose code changes, review them, and modernize BookCatalog to run on .NET 10.

**[Continue to Chapter 02: Modernizing →](../02-modernizing/README.md)**

---

## 🔑 Key Takeaways

1. **The report reads top-down.** Executive Summary first (size and difficulty), then NuGet packages, then API challenges, then per-project drill-downs. You don't have to read every row — the summary tables tell you where to focus.
2. **Binary Incompatible = blockers.** 83 hits in BookCatalog, all `System.Web.Mvc.*`. These won't compile on .NET 10 and must be replaced (mostly with `Microsoft.AspNetCore.Mvc.*` equivalents).
3. **Source Incompatible = re-compile + small edits.** Only 6 hits, but they're the architectural ones (`HttpContextBase`, `HttpApplication`) that push you toward `IHttpContextAccessor` and `Program.cs`.
4. **Behavioral Change = test at runtime.** None this run — the upgrade should behave the same once it compiles.
5. **Packages split into three buckets:** keep as-is (✅), bump the version (🔄), or remove because the framework now provides it (no suggested version). For BookCatalog: 4 keep, 2 bump, 4 of those keepers are actually getting absorbed into the ASP.NET Core framework reference.
6. **Difficulty rating ≠ effort estimate.** 🔴 High here means *architectural conversion required*, not *hundreds of hours*. The 89 LOC and one-technology concentration make this a small migration with a scary-looking label.
7. **The Plan phase asks strategy questions before writing code.** Each question has a recommended default and an alternative — understanding why the default was chosen (EF6 vs EF Core, in-place vs side-by-side, inline vs defer) is as important as the final plan itself.

---

## 🛠️ Troubleshooting

**Problem:** The assessment fails with "Unable to analyze project."

**Solution:** Restore NuGet packages first. Right-click the solution in Solution Explorer → **Restore NuGet Packages**. Wait for completion, then retry the assessment.

---

**Problem:** The report shows blockers, but I expected fewer (or more).

**Solution:** The extension scans for all uses of unsupported APIs. Small differences are normal. If you spot something that looks wrong, note the line number and check the code file directly—there may be a false positive worth reporting.

---

**Problem:** I'm in Flow Mode instead of Guided Mode.

**Solution:** When the extension asks for target framework, type exactly: **".NET 10, Guided Mode and No Source Control"**. This ensures you pause after Assess to read the report before Plan starts. Flow Mode automates everything; we want you to read and understand first.

---

## 📚 Learn More

- 📘 [GitHub Copilot app modernization for .NET](https://learn.microsoft.com/dotnet/core/porting/github-copilot-app-modernization-overview) — how Assess → Plan → Act works
- 📘 [Port from .NET Framework to .NET](https://learn.microsoft.com/dotnet/core/porting/) — the full migration guide
- 📘 [Migrate from System.Web to ASP.NET Core](https://learn.microsoft.com/dotnet/core/porting/net-framework-to-core-migration) — technical deep dive on the biggest blocker
- 📘 [Migrate to Entity Framework Core](https://learn.microsoft.com/ef/core/what-is-new/ef6-efcore-porting/) — how to move from EF6 to EF Core
