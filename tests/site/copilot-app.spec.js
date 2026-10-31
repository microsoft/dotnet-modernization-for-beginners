import { test, expect } from "./fixtures.js";

async function blockAnalytics(page) {
  await page.route(url => url.hostname === "clarity.ms" || url.hostname.endsWith(".clarity.ms")
    || url.hostname === "c.bing.com", route => route.abort());
}

for (const base of ["/workshop/", "http://127.0.0.1:4193/"]) {
  test(`Copilot app lesson and example preserve progress and load screenshots at ${base}`, async ({ page }) => {
    const errors = [];
    await blockAnalytics(page);
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${base}#/prerequisites`);
    await expect(page.locator("#article h1")).toHaveText("Chapter 03: Get ready");
    await expect(page.locator("#article")).toContainText("For a guided, automatic experience");
    const appLink = page.locator("#chapter-nav").getByRole("link", { name: /Copilot app upgrade/ });
    await expect(appLink).toHaveAttribute("href", "#/reference?path=03-prerequisites%2Fcopilot-app.md");
    const menuTargets = await page.locator("#chapter-nav a").evaluateAll(links => links.map(link => link.getAttribute("href")));
    expect(menuTargets[menuTargets.indexOf("#/prerequisites") + 1])
      .toBe("#/reference?path=03-prerequisites%2Fcopilot-app.md");
    await page.getByRole("button", { name: "Mark step complete" }).click();
    await appLink.click();
    await expect(page).toHaveURL(/#\/reference\?path=03-prerequisites%2Fcopilot-app\.md$/);
    await expect(page.locator("#article h1")).toHaveText("Modernize with the GitHub Copilot app");
    await expect(page.locator("[data-complete]")).toHaveCount(0);
    await expect(appLink).toHaveAttribute("aria-current", "page");
    await expect(page.locator("#chapter-nav a[aria-current]")).toHaveCount(1);
    await expect(page.locator("#course-progress")).toHaveText("1 of 7 required steps complete");
    await expect(page.locator("#article")).toContainText("Give Copilot a goal and let it work through the upgrade.");
    await expect(page.locator("#article")).toContainText("Approve all");
    await expect(page.locator("#article")).toContainText("Autopilot");
    await expect(page.locator("#article")).not.toContainText("Ask every time");
    await expect(page.locator("#article")).not.toContainText("The recording");
    await expect(page.locator("#article")).not.toContainText("11/11 tasks complete");
    await expect(page.locator("#article pre code").first()).toHaveText(
      "Update this folder to .NET 10, use the Canvas to support our upgrade.\n");
    await expect(page.locator("#article pre code")).toHaveCount(1);
    await expect(page.getByRole("alert")).toHaveCount(0);
    const lessonImages = page.locator('#article img[src*="/03-prerequisites/images/copilot-app-"]');
    await expect(lessonImages).toHaveCount(5);
    for (const image of await lessonImages.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBeTruthy();
    }

    await page.setViewportSize({ width: 390, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.locator("#article").getByRole("link", { name: "Copilot app upgrade example", exact: true }).click();
    await expect(page).toHaveURL(/#\/reference\?path=examples%2Fassessments%2Fcopilot-app%2FREADME\.md$/);
    await expect(page.locator("#article h1")).toHaveText("BookCatalog: a Copilot app upgrade example");
    await expect(page.locator("#article")).toContainText("11/11 tasks complete");
    await expect(page.locator("#article")).toContainText("No build recorded in this session");
    await expect(page.locator("[data-complete]")).toHaveCount(0);
    const images = page.locator('#article img[src*="/03-prerequisites/images/copilot-app-"]');
    await expect(images).toHaveCount(14);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(element => element.complete && element.naturalWidth > 0)).toBeTruthy();
      await expect(image).toHaveAttribute("alt", /\S.{30,}/);
    }
    await page.setViewportSize({ width: 390, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    await page.locator("#article").getByRole("link", { name: "Back: Copilot app lesson", exact: true }).click();
    await expect(page.locator("#article h1")).toHaveText("Modernize with the GitHub Copilot app");
    await expect(page.locator("#course-progress")).toHaveText("1 of 7 required steps complete");
    await page.locator("#article").getByRole("link", { name: "Back: Setup", exact: true }).click();
    await expect(page).toHaveURL(/#\/prerequisites$/);
    await expect(page.getByRole("button", { name: "Marked complete" })).toBeVisible();
    await page.locator("#chapters-toggle").click();
    await appLink.click();
    await expect(page.locator("#article h1")).toHaveText("Modernize with the GitHub Copilot app");
    await expect(page.locator("#chapter-nav a[aria-current='page']"))
      .toHaveAttribute("href", "#/reference?path=03-prerequisites%2Fcopilot-app.md");
    await expect(page.locator("#course-progress")).toHaveText("1 of 7 required steps complete");
    expect(errors).toEqual([]);
  });
}
