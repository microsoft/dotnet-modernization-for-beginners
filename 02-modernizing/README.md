![Chapter 02: Modernizing](images/chapter-header.png)

You've assessed the BookCatalog app and built an upgrade plan. Now comes the transformation: you'll execute the extension's Act workflow to migrate the app from .NET Framework 4.8 to .NET 10. The extension generates code suggestions; you review and accept (or override) each one. By the end, the app compiles and runs on .NET 10.

## 🎯 Learning Objectives

By the end of this chapter, you'll have:
- Executed the extension's Act workflow using the upgrade plan from Chapter 01
- Reviewed AI-generated code suggestions in the diff view and understood when to accept vs. override
- Resolved compilation errors after applying the suggestions (namespace changes, removed APIs)
- Verified that the modernized BookCatalog app compiles and runs on .NET 10

> ⏱️ **Estimated Time**: ~45 minutes (10 min Act execution + 25 min code review + 10 min testing)

---

## ✅ Prerequisites

**From Previous Chapters:**
- Completed assessment and upgrade plan (Chapter 01)
- BookCatalog solution open in Visual Studio 2022 or 2026
- Upgrade plan file saved (`UpgradePlan.md` or `UpgradePlan.json`)

**For This Chapter:**
- Familiarity with C# code diffs and version control
- Understanding of ASP.NET MVC basics (controllers, views, routing)

> 💡 **Tip:** Commit your current work before starting the Act workflow. This creates a snapshot you can revert to if something goes wrong.

---

## ⚡ Starting the Modernization

Trigger the extension's Act workflow:

1. Open the **GitHub Copilot** menu in Visual Studio.
2. Select **Modernize Application** → **Execute Upgrade Plan**.
3. Choose the upgrade plan file you generated in Chapter 01 (`UpgradePlan.md`).
4. Confirm target framework: **.NET 10**.
5. Click **Start Modernization**.

**Expected output:**

The extension queues code suggestions based on the upgrade plan. This takes 2–3 minutes:

![Screenshot: Modernization progress dialog shows "Processing blockers... Updating project files... Generating refactorings..."](images/modernization-progress.png)

When complete, the **Suggestions** pane opens with a list of proposed changes:

![Screenshot: Suggestions pane shows 42 pending changes grouped by file](images/suggestions-pane.png)

---

## 👀 Reviewing the Suggestions

The Suggestions pane groups changes by file. Click a file to see the diff:

**Example suggestion:**

```diff
File: BookCatalog/Controllers/HomeController.cs

- using System.Web.Mvc;
+ using Microsoft.AspNetCore.Mvc;

- public class HomeController : Controller
+ public class HomeController : ControllerBase
  {
-     public ActionResult Index()
+     public IActionResult Index()
      {
          return View();
      }
  }
```

**What changed:**
1. `System.Web.Mvc` → `Microsoft.AspNetCore.Mvc` (namespace change)
2. `Controller` → `ControllerBase` (ASP.NET Core base class)
3. `ActionResult` → `IActionResult` (interface-based return type)

Each suggestion includes:
- **What changed** (the diff)
- **Why it changed** (e.g., "System.Web.Mvc is not available in .NET 10")
- **Confidence score** (High, Medium, Low) — how certain the AI is that the change is correct

### When to Accept

Accept suggestions when:
- The confidence score is **High** and the change is straightforward (e.g., namespace updates).
- The diff preserves your business logic — no data transformations or control flow changes.
- You recognize the pattern from the upgrade plan (e.g., replacing `HttpContext.Current`).

To accept:

1. Review the diff.
2. Click **Accept** at the bottom of the suggestion.
3. The change applies immediately.

### When to Override

Override suggestions when:
- The confidence score is **Low** and the change looks incorrect.
- The AI suggests a pattern that doesn't fit your architecture (e.g., replacing a singleton with dependency injection when you don't use DI).
- You spot a bug in the generated code (e.g., incorrect null handling).

To override:

1. Click **Reject**.
2. Edit the code manually in the main editor.
3. Mark the suggestion as **Resolved**.

> ⚠️ **Note:** Rejected suggestions disappear from the pane. If you later decide you need the suggestion, you'll have to regenerate it manually using GitHub Copilot Chat (`@workspace /fix`).

---

## 🔧 Handling Compilation Errors

After applying all suggestions, build the project:

1. Press **Ctrl+Shift+B** or go to **Build** → **Build Solution**.

**Expected output (first build):**

```
Build FAILED.
    18 Error(s)
    3 Warning(s)
```

This is normal. The extension generates suggestions for major blockers, but some edge cases require manual fixes. Common errors:

**Error 1: Missing namespace**

```
Error CS0246: The type or namespace name 'HttpContext' could not be found
  └── Location: BookCatalog/Controllers/BooksController.cs, line 22
```

**Fix:** Add the missing `using` directive:

```csharp
using Microsoft.AspNetCore.Http;
```

**Error 2: Incompatible method signature**

```
Error CS1503: Argument 1: cannot convert from 'string' to 'Microsoft.Extensions.Logging.ILogger'
  └── Location: BookCatalog/Services/BookService.cs, line 45
```

**Fix:** The extension replaced a constructor parameter but didn't update the call site. Update the caller to pass the correct type (or refactor to use dependency injection).

**Error 3: Package not restored**

```
Error NU1101: Unable to find package 'Microsoft.AspNetCore.Mvc'. No packages exist with this ID in source(s): nuget.org
```

**Fix:** Restore NuGet packages. Right-click the solution → **Restore NuGet Packages**.

> 💡 **Tip:** Use GitHub Copilot Chat to fix compilation errors faster. Open the Chat pane, paste the error message, and ask: "How do I fix this error in .NET 10?"

### The Fix Loop

1. Apply suggestions from the extension.
2. Build the project.
3. Fix compilation errors (use Copilot Chat for help).
4. Repeat steps 2–3 until the build succeeds.

**Expected output (final build):**

```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

---

## ✅ Verifying the Upgrade

Run the modernized app:

1. Press **F5** or go to **Debug** → **Start Debugging**.

**Expected output:**

The app launches and opens in your browser:

![Screenshot: Browser shows BookCatalog home page at https://localhost:5001](images/app-running.png)

Test critical user flows:
- Navigate to `/Books` — does the book list load?
- Create a new book — does it save to the database?
- Edit an existing book — do changes persist?

Check the console for runtime exceptions:

```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

If you see errors (e.g., `NullReferenceException`), review the stack trace and fix the issue. Common runtime errors:
- Dependency injection not configured (missing `services.AddDbContext` in `Program.cs`).
- Connection string not migrated from `Web.config` to `appsettings.json`.

> ⚠️ **Note:** Some features may behave differently in .NET 10 (e.g., default JSON serialization settings). Test thoroughly to catch behavioral changes.

---

## ✅ You're Ready!

You've executed the extension's Act workflow, reviewed and accepted AI-generated suggestions, resolved compilation errors, and verified that the modernized BookCatalog app runs on .NET 10. The upgrade is complete! In Chapter 03, you'll deploy this modernized app to Azure.

**[Continue to Chapter 03: Going to the Cloud →](../03-cloud/README.md)**

---

## 🔑 Key Takeaways

1. The Act workflow generates code suggestions based on the upgrade plan. You review and accept/reject each suggestion — the AI helps, but you stay in control.
2. Confidence scores (High, Medium, Low) indicate how certain the AI is about a change. Accept High-confidence suggestions; scrutinize Low-confidence ones.
3. Compilation errors after applying suggestions are normal. The extension handles major blockers, but you'll need to fix edge cases manually.
4. Test critical user flows after the upgrade to catch behavioral changes (e.g., JSON serialization differences, DI configuration issues).

---

## 🛠️ Troubleshooting

**Problem:** The Act workflow generates zero suggestions even though the upgrade plan lists blockers.

**Solution:** Ensure the upgrade plan file is correctly loaded. Go to **GitHub Copilot** → **Settings** → **Upgrade Plan** and verify the file path. If the plan is missing, regenerate it in Chapter 01.

---

**Problem:** The build succeeds but the app crashes on startup with "Unable to resolve service for type 'IHttpContextAccessor'."

**Solution:** ASP.NET Core requires explicit dependency injection registration. Add this to `Program.cs`:

```csharp
builder.Services.AddHttpContextAccessor();
```

This registers `IHttpContextAccessor` so the DI container can inject it into your controllers.

---

**Problem:** Some views (`.cshtml` files) reference `@Html.Raw` and throw runtime errors.

**Solution:** ASP.NET Core changed HTML encoding defaults. Replace `@Html.Raw(model.Content)` with `@model.Content` if the content is already HTML-encoded. If you need to disable encoding explicitly, use `@Html.Raw()` but validate that the content is safe (no user-generated HTML).
