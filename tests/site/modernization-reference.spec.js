import { test, expect } from "./fixtures.js";

for (const base of ["/workshop/", "http://127.0.0.1:4193/"]) {
  test(`the modernization guide is linked and optional at ${base}`, async ({ page }) => {
    await page.goto(`${base}#/overview`);
    await page.locator("#article").getByRole("link", { name: "modernization reference guide", exact: true }).click();
    await expect(page).toHaveURL(/#\/reference\?path=docs%2Fmodernization-reference\.md$/);
    await expect(page.locator("#article h1")).toHaveText("Using this workshop as a .NET modernization reference");
    await expect(page.locator("[data-complete]")).toHaveCount(0);
    await expect(page.locator("#course-progress")).toHaveText("0 of 7 required steps complete");
    await expect(page.getByRole("alert")).toHaveCount(0);
  });

  test(`the discovery index serves plain Markdown without JavaScript at ${base}`, async ({ request }) => {
    const index = await request.get(`${base}llms.txt`);
    expect(index.ok()).toBeTruthy();
    expect(index.headers()["content-type"]).toContain("text/plain");
    const text = await index.text();
    const prefix = "https://microsoft.github.io/dotnet-modernization-for-beginners/";
    const links = [...text.matchAll(/\[[^\]]+\]\((https:[^)]+)\)/g)];
    expect(links).toHaveLength(10);
    for (const [, url] of links) {
      expect(url.startsWith(prefix)).toBeTruthy();
      const response = await request.get(`${base}${url.slice(prefix.length)}`);
      expect(response.ok(), url).toBeTruthy();
      expect(response.headers()["content-type"]).toContain("text/plain");
      expect(await response.text()).toMatch(/^# /m);
    }
  });
}
