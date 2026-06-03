# Chapter 02: Modernizing

You've assessed BookCatalog and generated a 5-task upgrade plan in Chapter 01. Now comes the **Act** phase: the extension will execute that plan one task at a time, pausing after each so you can verify and approve before moving on. By the end of this chapter, BookCatalog will be a SDK-style ASP.NET Core app running on .NET 10 with EF Core, and you'll have learned how Guided Mode keeps you in control of an automated migration.

## 🎯 Learning Objectives

By the end of this chapter, you'll have:
- Approved the upgrade plan and entered the **Execution** stage
- Walked through all 5 tasks in Guided Mode — pausing to review after each before continuing
- Watched the extension auto-recover from two build failures mid-task without manual intervention
- Seen 89 `System.Web.*` API incompatibilities resolved automatically (all replaced with their ASP.NET Core equivalents)
- Witnessed EF6 → EF Core: `DbContext` rewired, DI-integrated, old initializer pattern replaced with `EnsureCreated()`
- Verified BookCatalog builds clean (0 errors, 0 warnings) and runs on .NET 10

---

## ✅ Prerequisites

**From Chapter 01:**
- A `plan.md` and `tasks.md` file in `.github/upgrades/scenarios/dotnet-version-upgrade/`
- An `upgrade-options.md` reflecting your strategy decisions (including the EF Core override)
- BookCatalog still open in Visual Studio with the Modernize chat session active

**For This Chapter:**
- Familiarity with reading C# diffs
- A SQL Server LocalDB instance available (the EF Core migration will recreate the database via `EnsureCreated()`)

> 💡 **Tip:** If you skipped source control in Chapter 01 (the "demo" choice), now is a good moment to commit the assessment/plan files. Each task in this chapter modifies real code — having a snapshot to revert to is cheap insurance.

---

## ✅ Approving the Plan

The chat session is currently paused at the end of the Plan phase, with `plan.md` and `tasks.md` waiting for your sign-off. In the chat panel you'll see four files staged for review: `upgrade-options.md`, `scenario-instructions.md`, `plan.md` (new), and `tasks.md` (new).

Type **"Approve the upgrade plan"** and send.

![Screenshot: Total changes (4) listing upgrade-options.md, scenario-instructions.md, plan.md (new) and tasks.md (new), with chat input "Approve the upgrade plan"](images/01-approve-plan.png)

The extension confirms approval and transitions to the **Execution** stage. It reads its own `execution.md` instructions and asks permission to load the `SKILL.md` from the task-execution skill folder. Click **Confirm**.

![Screenshot: "Plan approved. Entering the Execution stage." with execution.md read and SKILL.md access prompt for the task-execution skill](images/02-plan-approved-skill-access.png)

From here, the extension works through the plan one task at a time, **pausing after each task** so you can review the changes and decide whether to continue. This is what Guided Mode buys you — at any point you can stop, edit the code yourself, or steer the extension in a different direction.

Here's the rhythm you'll be in for the rest of the chapter — each task box shows what it produces and its progress percentage; diamonds are your decision points:

```mermaid
flowchart TD
    START([💬 Approve the upgrade plan])
    DONE([✅ BookCatalog running on .NET 10])

    START --> T1

    T1["**Task 01 · 20%**\n🟢 Prerequisites\n─────────────────\n✔ .NET 10 SDK verified\n✔ No global.json conflicts\n✔ Baseline recorded"]
    T2["**Task 02 · 40%**\n🟢 SDK-style conversion\n─────────────────\n✔ csproj → Microsoft.NET.Sdk.Web\n✔ packages.config → PackageReference\n✔ Stays on net48"]
    T3["**Task 03 · 60%**\n🟠 ASP.NET Core migration\n─────────────────\n✔ Global.asax → Program.cs\n✔ System.Web → Microsoft.AspNetCore\n✔ web.config → appsettings.json\n✔ Razor views updated\n⏰ 20–30 min"]
    T4["**Task 04 · 80%**\n🟢 EF Core migration\n─────────────────\n✔ EF6 → EF Core 10.0.8\n✔ DbContext options pattern\n✔ DI registration\n✔ EnsureCreated + Seed"]
    T5["**Task 05 · 100%**\n🟢 Final validation\n─────────────────\n✔ Build: 0 errors, 0 warnings\n✔ App starts + data loads\n✔ Follow-ups documented"]

    T1 --> C1{{"You:\nContinue!"}}
    C1 --> T2
    T2 --> C2{{"You:\nContinue!"}}
    C2 --> T3
    T3 --> C3{{"You:\nContinue!"}}
    C3 --> T4
    T4 --> C4{{"You:\nContinue!"}}
    C4 --> T5
    T5 --> DONE



    classDef task fill:#1f6feb15,stroke:#1f6feb,color:#e6edf3,text-align:left
    classDef hot fill:#f59e0b15,stroke:#f59e0b,color:#e6edf3,text-align:left
    classDef you fill:#23863615,stroke:#238636,color:#e6edf3
    classDef warn fill:#da363315,stroke:#da3633,color:#e6edf3,text-align:left
    classDef cap fill:#23863615,stroke:#238636,color:#e6edf3

    class T1,T2,T4,T5 task
    class T3 hot
    class C1,C2,C3,C4 you
    class T2_FAIL warn
    class START,DONE cap
```

> 💡 **Why so many pauses?** Guided Mode trades speed for control. Each "Continue!" is a chance to inspect what just happened, edit code yourself, or course-correct. If you'd rather watch the whole thing run end-to-end, say *"continue in automatic mode"* at any pause — shown as the dashed lines above — and the extension runs the remaining tasks back-to-back.

---

## 🟢 Task 01 — Prerequisites

The first task is verification only — no code changes, just environment checks. The extension validates the .NET 10 SDK is installed and looks for a `global.json` that might pin a different SDK version.

![Screenshot: "This is a simple verification task." with 4 sub-tasks done — Validating net10.0 SDK installation, Validating net10.0 SDK in global.json, "Couldn't run file_search" warning, Read 0 files for 'global.json'](images/03-task01-validation.png)

> 💡 **The "Couldn't run file_search" warning is expected** when there's no `global.json` to find — the extension follows up by directly reading the file and confirming it doesn't exist. A missing `global.json` is the *good* outcome here: no SDK pin conflicts.

The extension writes its findings to `progress-details.md` and completes the task:

![Screenshot: "No global.json exists (clean — no SDK pin conflicts). SDK is confirmed compatible." with progress-details.md (+17) update and "Completing task 01-prerequisites"](images/04-task01-completing.png)

You then get a **Task Complete** summary in the chat with a progress percentage and a preview of what's next:

![Screenshot: "Task 01 Complete (20%)" — Prerequisites verified (SDK installed, no global.json conflicts, baseline recorded) and "Next up — Task 02: SDK-style conversion"](images/05-task01-complete.png)

To move on, type **"Continue!"** and send.

![Screenshot: Chat input with "Continue!"](images/06-continue-input.png)

---

## 🟢 Task 02 — SDK-style Conversion

Task 02 rewrites `BookCatalog.Web.csproj` from the classic non-SDK Web Application Project (Wap) format into modern SDK-style format, and migrates `packages.config` to `PackageReference`. **The project stays on `net48` through this task** — so if anything breaks, you know it's structural, not API-related.

The extension starts by loading two relevant skills (one for SDK conversion, one for the Wap → SDK transition):

![Screenshot: "Continuing to Task 02 — SDK-style conversion. Let me start the task." with Read SKILL.md (lines 1-300) and Read SKILL.md (lines 1-250)](images/07-task02-starting.png)

It then enriches `task.md` with project-specific research before running the actual conversion:

![Screenshot: "This is a single-project, atomic task. Let me enrich task.md, then run the conversion." with Read task.md and Generating edits...](images/08-task02-enriching.png)

> 💡 **Visual Studio may pop up an "Inconsistent Line Endings" dialog** when the extension edits `task.md`. Pick **Windows (CR LF)** and **Yes** — this is purely cosmetic and doesn't affect the migration.

![Screenshot: Visual Studio "Inconsistent Line Endings" dialog for task.md with "Windows (CR LF)" selected and Yes/No buttons](images/09-line-endings-dialog.png)

With research enriched, the extension runs the conversion on `BookCatalog.Web.csproj` and verifies `packages.config` is gone:

![Screenshot: "Now run the SDK-style conversion." — Converting project BookCatalog.Web.csproj to SDK-style, "Conversion succeeded.", Read BookCatalog.Web.csproj (lines 1-120), Read 0 files for 'packages.config'](images/10-task02-converting.png)

The conversion is done, but the extension hasn't trusted it yet. It asks permission to **build the solution** as a sanity check (still on `net48`):

![Screenshot: "packages.config is removed and the project is now SDK-style (Microsoft.NET.Sdk.Web), still on net48..." with Build Solution Confirm prompt](images/11-build-solution-prompt.png)

Click **Confirm** — and here's where things get interesting. The first build **fails twice**, and watching how the extension recovers is the most important part of this task:

![Screenshot: Two "Build failed" messages followed by recovery — first restoring System.Web framework references (10 lines added), then fixing OutputType from Exe to Library (1 line changed), then "Build successful"](images/12-build-failed-recovered.png)

Two distinct conversion-tool mistakes, both auto-corrected:

1. **Build failed #1**: The conversion dropped the `System.Web` / `System.Web.Routing` GAC references that classic Wap projects get implicitly but SDK-style `net48` projects don't. The extension re-added them (+10 lines).
2. **Build failed #2**: The conversion set `OutputType=Exe`, but a `net48` ASP.NET MVC web app builds as a `Library`. The extension flipped it back (-1, +1 line).

After both fixes, the build succeeds on `net48` in SDK-style format. **Task complete:**

![Screenshot: "Task 02 Complete (40%)" — SDK-style conversion done with both behavior-preserving fixes documented, and "Next up — Task 03: ASP.NET Core migration"](images/13-task02-complete.png)

> 💡 **Why this matters:** the extension explicitly flags both fixes as **behavior-preserving** — they restored what the conversion tool dropped, nothing more. The MVC/Razor/WebPages references are intentionally still present; they'll be removed in Task 03 when the project actually moves to ASP.NET Core. Each task does *one thing*, and that discipline is what makes the whole migration debuggable.

Send **"Continue!"** to move on.

---

## 🟠 Task 03 — ASP.NET Core Migration

This is the big one. Task 03 retargets the project to `net10.0` and rewrites all 89 `System.Web.*` API hits — `Global.asax.cs` + `RouteConfig` + `FilterConfig` become `Program.cs`, `BooksController` moves to `Microsoft.AspNetCore.Mvc.Controller` with `IActionResult`, `web.config` becomes `appsettings.json`, Razor views and `_Layout.cshtml` are updated for ASP.NET Core conventions, and the `Microsoft.AspNet.*` packages are dropped.

The extension starts by loading the dedicated MVC migration skill:

![Screenshot: "Continuing to Task 03 — the ASP.NET Core migration. Let me start the task." with Starting task 03-aspnetcore-migration and SKILL.md access prompt for migrating-aspnet-framework-to-core](images/14-task03-skill-access.png)

> ⏰ **This task takes the longest** — expect 20–30 minutes of edits across many files. The extension will work through subtasks (controller migration, startup conversion, Razor updates, config migration) and you'll see a steady stream of file edits in the chat. Resist the urge to interrupt; let it finish the subtask group before reviewing.

When task 03 completes, the project file looks dramatically different. Open `BookCatalog.Web.csproj` and you should see a clean SDK-style file targeting `net10.0` with EF Core and Newtonsoft.Json as the only `PackageReference` entries:

![Screenshot: BookCatalog.Web.csproj — SDK Microsoft.NET.Sdk.Web, TargetFramework net10.0, Nullable disable, ImplicitUsings disable, PackageReferences for Microsoft.EntityFrameworkCore.SqlServer 10.0.8, Microsoft.EntityFrameworkCore.Design 10.0.8, Newtonsoft.Json 13.0.4](images/15-csproj-final.png)

Notice what's *missing*: no more `Microsoft.AspNet.Mvc`, no more `Microsoft.AspNet.Razor`, no more `Microsoft.AspNet.WebPages`, no more `Microsoft.Web.Infrastructure`, no more `<Reference>` HintPaths to `System.Web.*`. All of that is now provided by the ASP.NET Core framework reference (`Microsoft.NET.Sdk.Web`).

> 💡 **Why is EF Core already in here?** Task 03 only handles the ASP.NET Core migration — but in Chapter 01 we asked for "Continue. but change to use EF Core instead of keeping EF6", which moved the EF Core package install up into this task's scope. The actual EF6 → EF Core code conversion still happens in Task 04.

Send **"Continue!"** when the task is complete.

---

## 🟢 Task 04 — EF Core Migration

Task 04 finishes the EF6 → EF Core conversion in the data layer. The package was already swapped in Task 03; this task converts the actual code — `ApplicationDbContext`, the `Book` entity, the controller's data access, and the startup wiring.

When the task completes, you get a compact summary table of every area changed:

![Screenshot: "Task 04 Complete (80%)" with "EF6 → EF Core migration done" table — Packages, DbContext, Initializer, DI, Startup, Controller — each with a Change column, and "Build: 0 errors, 0 warnings. Confirmed no EF6 artifacts remain."](images/16-task04-complete.png)

A quick map of what each row means:

| Area | What changed | Why |
|---|---|---|
| **Packages** | Removed `EntityFramework 6.4.4` → added `Microsoft.EntityFrameworkCore.SqlServer` + `.Design` 10.0.8 | EF6 → EF Core provider |
| **DbContext** | `System.Data.Entity` → `Microsoft.EntityFrameworkCore`; `DbContextOptions` constructor; `OnModelCreating(ModelBuilder)` | EF Core uses options-pattern + new ModelBuilder API |
| **Initializer** | Removed `DropCreateDatabaseIfModelChanges` (no EF Core equivalent); seeding → idempotent `DbInitializer.Seed()` | EF Core has no automatic initializers; use migrations or `EnsureCreated()` |
| **DI** | `AddDbContext<>(UseSqlServer(...))` reading from `IConfiguration` | EF Core integrates with the built-in DI container |
| **Startup** | EF6 init block → DI scope `EnsureCreated()` + `Seed()` | The classic `Application_Start` initializer pattern is gone |
| **Controller** | `BooksController` → constructor injection; removed manual `new` + `Dispose` | EF Core `DbContext` lifecycle is managed by DI |

The extension confirms **0 errors, 0 warnings** and explicitly verifies that no EF6 artifacts remain in the codebase. Send **"Continue!"** to kick off the final task.

---

## 🟢 Task 05 — Final Validation

The last task is a full end-to-end verification: clean build, test discovery, and a writeup of any deferred follow-ups.

![Screenshot: "Continuing to the final task — Task 05: validation. Let me start it." with Starting task 05-final-validation, "Let me do a full solution build and discover any test projects.", Build successful, Discovering test projects](images/17-task05-starting.png)

In Visual Studio's **Output** pane you should see a clean, fast build — everything is now up to date:

![Screenshot: Visual Studio Output pane "Show output from: Build" — "Build started at 18:08... Build: 0 succeeded, 0 failed, 1 up-to-date, 0 skipped — Build completed at 18:08 and took 00,201 seconds"](images/18-build-output-clean.png)

The `1 up-to-date` and `0,201 seconds` build time tells you that **the project compiled fine on the previous task** — Task 05 isn't recompiling, just validating that nothing regressed.

Press **F5** (or **Debug → Start Debugging**) to launch the modernized BookCatalog. The browser opens and the book catalog loads with seeded data:

![Screenshot: BookCatalog running in browser — Book Catalog table with 6 books (Clean Code, Design Patterns, Jurassic Park, Hitchhiker's Guide, Lord of the Rings, Pragmatic Programmer), each ACTIVE with View/Edit/Del actions](images/19-bookcatalog-running.png)

The page even shows your User-Agent string at the bottom — proof that the one `HttpRequestBase.UserAgent` usage from the assessment was successfully migrated to the ASP.NET Core equivalent.

> 💡 **The footer still says "Powered by ASP.NET MVC 5 & Entity Framework 6 · .NET Framework 4.8"** — that's a hardcoded string in `_Layout.cshtml` that the migration didn't touch (it's marketing copy, not API). Updating it is a great "post-upgrade follow-up" task to add to your backlog.

## 📊 Before and After

| Aspect | Before (Chapter 01) | After (Chapter 02) |
|---|---|---|
| **Runtime** | .NET Framework 4.8 | .NET 10 |
| **Project format** | Classic Wap (`.csproj`) | SDK-style (`Microsoft.NET.Sdk.Web`) |
| **Package management** | `packages.config` | `PackageReference` |
| **Web framework** | ASP.NET MVC 5 (`System.Web`) | ASP.NET Core MVC |
| **Startup** | `Global.asax.cs` | `Program.cs` |
| **Configuration** | `web.config` | `appsettings.json` + `IConfiguration` |
| **Data access** | Entity Framework 6 | EF Core 10.0.8 |
| **Build time** | ~1–2 seconds (legacy) | 0.201 seconds (SDK incremental) |

---

## ✅ You're Ready!

You've executed all 5 tasks of the upgrade plan in Guided Mode, watched the extension recover from build failures on its own, and verified that BookCatalog now runs as an SDK-style ASP.NET Core app on .NET 10 with EF Core. In Chapter 03, you'll take this modernized app and deploy it to Azure.

**[Continue to Chapter 03: Going to the Cloud →](../03-cloud/README.md)**

---

## 🔑 Key Takeaways

1. **Guided Mode = commit gates.** Every "Continue!" is a checkpoint — you're never more than one task away from a known-good state.
2. **Task isolation pays off at failure time.** When Task 02's build failed twice, the root cause was immediately obvious: structural conversion mistake, nothing to do with APIs. Isolation makes failures debuggable.
3. **Auto-recovery doesn't mean magic.** The extension caught the failures because it ran a build step after every structural change. The lesson: always verify with a build step between structural changes and API changes.
4. **89 API hits ≠ 89 manual hours.** Most `System.Web.Mvc.*` calls have direct ASP.NET Core equivalents — the extension knows the full mapping table. One 20–30 min task replaced what would have been days of docs-hunting.
5. **The EF6 initializer pattern has no direct EF Core equivalent.** `DropCreateDatabaseIfModelChanges` is gone. The replacement is `EnsureCreated()` + a seed method — simpler and explicit.
6. **`progress-details.md` is your audit trail.** Every task writes findings to this file. If something goes wrong between sessions, it's the first place to look.
7. **Separate structural changes from semantic changes.** Task 02 stayed on `net48` deliberately. Never mix "format changes" and "behavior changes" in the same commit — you'll never know which one broke the build.

---

## 🛠️ Troubleshooting

**Problem:** The chat session expired or VS was closed between Chapter 01 and Chapter 02.

**Solution:** Reopen the solution and re-trigger the Modernize workflow (right-click solution → Modernize). The extension reads the existing `plan.md` and `tasks.md` and resumes from where it left off.

---

**Problem:** A task fails with a file permission error (e.g., "Unable to write to BookCatalog.Web.csproj").

**Solution:** Visual Studio may have the file locked. Try closing and reopening the solution, or stopping the debug session if one is running. Then send "Continue!" again — the extension will retry the file write.

---

**Problem:** Task 02 build keeps failing after the auto-recovery (more than 2 failures).

**Solution:** Open `BookCatalog.Web.csproj` and look for duplicate `<Reference>` entries or a missing `<OutputType>Library</OutputType>` element. You can edit the file manually and then send "Continue!" to rerun the build check.

---

**Problem:** The app starts but immediately throws a `SqlException` (Cannot open database).

**Solution:** The EF Core `EnsureCreated()` call needs a LocalDB instance. Run `sqllocaldb info` in a terminal to confirm LocalDB is available. If not, install SQL Server Express with LocalDB from the Visual Studio installer.

---

## 📚 Learn More

- 📘 [Migrate from ASP.NET MVC to ASP.NET Core MVC](https://learn.microsoft.com/aspnet/core/migration/mvc) — the technical deep dive Task 03 is based on
- 📘 [Port from EF6 to EF Core](https://learn.microsoft.com/ef/efcore-and-ef6/porting/) — what changed between the two ORMs
- 📘 [.NET SDK-style project format](https://learn.microsoft.com/dotnet/core/project-sdk/overview) — why the new csproj is so much shorter
- 📘 [System.Web Adapters for ASP.NET Core](https://learn.microsoft.com/aspnet/core/migration/inc/overview) — the compatibility shim we *didn't* use (and when you might want to)
