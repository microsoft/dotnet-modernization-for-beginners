# SimpleLegacyApp — Chapter 00 demo

A tiny .NET Framework 4.8 console app used by [Chapter 00](../README.md) to run your **first** GitHub Copilot app modernization assessment.

## What's inside (and why)

| File | Modernization signal |
|------|----------------------|
| `SimpleLegacyApp.csproj` | Targets `net48` — the source framework the extension will assess. |
| `Program.cs` | Uses `System.Web.HttpContext.Current` → **blocker** in .NET 10. |
| `Serialization.cs` | Uses `BinaryFormatter` → **warning** (deprecated, removed in modern .NET). |
| `App.config` | Legacy `ConfigurationManager` settings → informational (move to `appsettings.json`). |

These three signals map 1:1 to the **blocker / warning / informational** categories you'll learn to read in the assessment report.

## Open in Visual Studio 2022 or 2026

1. Open `SimpleLegacyApp.sln`.
2. Right-click the project → **GitHub Copilot → Assess for Modernization**.
3. Pick **.NET 10** as the target.

Then jump back to the [chapter walkthrough](../README.md#-your-first-assessment).

> ⚠️ **Windows required to build.** This project targets .NET Framework 4.8, which only builds on Windows. The Codespaces devcontainer (.NET 10 on Linux) cannot build it. The modernization agent itself is available on macOS and Linux via VS Code or GitHub Copilot CLI, but you'd need a different source project.
