![.NET Modernization for Beginners](./images/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)&ensp;
[![Docs](https://img.shields.io/badge/Docs-GitHub_Copilot-blue)](https://docs.github.com/copilot)&ensp;
[![Discord](https://img.shields.io/badge/Discord-AI_Community-blue?logo=discord)](https://aka.ms/foundry/discord)

🎯 [What You'll Learn](#-what-youll-learn) &ensp; ✅ [Prerequisites](#-prerequisites) &ensp; 🔧 [The Extension](#-the-github-copilot-app-modernization-extension) &ensp; 📚 [Course Structure](#-course-structure)

# .NET Modernization for Beginners -  WIP

> **✨ Take a legacy ASP.NET app from .NET Framework 4.8 to .NET 10 — using AI.**

You've inherited a legacy .NET app. It works, but it's stuck on .NET Framework 4.8. Security patches are getting scarce, modern libraries won't install, and your team can't use the latest language features. Modernizing feels overwhelming: breaking changes, deprecated APIs, package incompatibilities. This course shows you how to do it systematically using the GitHub Copilot app modernization extension — an AI-powered tool that assesses your code, plans the migration, and helps you execute it step by step.

This course is designed for:
- **.NET developers on legacy stacks** — If you're maintaining apps on .NET Framework 4.x, .NET Core 3.1, or .NET 5–7, you'll learn a repeatable upgrade process that works for real-world codebases.
- **Teams planning a migration** — You'll understand the assessment-first approach: how to identify blockers, estimate effort, and prioritize fixes before touching code.
- **Developers new to the GitHub Copilot app modernization extension** — You've used GitHub Copilot for code completion, but this extension is purpose-built for .NET migrations. You'll learn how it differs and when to use it.

## 🎯 What You'll Learn

You'll walk through the full modernization lifecycle: assess a legacy ASP.NET MVC 5 application (the BookCatalog app in this repo), interpret its compatibility report, resolve breaking changes, target .NET 10, and deploy the modernized app to Azure. By the end, you'll have a repeatable workflow you can apply to your own legacy codebases.

## ✅ Prerequisites

| Requirement | Version / Notes |
|-------------|-----------------|
| **Windows** | Windows 11 (22H2 or later) |
| **Visual Studio** | 2022 (17.12 or later) or 2026 |
| **GitHub Copilot subscription** | Active subscription required |
| **.NET Framework 4.8 SDK** | Required to run the legacy sample app |
| **.NET 10 SDK** | Preview or latest release |
| **Git** | Any recent version |
| **Prior experience** | C#, ASP.NET, Git, NuGet fundamentals |

> ⚠️ **Note:** This course targets Windows-only at launch. The GitHub Copilot app modernization extension for Visual Studio 2022 requires Windows. Linux and macOS support is not yet available.

## 🔧 GitHub Copilot Modernization

 GitHub Copilot modernization is a Visual Studio tool that automates .NET migration analysis and code updates. Here's where it fits in the Copilot ecosystem:

| Tool | Purpose | When to Use It |
|------|---------|----------------|
| **GitHub Copilot (code completion)** | Autocomplete code as you type | Daily coding in any language |
| **GitHub Copilot Chat** | Answer questions, generate snippets | When you need explanations or quick code samples |
| **GitHub Copilot app modernization extension** | Assess, plan, and modernize .NET apps | When upgrading legacy .NET codebases to modern frameworks |

This course focuses on the third tool: the extension that runs inside Visual Studio and specializes in .NET migrations.

## 📚 Course Structure

![Learning Path](images/learning-path.png)

| Chapter | Title | What You'll Do |
|:-------:|-------|----------------|
| **00** | 🧭 [Introduction](./00-introduction/README.md) | Install the extension, understand the 3-phase model (Assess → Plan → Act), and run your first assessment on a standalone sample. |
| **01** | 🔍 [Assessment & Planning](./01-assessment/README.md) | Open the BookCatalog legacy app, run the compatibility assessment, interpret blockers vs. warnings, and generate an upgrade plan. |
| **02** | ⚡ [Modernizing](./02-modernizing/README.md) | Execute the extension's Act workflow to migrate BookCatalog to .NET 10, review AI-generated code suggestions, resolve compilation errors, and verify the upgrade. |
| **03** | ☁️ [Going to the Cloud](./03-cloud/README.md) | Use the extension's cloud-migration flow to deploy the modernized BookCatalog app to Azure, verify the deployment, and clean up resources. |

> 🚧 **Work-in-progress note:** Chapter **00** establishes the tone, voice, and style for the entire course going forward. Chapters **01**, **02**, and **03** are currently **skeletons only** — placeholder structure that has not yet been written out, reviewed, or technically validated. Treat them as outlines, not finished content.

## 📖 How This Course Works

**Chapters are sequential.** Chapter 01 builds on the extension installed in Chapter 00. Chapter 02 upgrades the app assessed in Chapter 01. Chapter 03 deploys the modernized output from Chapter 02. Don't skip ahead.

Clone this repo and follow the steps in each chapter's README:

```bash
git clone https://github.com/microsoft/dotnet-modernization-for-beginners.git
cd dotnet-modernization-for-beginners
```

Each chapter includes step-by-step instructions, code samples, expected outputs, and troubleshooting tips. The `shared-legacy-app/` folder contains the BookCatalog app used in Chapters 01–03.

## 🙋 Getting Help

- **Issues:** Found a bug or unclear instruction? [Open an issue](https://github.com/microsoft/dotnet-modernization-for-beginners/issues).
- **Docs:** [GitHub Copilot documentation](https://docs.github.com/copilot) | [.NET 10 migration guide](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-10)
- **Community:** Join the [Azure AI Discord](https://aka.ms/foundry/discord) to connect with other developers.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT. See [LICENSE](LICENSE) for details.

---

**[Start Here: Chapter 00 →](./00-introduction/README.md)**
