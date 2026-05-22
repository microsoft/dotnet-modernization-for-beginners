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

<!-- Append new learnings below. Each entry is something lasting about the project. -->
