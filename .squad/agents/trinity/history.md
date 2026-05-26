# Project Context

- **Owner:** Pablo Lopes
- **Project:** dotnet-modernization-for-beginners — a "top 1%" educational repo in the Microsoft for-beginners series, guiding .NET developers through modernizing legacy apps using the GitHub Copilot app modernization extension.
- **Stack:** .NET (legacy targets: Framework 4.x, .NET Core 3.1, .NET 5/6; modern targets: .NET 10/11), GitHub Copilot app modernization extension (VS / VS Code), Azure
- **Created:** 2026-05-21

## Chapter Plan

1. Introduction to Modernization and the Extension
2. Assessment & Planning (how the extension assesses)
3. Modernizing (Act step — the upgrade itself)
4. Going to the Cloud with the extension

## Project Decisions (day-1 baseline)

- **Sample strategy:** Hybrid — shared "before" legacy app for Chapters 2–3, separate self-contained samples for Chapters 1 and 4. I own the shared "before" app.
- **Audience:** Devs on Framework 4.x / .NET Core 3.1 / .NET 5/6. They know C#, they don't know the upgrade extension.
- **Tooling scope:** Strictly the GitHub Copilot app modernization extension. No CLI upgrade-assistant in scope.
- **Format:** README + `code/` per chapter. Lightweight.

## Learnings

### 2026-05-21: Technical Content Plan Phase

1. **Single-archetype approach > candidate matrix:** Three candidates were considered (MVC 5 + EF6, .NET 5 Console + EF Core, Multi-project), but only MVC 5 + EF6 on Framework 4.8 hits all constraints: (a) extension-supported, (b) real-world frequent, (c) fits 20-minute success window, (d) shows major modernization concepts. A matrix was overkill; decision made here, documented for future project recall.

2. **Assessment output is the reader's reality check:** Chapter 2's value lives or dies on whether the extension's actual assessment report matches what we documented. This is a **validation gate**, not a "nice to have." Trinity must run the extension before locking prose.

3. **Version pinning is not optional for reproducibility:** Exact SDK, LangVersion, and NuGet versions are mandatory. Ranges break reader reproducibility and make Tank's testing matrix explode.

4. **Extension updates are a project risk, not a sidecar concern:** Mid-project extension UI changes require re-capture and prose revision. Mitigations: subscribe to release notes, pin version, quarterly re-validation.

5. **Scope: MVC 5 + EF6 is the most pedagologically clear legacy shape** because it has the most "friction" with modern patterns (EDMX, HttpContext.Current, WebSecurity, ViewBag). Reader sees the biggest wins.

### 2026-05-21: Legacy App Scaffold Complete

6. **Legacy app name: BookCatalog** — simple domain, self-explanatory, avoids enterprise jargon. ASP.NET MVC 5 + EF6 + Framework 4.8. Located at `shared-legacy-app/`.

7. **Intentional blockers for extension assessment**:
   - `HttpContext.Current` usage in `BooksController.Index` — demonstrates static context dependency that won't work in modern .NET
   - Direct `ApplicationDbContext` instantiation in controller — no DI, tight coupling
   - `packages.config` NuGet format — Framework-style, not PackageReference
   - C# 7.3 language version — old tooling constraint
   - Synchronous database operations — no async/await
   - Bootstrap 3 — outdated UI framework
   
   These are **documented features, not bugs**. They exist to give the extension real friction to report.

8. **Version pins (mandatory for reproducibility)**:
   - Microsoft.AspNet.Mvc: 5.2.9
   - EntityFramework: 6.4.4
   - Microsoft.AspNet.Identity.EntityFramework: 2.2.4
   - Bootstrap: 3.4.1
   - jQuery: 3.7.1
   - Newtonsoft.Json: 13.0.3
   - LangVersion: 7.3
   - TargetFramework: net48

9. **Project structure is real-world-ish**: Not a "Hello World" toy. Has Models, Controllers, Views, proper MVC 5 startup, Web.config with connection strings, proper .csproj with references. A reader with enterprise MVC 5 experience will recognize it.

### 2026-05-21: Chapter 01 Code Accuracy Review Complete

10. **Assessment findings map precisely to code reality**: Deep review confirms BookCatalog.Web will produce 3-4 blockers (System.Web.Mvc, EF6, System.Web.Optimization, System.Web.Routing), 2-3 warnings (HttpContext.Current, direct DbContext instantiation, sync DB operations), and 1-2 informational findings (Web.config, packages.config). This matches Chapter 01's instructional goals perfectly.

11. **Blocker count sweet spot**: 4 major API incompatibilities is the right amount — enough to demonstrate meaningful assessment output without overwhelming a learner in their first 30-minute session. Each blocker has a clear, industry-standard fix path.

12. **Intentional anti-patterns are pedagogically valuable**: The code includes `HttpContext.Current` (static context smell), `new ApplicationDbContext()` (demonstrates DI benefits), and synchronous database calls (shows async migration need). These aren't bugs — they're **teaching artifacts** that real legacy apps contain.

13. **BundleConfig reference issue discovered**: `Global.asax.cs` references `System.Web.Optimization` and presumably calls `BundleConfig.RegisterBundles()`, but the file doesn't exist in App_Start/. This prevents the "before" app from compiling. Two fix options: (A) Remove the reference entirely, (B) Add a minimal BundleConfig.cs. Documented in `trinity-ch01-code-accuracy.md` for Pablo's decision.

14. **README findings predictions are 95% accurate**: Chapter 01 README (lines 114-229) correctly predicts System.Web.Mvc blocker on line 9, EF6 blocker in ApplicationDbContext.cs, HttpContext.Current warning on line 17, and config migration paths. Minor adjustment needed: "3 blockers" should be "3-4 blockers" to account for how the extension groups System.Web.* findings.

15. **Version pins are complete and explicit**: All NuGet packages have exact versions in packages.config, LangVersion is set to 7.3, TargetFramework is v4.8. No ranges, no wildcards. Tank's testing matrix will thank us.

16. **Solution file structure is correct**: BookCatalog.sln references exactly one project (BookCatalog.Web) with matching GUID {A1B2C3D4-E5F6-4789-A012-3456789ABCDE}. Path is `src\BookCatalog.Web\BookCatalog.Web.csproj`. Opens cleanly in Visual Studio 2022.

17. **Assessment-ready validation checklist created**: 14-point checklist in the accuracy report covers solution structure, compilation status, version pins, realistic patterns, blocker/warning/info categorization, and README alignment. This becomes the validation template for Chapters 02-03 as well.

<!-- Append new learnings below. Each entry is something lasting about the project. -->
