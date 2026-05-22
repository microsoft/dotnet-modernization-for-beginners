![Chapter 01: Assessment & Planning](images/chapter-header.png)

You've installed the extension and run your first assessment on a simple sample. Now it's time to tackle a real legacy app: BookCatalog, an ASP.NET MVC 5 application running on .NET Framework 4.8. In this chapter, you'll run a full compatibility assessment, interpret the findings (blockers vs. warnings vs. informational), and generate an upgrade plan that prioritizes the work.

## 🎯 Learning Objectives

By the end of this chapter, you'll have:
- Run a comprehensive compatibility assessment on the BookCatalog legacy app
- Interpreted the compatibility report: distinguished blockers (breaks compilation) from warnings (deprecated but functional) and informational findings (optional improvements)
- Understood what each finding category means for your upgrade timeline and risk profile
- Generated an actionable upgrade plan that prioritizes fixes by impact

> ⏱️ **Estimated Time**: ~45 minutes (20 min assessment scan + 25 min report analysis)

---

## ✅ Prerequisites

**From Previous Chapters:**
- GitHub Copilot app modernization extension installed (Chapter 00)
- Understanding of the 3-phase model: Assess → Plan → Act (Chapter 00)

**For This Chapter:**
- Visual Studio 2022 (17.12 or later)
- .NET Framework 4.8 SDK installed
- .NET 10 SDK installed

---

## 📂 Opening the BookCatalog App

The BookCatalog app is a legacy ASP.NET MVC 5 application that manages a simple book inventory. It uses Entity Framework 6 for data access and targets .NET Framework 4.8. This is the app you'll modernize in Chapter 02.

Open the solution:

1. Navigate to `shared-legacy-app/` in this repo.
2. Open `BookCatalog.sln` in Visual Studio 2022.

**Expected output:**

The solution loads with one project:

```
Solution 'BookCatalog' (1 of 1 project)
  └── BookCatalog (net48)
      ├── Controllers/
      ├── Models/
      ├── Views/
      ├── App_Start/
      └── Web.config
```

Build the solution to ensure it compiles on .NET Framework 4.8:

1. Press **Ctrl+Shift+B** or go to **Build** → **Build Solution**.

**Expected output:**

```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

> 💡 **Tip:** If the build fails, check that the .NET Framework 4.8 SDK is installed. Go to **Tools** → **Get Tools and Features** → **Individual components** → search for ".NET Framework 4.8 SDK" and install it if missing.

---

## 🔍 Running the Assessment

Trigger the extension's assessment workflow:

1. Right-click the **BookCatalog** project in Solution Explorer.
2. Select **GitHub Copilot** → **Assess for Modernization**.
3. Choose target framework: **.NET 10**.
4. Click **Start Assessment**.

**Expected output:**

The extension scans your code, dependencies, and project configuration. This takes 2–5 minutes for a medium-sized app:

![Screenshot: Assessment progress dialog shows "Scanning 42 files... Analyzing NuGet packages... Checking API compatibility..."](images/assessment-progress.png)

When complete, the compatibility report opens in a new tab:

![Screenshot: Compatibility Report shows summary: 12 blockers, 18 warnings, 5 informational](images/assessment-report.png)

---

## 📊 Reading the Compatibility Report

The report groups findings into three categories:

| Category | Meaning | Example | Action Required |
|----------|---------|---------|-----------------|
| **Blockers** | APIs, packages, or patterns that don't exist in .NET 10. Your app won't compile without fixing these. | `System.Web.Mvc.Controller` (replaced by `Microsoft.AspNetCore.Mvc.Controller`) | Must fix before upgrade |
| **Warnings** | Deprecated APIs that still work in .NET 10 but may be removed in future versions or have behavioral changes. | `BinaryFormatter` (deprecated for security reasons) | Should fix soon |
| **Informational** | Recommendations for better performance, modern patterns, or code simplification. | `HttpContext.Current` → `IHttpContextAccessor` (cleaner dependency injection) | Optional |

### Blockers: What Stops the Upgrade

Click the **Blockers** tab in the report. You'll see findings like this:

**Example blocker:**

```
System.Web.Mvc is not available in .NET 10
  └── Found in: BookCatalog/Controllers/HomeController.cs (line 8)
  └── Suggested fix: Migrate to ASP.NET Core MVC. Replace 'System.Web.Mvc.Controller' 
      with 'Microsoft.AspNetCore.Mvc.Controller'.
  └── Impact: High — All controllers inherit from this base class.
```

Blockers break compilation. You must fix these before the app runs on .NET 10.

> ⚠️ **Note:** Some blockers require architectural changes (e.g., replacing `System.Web` with ASP.NET Core). The extension suggests fixes, but you'll need to review and test them carefully.

### Warnings: What Needs Changes

Click the **Warnings** tab:

**Example warning:**

```
Entity Framework 6 is not compatible with .NET 10
  └── Found in: BookCatalog/Models/BookCatalogContext.cs
  └── Suggested fix: Migrate to Entity Framework Core 9 or later.
  └── Impact: Medium — Requires updating DbContext, connection strings, and LINQ queries.
```

Warnings don't break compilation, but they indicate deprecated patterns. If you ignore them, your app may break in future .NET versions or experience security/performance issues.

### Informational Findings: Opportunities

Click the **Informational** tab:

**Example informational finding:**

```
Consider using minimal APIs instead of MVC controllers
  └── Found in: BookCatalog/Controllers/BooksController.cs
  └── Benefit: Minimal APIs reduce boilerplate and improve startup time.
  └── Impact: Low — This is optional. MVC controllers work fine in .NET 10.
```

Informational findings are optional improvements. Fix them if you want to optimize or modernize your patterns, but they won't block the upgrade.

---

## 🗺️ Building Your Upgrade Plan

Once you've reviewed the report, generate an upgrade plan:

1. Click **Generate Upgrade Plan** at the bottom of the compatibility report.
2. The extension creates a prioritized plan: blockers first, then warnings, then informational.

**Expected output:**

The upgrade plan opens in a new tab:

![Screenshot: Upgrade Plan shows Phase 1 (Blockers): 12 tasks, Phase 2 (Warnings): 18 tasks, Phase 3 (Informational): 5 tasks](images/upgrade-plan.png)

### What's in the Plan?

The plan breaks down the work into phases:

| Phase | Tasks | Estimated Effort |
|-------|-------|------------------|
| **Phase 1: Fix Blockers** | Replace `System.Web.Mvc` with ASP.NET Core MVC, migrate Entity Framework 6 to EF Core 9 | 8–12 hours |
| **Phase 2: Fix Warnings** | Replace `BinaryFormatter` with `System.Text.Json`, update deprecated LINQ methods | 4–6 hours |
| **Phase 3: Optional Improvements** | Refactor controllers to minimal APIs, use `IHttpContextAccessor` | 2–4 hours |

> 💡 **Tip:** The extension's effort estimates are based on code complexity and the number of affected files. Treat them as rough guidelines, not hard deadlines.

Export the plan:

1. Click **Export Plan** in the plan tab.
2. Choose format: **Markdown** or **JSON**.
3. Save the file to your project folder.

**Expected output:**

A `UpgradePlan.md` file in your project:

```markdown
# BookCatalog Upgrade Plan

## Phase 1: Fix Blockers (Must Complete)
1. Migrate from System.Web.Mvc to ASP.NET Core MVC
   - Update all controllers to inherit from Microsoft.AspNetCore.Mvc.Controller
   - Replace Web.config with appsettings.json
   ...
```

You can share this plan with your team or import it into your backlog (Azure DevOps, Jira, GitHub Issues).

---

## ✅ You're Ready!

You've run a full assessment on the BookCatalog app, interpreted the compatibility report, and generated a prioritized upgrade plan. You now understand which changes are mandatory (blockers) and which are optional (informational). In Chapter 02, you'll execute the upgrade using the extension's Act workflow.

**[Continue to Chapter 02: Modernizing →](../02-modernizing/README.md)**

---

## 🔑 Key Takeaways

1. Assessment reports categorize findings as blockers (breaks compilation), warnings (deprecated but functional), or informational (optional improvements).
2. Blockers require architectural changes (e.g., replacing `System.Web` with ASP.NET Core). Warnings indicate deprecated patterns. Informational findings are optimization opportunities.
3. The upgrade plan prioritizes work: fix blockers first, then warnings, then informational. The extension estimates effort based on code complexity.
4. Export the plan as Markdown or JSON to share with your team or import into your backlog.

---

## 🛠️ Troubleshooting

**Problem:** The assessment fails with "Unable to analyze project dependencies."

**Solution:** Restore NuGet packages. Right-click the solution in Solution Explorer → **Restore NuGet Packages**. Wait for the restore to complete, then retry the assessment.

---

**Problem:** The compatibility report shows zero blockers but the app won't compile on .NET 10.

**Solution:** The extension analyzes API compatibility, but it doesn't catch every edge case. Run a test build targeting .NET 10 (change `<TargetFramework>` to `net10.0` in the `.csproj` file) to surface additional compilation errors. Add those errors to your upgrade plan manually.

---

**Problem:** The upgrade plan estimates are too low/high for my team's skill level.

**Solution:** The extension's effort estimates assume an intermediate .NET developer. Adjust the estimates based on your team's familiarity with ASP.NET Core and EF Core. Add buffer time for testing and code review.
