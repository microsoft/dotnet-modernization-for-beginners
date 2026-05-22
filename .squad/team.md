# Squad Team

> dotnet-modernization-for-beginners

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| 🏗️ Morpheus | Lead / Curriculum Architect | `.squad/agents/morpheus/charter.md` | Active |
| 🔧 Trinity | .NET Modernization Engineer | `.squad/agents/trinity/charter.md` | Active |
| 📝 Switch | DevRel / Technical Writer | `.squad/agents/switch/charter.md` | Active |
| ☁️ Niobe | Cloud Engineer | `.squad/agents/niobe/charter.md` | Active |
| 🧪 Tank | Tester / QA | `.squad/agents/tank/charter.md` | Active |
| 📋 Scribe | Session Logger | `.squad/agents/scribe/charter.md` | Active |
| 🔄 Ralph | Work Monitor | — | Active |

## Project Context

- **Owner:** Pablo Lopes
- **Project:** dotnet-modernization-for-beginners — a "top 1%" educational repo in the Microsoft for-beginners series, guiding .NET developers through modernizing legacy apps using the GitHub Copilot app modernization extension.
- **Stack:** .NET (legacy targets: Framework 4.x, .NET Core 3.1, .NET 5/6; modern targets: .NET 10/11), GitHub Copilot app modernization extension (VS / VS Code), Azure
- **Reference style:** [Generative-AI-for-beginners-dotnet](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)
- **Created:** 2026-05-21

## Chapter Plan

1. **Introduction to Modernization and the Extension** — separate self-contained sample
2. **Assessment & Planning** — shared "before" legacy app
3. **Modernizing (Act step)** — shared "before" legacy app (continues from Chapter 2)
4. **Going to the Cloud with the extension** — separate self-contained sample

## Project Decisions (day-1 baseline)

- **Sample strategy:** Hybrid — shared legacy app for Chapters 2–3, separate samples for Chapters 1 & 4
- **Audience:** Intermediate .NET devs on Framework 4.x / .NET Core 3.1 / .NET 5/6
- **Tooling scope:** Strictly the GitHub Copilot app modernization extension (no upgrade-assistant CLI, no AppCAT)
- **Cloud target:** Whatever the extension's default cloud-migration flow targets — follow the tool
- **Chapter format:** Lightweight — README walkthrough + `code/` folder per chapter (no quizzes, no assignments)
