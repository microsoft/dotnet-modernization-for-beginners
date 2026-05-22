# Project Context

- **Owner:** Pablo Lopes
- **Project:** dotnet-modernization-for-beginners — a "top 1%" educational repo in the Microsoft for-beginners series.
- **Stack:** .NET (legacy: Framework 4.x, .NET Core 3.1, .NET 5/6; modern: .NET 10/11), GitHub Copilot app modernization extension, Azure
- **Created:** 2026-05-21

## My Chapter

**Chapter 4: Going to the Cloud with the extension.** Separate self-contained sample (not the shared "before" app from Chapters 2–3).

## Project Decisions (day-1 baseline)

- **Cloud target:** Whatever the extension's cloud-migration flow targets by default. Follow the tool — don't pre-decide App Service vs Container Apps.
- **Audience:** Devs on older .NET who may not have deployed to Azure recently. Assume Azure account but not Azure expertise.
- **Format:** Lightweight — README + `code/` folder. Include prerequisite setup and cleanup sections.
- **Tooling scope:** Strictly the GitHub Copilot app modernization extension.

## Learnings

### 2026-05-21: Chapter 4 Cloud Plan — First Draft

1. **Extension cloud-migration flow is TBD.** Tank must validate that the GitHub Copilot app modernization extension actually has a cloud-migration workflow (vs. just assessment + modernization). If it's incomplete or buggy, we have a fallback: manual deployment via Azure portal + CLI.

2. **Chapter 4 sample app must be separate.** Trinity's shared legacy app (Chapters 2–3) will be modernized in-place. Chapter 4 uses a pre-built modern copy so readers focus on cloud deployment, not code fixes. Morpheus approved this trade-off in his master plan.

3. **Cleanup is not optional.** Beginners will forget to delete resources and get surprise Azure bills. Chapter 4 treats cleanup as a mandatory section with step-by-step walkthrough, not a footnote.

4. **Free tier is the guardrail.** Default to Azure App Service Free tier ($0/month, quota-protected) so readers can't accidentally overspend. If extension defaults to paid tiers, we recommend free tier in the walkthrough and note it in prerequisites.

5. **Cost honesty up front.** Readers need to know: (a) zero cost on free tier, (b) $25–35/month if they leave it running after free credits, (c) how to delete everything to get back to $0. This prevents mistrust.

6. **Out-of-scope is a feature.** Azure is infinite (identity, caching, messaging, APIs, ML, HA, multi-region, etc.). Explicitly naming what we refuse to cover (with links to follow-on learning) gives readers a clear boundary and doesn't frustrate them when something's missing.

7. **Risk of incomplete extension is real.** If the extension's cloud workflow hangs, times out, or doesn't inject connection strings correctly, Tank must catch it during validation. Fallback is manual Azure deployment, which is less slick but more reliable.

8. **Validation matrix must include Azure free account.** Can't test Chapter 4 on a production subscription; need a real free Azure account to verify: sign-in flow, free tier offerings, cost estimation, cleanup (deletion).

<!-- Append new learnings below. Each entry is something lasting about the project. -->
