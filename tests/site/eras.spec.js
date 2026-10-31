import { test, expect } from "./fixtures.js";
import { chapters } from "../../webpage/scripts/chapters.js";
import { eraPalette } from "../../webpage/scripts/eras.js";
import { illustrations, illustrationPath } from "../../webpage/scripts/illustrations.js";
import classic from "../../webpage/seasons/classic/season.js";
import halloween from "../../webpage/seasons/halloween/season.js";

async function ready(page, chapter, mode = "light", season = null) {
  await page.goto(`?${season ? `season=${season}&` : ""}clawpilotTheme=${mode}#/${chapter.slug}`);
  await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator("html")).toHaveAttribute("data-era", chapter.era);
  await expect(page.getByRole("alert")).toHaveCount(0);
}

for (const season of [classic, halloween]) for (const chapter of chapters) {
  for (const mode of ["light", "dark"]) {
    test(`${season.id} ${chapter.era} ${mode}: direct route, accents, contrast, and narrow layout`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await ready(page, chapter, mode, season.id);
      await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
      await expect(page.locator("html")).toHaveAttribute("data-season", season.id);
      expect(await page.locator("html").evaluate(element => element.style.getPropertyValue("--paper")))
        .toBe(eraPalette(chapter.era, mode, season).paper);
      const art = page.locator(chapter.slug === "overview" ? ".hero-art:visible" : ".era-art:visible");
      await expect(art).toBeVisible();
      await expect.poll(() => art.evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
      const box = await art.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(150);
      expect(box.width).toBeGreaterThanOrEqual(140);
      const badContrast = await page.evaluate(() => {
        const components = value => (value.match(/[\d.]+/g) || []).map(Number);
        const luminance = values => values.slice(0, 3).map(n => n / 255)
          .map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
          .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
        const bad = [];
        for (const element of document.querySelectorAll(
          "p,a,button,summary,th,td,h1,h2,h3,small,figcaption,.chapter-label,.code-toolbar>span")) {
          if (!element.getClientRects().length) continue;
          const style = getComputedStyle(element);
          let ancestor = element;
          let background;
          while (ancestor) {
            background = components(getComputedStyle(ancestor).backgroundColor);
            if (background.length === 3 || background[3] === 1) break;
            ancestor = ancestor.parentElement;
          }
          if (!ancestor) continue;
          const a = luminance(components(style.color));
          const b = luminance(background);
          const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          const large = parseFloat(style.fontSize) >= 24 ||
            (Number(style.fontWeight) >= 700 && parseFloat(style.fontSize) >= 18.66);
          if (ratio < (large ? 3 : 4.5)) bad.push({ text: element.textContent.slice(0, 50), ratio });
        }
        return bad;
      });
      expect(badContrast).toEqual([]);
      if (chapter.slug !== "overview") {
        const button = page.getByRole("button", { name: "Mark step complete" });
        await button.focus();
        expect(await button.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
        await button.hover();
        await button.click();
        await expect(page.getByRole("button", { name: "Marked complete" })).toHaveAttribute("aria-pressed", "true");
      }
      for (const width of [390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await expect(art).toBeVisible();
        expect((await art.boundingBox()).height).toBeGreaterThanOrEqual(140);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
      const overflowingCode = await page.locator("pre").evaluateAll(elements =>
        elements.filter(element => getComputedStyle(element).overflowX !== "auto").length);
      expect(overflowingCode).toBe(0);
    });
  }
}

test("era follows history and Resume without changing color mode", async ({ page }) => {
  await ready(page, chapters[1], "dark");
  await page.locator("#chapter-nav a[href='#/01-assessment']").click();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1980s");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1970s");
  await page.goForward();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1980s");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1980s");
  await page.locator(".brand").click();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1960s");
  await page.locator("#resume-link").click();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1980s");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Use light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-era", "1980s");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("soundcheck has themed poster headers, readable instructions, and no decade badge", async ({ page }) => {
  const chapter = chapters.find(item => item.slug === "prerequisites");
  await ready(page, chapter);
  await expect(page.locator(".era-art:visible")).toHaveAttribute("src", /era-soundcheck-light\.svg$/);
  await expect(page.locator("#era-label")).toHaveCount(0);
  expect(await page.locator("#article p").first().evaluate(element => getComputedStyle(element).fontFamily))
    .toContain("Trebuchet");
  expect(await page.locator(".era-intro h1").evaluate(element => getComputedStyle(element).fontStyle)).toBe("italic");
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator(".era-art:visible")).toHaveAttribute("src", /era-soundcheck-dark\.svg$/);
  await expect(page.locator('[data-illustration="soundcheck"] .illustration-dark img'))
    .toHaveAttribute("src", /soundcheck-dark\.svg$/);
  await page.locator(".brand").click();
  await page.locator("#resume-link").click();
  await expect(page.locator("html")).toHaveAttribute("data-era", "soundcheck");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("references and unknown routes use the quiet modern era", async ({ page }) => {
  await ready(page, chapters[2]);
  await page.goto("#/reference?path=docs%2Fwriting.md");
  await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator("html")).toHaveAttribute("data-era", "2020s");
  await expect(page.locator(".era-intro")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-era", "2020s");
  await page.goto("#/unknown");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-era", "2020s");
});

test("a delayed response cannot restore an old chapter era", async ({ page }) => {
  let release;
  await page.route("**/content/02-introduction/README.md", route => new Promise(resolve => {
    release = async () => {
      await route.fulfill({ status: 200, body: "# Outdated response" });
      resolve();
    };
  }));
  await page.goto("#/00-introduction");
  await expect(page.locator("html")).toHaveAttribute("data-era", "1970s");
  await expect.poll(() => Boolean(release)).toBeTruthy();
  await page.evaluate(() => { location.hash = "#/04-cloud"; });
  await expect(page.locator("html")).toHaveAttribute("data-era", "2020s");
  await expect(page.locator("#article h1")).toContainText("Chapter 07");
  await release();
  await expect(page.locator("html")).toHaveAttribute("data-era", "2020s");
  await expect(page.locator("#article h1")).toContainText("Chapter 07");
});

test("failed content retains its chapter era", async ({ page }) => {
  await page.route("**/content/05-planning/README.md", route => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("#/02-planning");
  await expect(page.getByRole("alert")).toContainText("503");
  await expect(page.locator("html")).toHaveAttribute("data-era", "1990s");
  await expect(page.locator("#chapter-label")).toContainText("05");
});

test("built illustrations follow chapter palettes without a diagram renderer", async ({ request }) => {
  for (const illustration of illustrations) {
    for (const mode of ["light", "dark"]) {
      const response = await request.get(`content/${illustrationPath(illustration.id, mode)}`);
      expect(response.ok()).toBeTruthy();
      const svg = await response.text();
      expect(svg).toContain(eraPalette(illustration.era, mode).ink);
      expect(svg).toContain(`data-era="${illustration.era}"`);
      expect(svg).toContain(`data-theme="${mode}"`);
    }
  }
  expect((await request.get("diagrams/manifest.json")).status()).toBe(404);
});

test("era routing also works at the hosting root", async ({ page }) => {
  for (const chapter of chapters) {
    await page.goto(`http://127.0.0.1:4193/#/${chapter.slug}`);
    await expect(page.locator("html")).toHaveAttribute("data-era", chapter.era);
    await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.locator("#article h1")).toBeVisible();
    await expect(page.locator(".course-illustration"))
      .toHaveCount(illustrations.filter(item => item.document === chapter.path).length);
    for (const link of await page.locator(".illustration-light").all()) {
      await expect(link).toHaveAttribute("href", /\/content\/docs\/illustrations\/.+-light\.svg$/);
    }
  }
});
