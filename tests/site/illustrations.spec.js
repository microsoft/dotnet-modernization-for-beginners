import { test, expect } from "./fixtures.js";
import { routeForPath } from "../../webpage/scripts/routes.js";
import { illustrations, illustrationPath } from "../../webpage/scripts/illustrations.js";
import halloween from "../../webpage/seasons/halloween/season.js";

for (const season of ["classic", "halloween"]) for (const illustration of illustrations) {
  for (const mode of ["light", "dark"]) {
    test(`${season} ${illustration.id} ${mode}: standalone art has readable, unclipped labels`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.goto(season === "classic"
        ? `content/${illustrationPath(illustration.id, mode)}`
        : `seasons/halloween/illustrations/${illustration.id}-${mode}.svg`);
      await expect(page.locator("svg")).toHaveAttribute("data-illustration", illustration.id);
      await expect(page.locator("svg")).toHaveAttribute("data-era", illustration.era);
      await expect(page.locator("svg")).toHaveAttribute("data-theme", mode);
      await expect(page.locator("parsererror")).toHaveCount(0);
      expect(await page.locator("svg > title").textContent()).not.toBe("");
      expect(await page.locator("svg > desc").textContent()).not.toBe("");
      const layout = await page.locator("svg").evaluate(async svg => {
        await document.fonts.ready;
        const frame = svg.getBoundingClientRect();
        const labels = [...svg.querySelectorAll("text")].map(element => ({
          text: element.textContent, rect: element.getBoundingClientRect(),
          size: parseFloat(getComputedStyle(element).fontSize)
        }));
        const clipped = labels.filter(({ rect }) => rect.left < frame.left - 1 || rect.top < frame.top - 1 ||
          rect.right > frame.right + 1 || rect.bottom > frame.bottom + 1).map(item => item.text);
        const collisions = [];
        for (let i = 0; i < labels.length; i++) {
          for (let j = i + 1; j < labels.length; j++) {
            const a = labels[i].rect, b = labels[j].rect;
            const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (width > 2 && height > 2) collisions.push([labels[i].text, labels[j].text]);
          }
        }
        return { clipped, collisions, count: labels.length, small: labels.filter(item => item.size < 17).map(item => item.text) };
      });
      expect(layout.count).toBeGreaterThan(8);
      expect(layout.clipped).toEqual([]);
      expect(layout.collisions).toEqual([]);
      expect(layout.small).toEqual([]);
    });
  }

  test(`${season} ${illustration.id}: image theme, full-size link, and text alternative work on mobile`, async ({ page }) => {
    const description = (season === "halloween" && halloween.illustrationText?.[illustration.id]?.description)
      || illustration.description;
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`?season=${season}&clawpilotTheme=light${routeForPath(illustration.document)}`);
    const figure = page.locator(`[data-illustration="${illustration.id}"]`);
    await expect(figure).toBeVisible();
    await figure.scrollIntoViewIfNeeded();
    const light = figure.locator(".illustration-light");
    const dark = figure.locator(".illustration-dark");
    await expect(light).toBeVisible();
    await expect(dark).toBeHidden();
    await expect.poll(() => light.locator("img").evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
    await page.getByRole("button", { name: "Use dark theme" }).click();
    await expect(light).toBeHidden();
    await expect(dark).toBeVisible();
    await dark.scrollIntoViewIfNeeded();
    await expect.poll(() => dark.locator("img").evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
    await expect(dark.locator("img")).toHaveAttribute("alt", description);
    await figure.getByText("Read the illustration", { exact: true }).click();
    await expect(figure.locator("details p")).toHaveText(description);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    const opened = page.waitForEvent("popup");
    await dark.click();
    const popup = await opened;
    await popup.waitForLoadState();
    await expect(popup.locator("svg")).toHaveAttribute("data-theme", "dark");
    await popup.close();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(figure.locator(".illustration-dark")).toBeVisible();
    await expect(page.locator("#era-label")).toHaveCount(0);
  });
}

test("an unavailable illustration reports the error and retains its text explanation", async ({ page }) => {
  await page.route("**/content/docs/illustrations/azure-*.svg", route =>
    route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("?clawpilotTheme=light#/04-cloud");
  const figure = page.locator(".course-illustration");
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.locator(".illustration-light .notice")).toContainText("The image could not load.");
  await figure.getByText("Read the illustration", { exact: true }).click();
  await expect(figure.locator("details p")).toContainText("approved administrator");
  await expect(page.locator("#article h1")).toContainText("Chapter 07");
  await expect(page.getByRole("alert")).toHaveCount(0);
});
