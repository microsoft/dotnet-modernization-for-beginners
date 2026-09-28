import { test, expect } from "@playwright/test";
import { chapters, references, sectionAliases } from "../../webpage/scripts/chapters.js";
import { parseRoute } from "../../webpage/scripts/routes.js";
import { zipEntries } from "../content/zip-entries.mjs";

// Published section IDs remain usable even when their content moves to optional reference pages.
const publishedSections = {
  overview: ["net-modernization-for-beginners", "what-youll-learn", "prerequisites",
    "which-copilot-tool-are-we-using", "course-structure", "work-on-your-own-copy",
    "samples-and-help", "contributing", "license", "-what-youll-learn", "-prerequisites", "-course-structure"],
  "00-introduction": ["chapter-00-get-ready-to-modernize", "check-before-installing", "run-the-original-app",
    "choose-the-records-that-must-survive", "check-behavior-with-a-separate-record",
    "checkpoint-what-would-a-build-miss", "save-a-baseline", "what-the-agent-does",
    "optional-your-first-assessment", "before-moving-on", "checkpoint-can-you-explain-the-starting-state",
    "-your-first-assessment"],
  "01-assessment": ["chapter-04-assess-bookcatalog", "ask-for-an-assessment", "read-the-report-in-a-useful-order",
    "separate-compatibility-from-priority", "trace-a-finding-into-the-application",
    "your-decision-can-this-finding-wait", "tell-the-agent-what-must-survive",
    "what-the-numbers-do-not-prove", "save-the-assessment-for-planning", "if-the-assessment-differs-or-fails", "reference"],
  "02-planning": ["chapter-05-choose-the-upgrade-plan", "understand-the-choices",
    "choose-the-ef-approach-deliberately", "your-decision-what-evidence-justifies-ef-core-now",
    "know-which-artifact-you-are-changing", "ask-for-the-plan", "define-runnable-groups",
    "change-one-inadequate-plan-step", "export-the-selected-records-before-the-upgrade",
    "approve-the-plan-not-the-execution", "reference"],
  "03-upgrade-execution": ["chapter-06-upgrade-and-check-the-application", "authorize-one-execution-group",
    "check-the-sdk-and-project-changes", "inspect-responsibilities-not-only-filenames",
    "your-review-did-the-edit-preserve-the-behavior", "rebuild-run-and-repeat-the-checks",
    "preview-copy-and-verify-the-selected-records", "check-the-legacy-source-remains-unchanged",
    "check-your-actual-upgraded-application", "save-a-real-checkpoint", "recover-without-discarding-your-work",
    "make-an-independent-change", "finish-the-local-upgrade", "finish-the-core-workshop"],
  "04-cloud": ["chapter-07-assess-and-plan-for-azure", "what-changes-when-the-app-moves",
    "ask-the-agent-for-cloud-readiness-findings", "compare-the-report-with-the-real-application",
    "choose-a-target-with-a-reason", "your-decision-what-finding-changes-the-plan",
    "generate-a-migration-plan-without-executing-it", "edit-and-reconcile-the-cloud-plan",
    "finish-the-required-course", "earlier-deployment-links", "reference", "chapter-04-prepare-for-azure",
    "check-tools-access-and-costs-first", "prepare-the-application-explicitly",
    "produce-a-schema-from-your-application", "review-the-infrastructure", "your-review-what-can-each-identity-do",
    "provision-the-dedicated-lab", "apply-the-schema-and-application-permissions",
    "publish-your-learner-application", "delete-the-dedicated-lab-group"]
};

async function open(page, route = "#/overview") {
  await page.goto(route);
  await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#article h1")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
}

test("all chapters, references, illustrations, and original section links work", async ({ page }) => {
  const errors = [];
  const anchors = new Map();
  const sectionLinks = [];
  async function collectLinks(path) {
    anchors.set(path, await page.locator("#article [id]").evaluateAll(elements => elements.map(element => element.id)));
    sectionLinks.push(...await page.locator("#article a[href*='?']").evaluateAll(links =>
      links.map(link => new URL(link.href).hash).filter(hash => hash.startsWith("#/") && hash.includes("section="))));
  }
  page.on("pageerror", error => errors.push(error.message));
  for (const chapter of chapters) {
    await open(page, `#/${chapter.slug}`);
    await expect(page).toHaveTitle(new RegExp(chapter.title.replace("&", "&")));
    await expect(page.locator("code.language-mermaid")).toHaveCount(0);
    await collectLinks(chapter.path);
    for (const section of publishedSections[chapter.slug] || []) {
      expect(anchors.get(chapter.path), `${chapter.slug}#${section}`).toContain(section);
    }
    const broken = await page.locator("#article a[href*='?section=']").evaluateAll(links =>
      links.filter(link => {
        const url = new URL(link.href);
        const params = new URLSearchParams(url.hash.split("?")[1]);
        return url.hash.split("?")[0] === location.hash.split("?")[0] && !document.getElementById(params.get("section"));
      }).map(link => link.href));
    expect(broken).toEqual([]);
    for (const [alias, target] of Object.entries(sectionAliases[chapter.slug] || {})) {
      await expect(page.locator(`[id="${alias}"]`)).toBeAttached();
      await expect(page.locator(`[id="${target}"]`)).toBeAttached();
    }
    await expect(page.locator(".course-illustration")).toHaveCount(1);
    for (const image of await page.locator(".course-illustration img").all()) {
      const response = await page.request.get(await image.getAttribute("src"));
      expect(response.ok()).toBeTruthy();
    }
  }
  for (const reference of references) {
    await open(page, `#/reference?path=${encodeURIComponent(reference.path)}`);
    await expect(page.locator("code.language-mermaid")).toHaveCount(0);
    await collectLinks(reference.path);
  }
  for (const hash of sectionLinks) {
    const { chapter, section } = parseRoute(hash);
    expect(anchors.get(chapter.path), `${chapter.path}#${section}`).toContain(section);
  }
  await open(page, "#/overview?section=-prerequisites");
  await expect(page.locator("#-prerequisites")).toBeAttached();
  await open(page, "#/00-introduction?section=-your-first-assessment");
  await expect(page.locator("#-your-first-assessment")).toBeAttached();
  expect(errors).toEqual([]);
});

test("keyboard skip stays in the selected lesson", async ({ page }) => {
  await open(page, "#/01-assessment");
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#\/01-assessment$/);
  await expect(page.locator("#main-content")).toBeFocused();
});

test("legacy reference URLs load content from renamed chapter folders", async ({ page }) => {
  for (const [oldPath, newPath] of [
    ["00-introduction/code/README.md", "02-introduction/code/README.md"],
    ["04-cloud/deployment.md", "07-cloud/deployment.md"]
  ]) {
    const response = page.waitForResponse(url => url.url().includes(`/content/${newPath}`));
    await open(page, `#/reference?path=${encodeURIComponent(oldPath)}`);
    expect((await response).ok()).toBeTruthy();
  }
});

test("the assessment keeps old sections without the removed review-links panel", async ({ page }) => {
  await open(page, "#/01-assessment?section=tell-the-agent-what-must-survive");
  await expect(page.locator("#tell-the-agent-what-must-survive")).toBeAttached();
  await expect(page.locator("#article")).toContainText("Keep it unchanged if it describes the right app and target.");
  await expect(page.locator("#article")).not.toContainText("This section moved.");
  await expect(page.getByText("Earlier detailed-review links", { exact: true })).toHaveCount(0);
  const sourceLink = page.locator(".source-link");
  await expect(sourceLink).toHaveAttribute(
    "href", "https://github.com/microsoft/dotnet-modernization-for-beginners");
  await expect(sourceLink).toHaveAttribute("aria-label", "View the course source on GitHub");
  await expect(sourceLink.locator(".github-mark")).toBeVisible();
  await expect(sourceLink).not.toContainText("Source");
});

test("legacy setup sections reach the current next step without the old links panel", async ({ page }) => {
  await open(page, "#/00-introduction?section=run-the-original-app");
  await expect(page.locator("#run-the-original-app")).toBeAttached();
  await expect(page.getByText("Earlier setup and exercise links", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Next: Get ready in Setup", exact: true }).click();
  await expect(page).toHaveURL(/#\/prerequisites$/);
  await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
  await page.getByRole("link", { name: "Already set up? Run BookCatalog", exact: true }).click();
  await expect(page).toHaveURL(/#\/prerequisites\?section=run-bookcatalog$/);
  await expect(page.locator("#run-bookcatalog")).toBeVisible();
  await expect(page.locator("#article")).not.toContainText("This section moved.");
});

test("code copy preserves the displayed code and reports clipboard failure", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  for (const route of ["#/01-assessment", "#/02-planning", "#/03-upgrade-execution",
    "#/04-cloud", "#/reference?path=07-cloud%2Fdeployment.md",
    "#/reference?path=tools%2FBookCatalog.Data%2FREADME.md"]) {
    await open(page, route);
    const expected = await page.locator("pre code").first().textContent();
    await page.evaluate(() => {
      const write = navigator.clipboard.writeText.bind(navigator.clipboard);
      Object.defineProperty(navigator.clipboard, "writeText", {
        configurable: true, value: text => { window.copiedText = text; return write(text); }
      });
    });
    await page.getByRole("button", { name: "Copy code", exact: true }).first().click();
    await expect(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible();
    expect(await page.evaluate(() => window.copiedText)).toBe(expected);
    // Windows converts clipboard line endings. All other characters must remain unchanged.
    expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n")).toBe(expected);
  }
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, "writeText", {
    configurable: true, value: () => Promise.reject(new Error("blocked"))
  }));
  await page.getByRole("button", { name: "Copy code", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Copy failed", exact: true })).toBeVisible();
  await expect(page.locator("#copy-notice")).toContainText("manually");
});

for (const width of [1440, 390]) {
  test(`Start here completion persists and can be undone at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await open(page);
    await expect(page.locator("#course-progress")).toHaveText("0 of 7 required steps complete");
    await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/overview");
    await expect(page.locator(".chapter-completion")).toContainText("Review the course goals and learning path");
    const button = page.getByRole("button", { name: "Mark step complete", exact: true });
    await expect(button).toHaveAttribute("data-complete", "overview");
    await button.click();
    await expect(page.locator("#course-progress")).toHaveText("1 of 7 required steps complete");
    await expect(page.locator("#chapter-nav a[href='#/overview'] .is-complete")).toHaveCount(1);
    await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/00-introduction");
    expect(await page.locator("#completion-bar").evaluate(element => parseFloat(element.style.width)))
      .toBeCloseTo(100 / 7, 4);
    await page.reload();
    const completed = page.getByRole("button", { name: "Marked complete", exact: true });
    await expect(completed).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#course-progress")).toHaveText("1 of 7 required steps complete");
    await completed.click();
    await page.reload();
    await expect(page.getByRole("button", { name: "Mark step complete", exact: true })).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("#course-progress")).toHaveText("0 of 7 required steps complete");
    await expect(page.locator("#chapter-nav a[href='#/overview'] .is-complete")).toHaveCount(0);
  });
}

test("adding Start here preserves all six existing completions and the resume destination", async ({ page }) => {
  const completed = ["00-introduction", "prerequisites", "01-assessment", "02-planning", "03-upgrade-execution", "04-cloud"];
  await page.addInitScript(completed => {
    const key = "dotnet-modernization-workshop:v2:/workshop/";
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, JSON.stringify({
      version: 3, completed, completionRevisions: Object.fromEntries(completed.map(slug => [slug, 2])),
      previousCompleted: [], previousReading: [], lastVisited: "04-cloud", theme: "dark"
    }));
    localStorage.setItem("unrelated-app", "keep");
  }, completed);
  await open(page);
  await expect(page.locator("#course-progress")).toHaveText("6 of 7 required steps complete");
  await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/04-cloud");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Mark step complete", exact: true }).click();
  await page.reload();
  await expect(page.locator("#course-progress")).toHaveText("7 of 7 required steps complete");
  await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/04-cloud");
  await page.getByRole("button", { name: "Marked complete", exact: true }).click();
  await page.reload();
  await expect(page.locator("#course-progress")).toHaveText("6 of 7 required steps complete");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("dotnet-modernization-workshop:v2:/workshop/")).completed))
    .toEqual(completed);
  expect(await page.evaluate(() => localStorage.getItem("unrelated-app"))).toBe("keep");
});

test("seven required completions include Start here, Setup, and Azure planning", async ({ page }) => {
  for (const chapter of chapters.filter(item => item.core)) {
    await open(page, `#/${chapter.slug}`);
    await page.getByRole("button", { name: "Mark step complete" }).click();
  }
  await page.reload();
  await expect(page.locator("#course-progress")).toHaveText("7 of 7 required steps complete");
  await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/04-cloud");
  await expect(page.locator(".chapter-completion")).toContainText("Azure assessment and migration plan.");
  for (const path of ["07-cloud/deployment.md", "docs/learner-record.md", "docs/data-transfer.md",
    "docs/advanced-checks.md", "docs/author-filter.md", "examples/assessments/bookcatalog/README.md"]) {
    await open(page, `#/reference?path=${encodeURIComponent(path)}`);
    await expect(page.locator("[data-complete]")).toHaveCount(0);
    await expect(page.locator("#course-progress")).toHaveText("7 of 7 required steps complete");
    await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/04-cloud");
  }
});

test("Setup follows the introduction and leads to assessment", async ({ page }) => {
  await open(page, "#/00-introduction");
  await expect(page.locator("#chapter-label")).toHaveText("02 / Core course");
  await page.locator(".pager-grid a[href='#/prerequisites']").click();
  await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#chapter-label")).toHaveText("03 / Core course");
  await expect(page.locator("html")).toHaveAttribute("data-era", "soundcheck");
  await expect(page.locator("#chapter-nav a[aria-current]")).toContainText("Get ready");
  await expect(page.locator(".pager-grid a").first()).toHaveAttribute("href", "#/00-introduction");
  await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/prerequisites");
  await page.locator(".pager-grid a[href='#/01-assessment']").click();
  await expect(page.locator("#chapter-label")).toHaveText("04 / Core course");
  await expect(page.locator("html")).toHaveAttribute("data-era", "1980s");
  await expect(page.locator(".pager-grid a").first()).toHaveAttribute("href", "#/prerequisites");
});

test("revision-2 completions survive while Start here and Setup remain incomplete", async ({ page }) => {
  await page.addInitScript(() => {
    const key = "dotnet-modernization-workshop:v2:/workshop/";
    if (localStorage.getItem(key)) return;
    const completed = ["00-introduction", "01-assessment", "02-planning", "03-upgrade-execution", "04-cloud"];
    localStorage.setItem(key, JSON.stringify({
      version: 3, completed, completionRevisions: Object.fromEntries(completed.map(slug => [slug, 2])),
      previousCompleted: [{ slug: "01-assessment", revision: 1 }], previousReading: [],
      lastVisited: "02-planning", theme: "dark"
    }));
    localStorage.setItem("unrelated-app", "keep");
  });
  await open(page);
  await expect(page.locator("#course-progress")).toHaveText("5 of 7 required steps complete");
  await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/02-planning");
  await expect(page.locator("#chapter-nav .is-complete")).toHaveCount(5);
  await expect(page.locator("#chapter-nav a[href='#/overview'] .is-complete")).toHaveCount(0);
  await expect(page.locator("#chapter-nav a[href='#/prerequisites'] .is-complete")).toHaveCount(0);
  await open(page, "#/prerequisites");
  await expect(page.getByRole("button", { name: "Mark step complete" })).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Mark step complete" }).click();
  await page.reload();
  await expect(page.locator("#course-progress")).toHaveText("6 of 7 required steps complete");
  expect(await page.evaluate(() => localStorage.getItem("unrelated-app"))).toBe("keep");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("dotnet-modernization-workshop:v2:/workshop/"))))
    .toMatchObject({ completionRevisions: { prerequisites: 2 }, previousCompleted: [{ slug: "01-assessment", revision: 1 }] });
});

test("migration and reset preserve unrelated storage", async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("fixture-started")) {
      localStorage.setItem("dotnet-modernization-course-progress", '["01-assessment"]');
      localStorage.setItem("unrelated-app", "keep");
      localStorage.setItem("fixture-started", "true");
    }
  });
  await open(page, "#/01-assessment");
  await expect(page.locator("#course-progress")).toHaveText("0 of 7 required steps complete");
  await expect(page.locator("#storage-notice")).toContainText("previous reading");
  await page.getByRole("button", { name: "Mark step complete" }).click();
  page.once("dialog", dialog => dialog.dismiss());
  await page.getByRole("button", { name: "Reset progress" }).click();
  await expect(page.locator("#course-progress")).toContainText("1 of 7");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Reset progress" }).click();
  await expect(page.locator("#course-progress")).toContainText("0 of 7");
  expect(await page.evaluate(() => localStorage.getItem("unrelated-app"))).toBe("keep");
  expect(await page.evaluate(() => localStorage.getItem("dotnet-modernization-course-progress"))).toBe('["01-assessment"]');
});

test("blocked storage leaves a clear notice and usable completion", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
  });
  await open(page, "#/01-assessment");
  await page.getByRole("button", { name: "Mark step complete" }).click();
  await expect(page.locator("#storage-notice")).toContainText("this visit only");
  await expect(page.locator("#course-progress")).toContainText("1 of 7");
});

test("failed lesson fetch shows a retry without a false completion", async ({ page }) => {
  await page.route("**/content/04-assessment/README.md", route => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("#/01-assessment");
  await expect(page.getByRole("alert")).toContainText("HTTP 503");
  await expect(page.locator("[data-complete]")).toHaveCount(0);
  await page.unroute("**/content/04-assessment/README.md");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator("#article h1")).toContainText("Chapter 04");
});

test("mobile drawers trap focus and restore it on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  await expect(page.locator("#course-nav")).toHaveJSProperty("inert", true);
  await page.getByRole("button", { name: "Chapters", exact: true }).click();
  await expect(page.locator("#course-nav")).toHaveJSProperty("inert", false);
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#course-nav a").last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Chapters", exact: true })).toBeFocused();
  await expect(page.locator("#course-nav")).toHaveJSProperty("inert", true);
  await page.getByRole("button", { name: "On this page", exact: true }).click();
  await expect(page.locator("#page-outline")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "On this page", exact: true })).toBeFocused();
});

test("theme choice persists and supports old theme links", async ({ page }) => {
  await open(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await open(page, "?clawpilotTheme=light#/overview");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("local assets, layout, contrast, and code remain usable", async ({ page }) => {
  const remote = [];
  const isAnalytics = url => url.hostname === "clarity.ms"
    || url.hostname.endsWith(".clarity.ms")
    || url.hostname === "c.bing.com";
  await page.route(isAnalytics, route => route.abort());
  page.on("request", request => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4189" && !isAnalytics(url)) remote.push(request.url());
  });
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await open(page, `?clawpilotTheme=${theme}#/04-cloud`);
      const layout = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth, viewport: innerWidth,
        codes: [...document.querySelectorAll("pre")].map(element => ({
          width: element.getBoundingClientRect().width, scroll: getComputedStyle(element).overflowX
        }))
      }));
      expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
      expect(layout.codes.every(code => code.width <= width && code.scroll === "auto")).toBeTruthy();
      const ratio = await page.evaluate(() => {
        const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number).map(n => n / 255);
        const lum = color => rgb(color).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
          .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
        const text = getComputedStyle(document.querySelector("#article p"));
        const background = getComputedStyle(document.querySelector("#main-content"));
        const a = lum(text.color), b = lum(background.backgroundColor);
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      });
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  const download = await page.request.get("downloads/samples.zip");
  expect(download.ok()).toBeTruthy();
  const entries = zipEntries(await download.body());
  expect(entries.has("tools/BookCatalog.Data/BookCatalog.Data.csproj")).toBeTruthy();
  expect(entries.has("tests/BookCatalog.Data.Tests/BookCatalog.Data.Tests.csproj")).toBeTruthy();
  expect(entries.has("docs/learner-record.md")).toBeTruthy();
  expect(entries.has("07-cloud/deployment.md")).toBeTruthy();
  expect([...entries.keys()].some(path => path.includes(".bookcatalog-lab"))).toBeFalsy();
  expect(remote).toEqual([]);
});

test("earlier completions remain history while theme and valid resume survive", async ({ page }) => {
  await page.addInitScript(() => {
    const key = "dotnet-modernization-workshop:v2:/workshop/";
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, JSON.stringify({
      version: 2, completed: ["00-introduction", "01-assessment", "02-planning", "03-upgrade-execution", "04-cloud"],
      previousReading: [], lastVisited: "02-planning", theme: "dark"
    }));
  });
  await open(page);
  await expect(page.locator("#course-progress")).toHaveText("0 of 7 required steps complete");
  await expect(page.locator("#storage-notice")).toContainText("history");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/02-planning");
  await page.locator("#resume-link").click();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1990s");
  await expect(page.getByRole("button", { name: "Mark step complete" })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Mark step complete" }).click();
  await page.reload();
  await expect(page.locator("#course-progress")).toHaveText("1 of 7 required steps complete");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("dotnet-modernization-workshop:v2:/workshop/"))))
    .toMatchObject({ completionRevisions: { "02-planning": 2 }, previousCompleted: expect.any(Array) });
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.reload();
  await expect(page.locator("#course-progress")).toHaveText("0 of 7 required steps complete");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("unchanged revision marks survive a later exercise revision", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("dotnet-modernization-workshop:v2:/workshop/", JSON.stringify({
      version: 3, completed: ["00-introduction", "01-assessment"],
      completionRevisions: { "00-introduction": 2, "01-assessment": 1 },
      previousCompleted: [], previousReading: [], lastVisited: "00-introduction", theme: "dark"
    }));
  });
  await open(page);
  await expect(page.locator("#course-progress")).toHaveText("1 of 7 required steps complete");
  await expect(page.locator("#chapter-nav a[href='#/00-introduction'] .is-complete")).toBeVisible();
  await expect(page.locator("#chapter-nav a[href='#/01-assessment']")).toContainText("Earlier exercise completed");
});

test("support references stay outside the required chapter path", async ({ page }) => {
  await open(page, "#/03-upgrade-execution");
  await expect(page.locator(".optional-references")).toHaveCount(0);
  await expect(page.locator("#chapter-nav")).not.toContainText("Optional practice");
  await expect(page.locator("#resume-link")).toHaveAttribute("href", "#/03-upgrade-execution");
  await open(page, "#/reference?path=docs%2Fvalidation.md&section=behavior-contract");
  await expect(page.locator("#behavior-contract")).toBeAttached();
  await expect(page.locator("#article")).not.toContainText("This section moved.");
  await open(page, "#/reference?path=webpage%2FREADME.md&section=workshop-website");
  await expect(page.locator("#workshop-website")).toBeAttached();
  await expect(page.locator("#article")).not.toContainText("This section moved.");
});
