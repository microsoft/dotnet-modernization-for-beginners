import { test, expect } from "./fixtures.js";
import { eraPalette } from "../../webpage/scripts/eras.js";
import classic from "../../webpage/seasons/classic/season.js";
import halloween from "../../webpage/seasons/halloween/season.js";

for (const pack of [classic, halloween]) for (const mode of ["light", "dark"]) {
  test(`Copilot app ${pack.id} ${mode}: themed flight deck, readable content, and responsive art`, async ({ page }, testInfo) => {
    await page.route(url => url.hostname === "clarity.ms" || url.hostname.endsWith(".clarity.ms")
      || url.hostname === "c.bing.com", route => route.abort());
    await page.goto(`?season=${pack.id}&clawpilotTheme=${mode}#/reference?path=03-prerequisites%2Fcopilot-app.md`);
    await expect(page.locator(".autopilot-intro")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-era", "autopilot");
    await expect(page.locator("html")).toHaveAttribute("data-season", pack.id);
    await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
    expect(await page.locator("html").evaluate(element => element.style.getPropertyValue("--paper")))
      .toBe(eraPalette("autopilot", mode, pack).paper);
    if (pack.sceneLabels) await expect(page.locator(".scene-name")).toHaveText("Clockwork observatory");
    await expect(page.locator(".autopilot-tags li")).toHaveText(["Attach a folder", "Start Autopilot", "Follow Canvas"]);
    const art = page.locator(".autopilot-intro .era-art:visible");
    await expect(art).toHaveAttribute("src", new RegExp(`/assets/${pack.eras.autopilot[mode === "light" ? "art" : "artDark"]}$`));
    await expect.poll(() => art.evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
    await expect(page.locator('[data-illustration="autopilot-flow"]')).toHaveCount(1);
    await expect(page.locator("#course-progress")).toHaveText("0 of 7 required steps complete");
    await expect(page.locator("[data-complete]")).toHaveCount(0);

    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator(".autopilot-intro").scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
      const contrast = await page.evaluate(() => {
        const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(Number)
          .map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
          .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
        return [".autopilot-intro h1", ".autopilot-kicker", ".autopilot-caption",
          ".autopilot-tags li", "#article > p", "#article pre code"].map(selector => {
          const element = document.querySelector(selector);
          let background = element;
          while (background && getComputedStyle(background).backgroundColor === "rgba(0, 0, 0, 0)") {
            background = background.parentElement;
          }
          const a = luminance(getComputedStyle(element).color);
          const b = luminance(getComputedStyle(background).backgroundColor);
          return { selector, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
        });
      });
      for (const value of contrast) expect(value.ratio, value.selector).toBeGreaterThanOrEqual(4.5);
      if (width !== 320) await page.screenshot({ path: testInfo.outputPath(`${width}.png`) });
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
    await page.getByRole("button", { name: `Use ${mode === "light" ? "dark" : "light"} theme` }).click();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-era", "autopilot");
    await expect(page.locator("html")).toHaveAttribute("data-theme", mode === "light" ? "dark" : "light");
    await expect(page.locator(".autopilot-intro")).toBeVisible();
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
}
