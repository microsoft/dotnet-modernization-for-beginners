# .NET Modernization for Beginners

<!-- repo-only:start -->
> [!TIP]
> **Prefer the web experience?** [Open this page on the course website](https://microsoft.github.io/dotnet-modernization-for-beginners/#/overview) for the best reading experience and navigation.
<!-- repo-only:end -->

Use GitHub Copilot in Visual Studio to upgrade a legacy .NET app.
Then plan its move to Azure, Microsoft's cloud platform.

Throughout this course we'll use a sample app named BookCatalog that lets a catalog editor add, inspect, edit, and remove books. Its main list hides inactive books and sorts active books by title.

You'll use the GitHub Copilot modernization for .NET tooling to upgrade the application from .NET Framework 4.8 to .NET 10. You'll then assess and plan its move to Azure.

.NET Framework is the older, Windows-only platform. Modern .NET, including .NET 10, can also run on Linux and macOS.

You'll direct the modernization agent through **assess, decide, plan, change, and verify**.
You'll finish with a working application on .NET 10, plus reports and plans that explain the decisions behind it.

This course assumes C#, basic ASP.NET MVC, Visual Studio, NuGet, and basic Git knowledge. You don't need previous modernization experience.

[**Start: Meet the Book Catalog app and the tools**](02-introduction/README.md) · [Go straight to Setup](03-prerequisites/README.md) · [Run the final upgraded and completed reference app](examples/modernized/README.md)

<a id="-what-youll-learn"></a>
## What you'll learn

By the end of the course, you should be able to:

- Start the modernization workflow in Visual Studio and read its assessment.
- Review the assessment and add an application requirement if needed.
- Review upgrade choices and change a practical instruction in the plan.
- Run the upgrade and review the generated project, startup, and controller changes.
- Launch your upgraded app and try its book forms.
- Assess Azure readiness and edit a migration plan without creating resources.

**You don't need an Azure subscription to complete the course.**

<a id="-prerequisites"></a>
## Prerequisites

Use **Windows, Visual Studio 2026, and PowerShell**.
The legacy app needs ASP.NET web build tools and .NET Framework 4.8 targeting tools.
IIS Express runs the web app locally. SQL Server LocalDB hosts its database.

The .NET software development kit (SDK) supplies tools to build the upgraded app. Use a stable SDK 10 or later.
The .NET 10 runtime runs the built application. You'll also need Git and a GitHub account with Copilot access.

[Setup](03-prerequisites/README.md#check-before-installing) explains how to check existing tools before installing anything. Azure CLI, Node, and Python aren't prerequisites for the required lessons.

## Which Copilot tool are we using?

**GitHub Copilot upgrade** handles the framework upgrade. In Visual Studio, start through **Modernize** or `@Modernize`.

**GitHub Copilot modernization** handles Azure migration. Chapter 07 uses Visual Studio's **Modernize > Migrate to Azure** workflow.

The modernization agent generates the reports and changes through Copilot Chat.
You choose the options, adjust its instructions, and try the result.

<a id="-course-structure"></a>
## Course structure

![A travel-poster route through the seven course chapters, from the starting point to the Azure migration plan.](docs/illustrations/journey-light.svg)

| Chapter | What you do | What you'll learn |
| --- | --- | --- |
| [01: Start here](README.md) | Understand BookCatalog and the course | This page |
| [02: Meet the app and tools](02-introduction/README.md) | Meet BookCatalog and the tools | See and understand the sample app |
| [03: Get ready](03-prerequisites/README.md) | Check your tools and try the app | Get all the pre-reqs and the sample app running |
| [04: Assess the app](04-assessment/README.md) | Read the assessment report and add a requirement if needed | An assessment you've reviewed |
| [05: Choose the plan](05-planning/README.md) | Review options and edit a plan instruction | A plan ready for execution |
| [06: Upgrade and check](06-upgrade-execution/README.md) | Run the upgrade and use the changed app | Your working .NET 10 application |
| [07: Plan for Azure](07-cloud/README.md) | Review the Azure report and edit a migration plan | A cloud plan, without deployed resources |

The seven chapters take you from the starting point through the Azure migration plan.

## Work on your own copy

[Setup](03-prerequisites/README.md#make-your-copy-this-repo) covers cloning and opening your learner workspace. BookCatalog is the continuing project.

Use the supplied demo data. The upgrade rebuilds the demo database and adds the supplied sample books.
Existing books don't need to survive the upgrade. You don't need backups, snapshots, or a data-transfer step for this course.

Tool output varies by version and application. Compare the report's meaning and your app's behavior, not screenshot counts.

## Using the course as a reference

Helping with another application's modernization?
The [modernization reference guide](docs/modernization-reference.md) helps people and coding agents find relevant chapters and distinguish reusable guidance from BookCatalog-specific choices.
It's optional and doesn't add a course step.

## Samples and help

- [Legacy sample quickstart](shared-legacy-app/README.md): run BookCatalog before upgrading it.
- [Completed reference](examples/modernized/README.md): compare your upgrade with a working .NET 10 app.
- [Previous BookCatalog sample run](examples/assessments/bookcatalog/README.md): see earlier reports, decisions, and unfinished checks.
- [Instructor companion](docs/instructor-guide.md): prepare demonstrations and discussions. Optional for self-paced learners.
- [GitHub Copilot upgrade documentation](https://learn.microsoft.com/dotnet/core/porting/github-copilot-upgrade/overview): check the framework-upgrade tooling.
- [GitHub Copilot modernization for Azure](https://learn.microsoft.com/dotnet/azure/migration/appmod/overview): check the Azure workflow.
- [Report a course issue](https://github.com/microsoft/dotnet-modernization-for-beginners/issues): report a problem with these lessons.

## Contributing

Edit chapter READMEs, not generated website content. See [writing guidance](docs/writing.md), [maintainer validation](docs/validation.md), and [website preview instructions](webpage/README.md).

## License

This project is licensed under the terms of the [MIT open source license](LICENSE). Please refer to the `LICENSE` file for the full terms.

Copyright (c) Microsoft Corporation.

Third-party font and tool licenses remain with their respective assets.
