import { test, expect } from "./fixtures.js";
import { chapters } from "../../webpage/scripts/chapters.js";
import { eraPalette, getEra } from "../../webpage/scripts/eras.js";
import halloween from "../../webpage/seasons/halloween/season.js";

async function open(page, route, query = "") {
  await page.goto(`${query ? `?${query}` : ""}#/${route}`);
  await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("alert")).toHaveCount(0);
}

test("the calendar selects the holiday packs and classic between their windows", async ({ page }) => {
  await open(page, "overview");
  await expect(page.locator("html")).toHaveAttribute("data-season", "classic");
  await expect(page.locator("#season-stylesheet")).toHaveAttribute("href", "seasons/classic/season.css");

  await page.clock.setFixedTime(new Date("2026-10-20T12:00:00"));
  await page.reload();
  await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
  await expect(page.locator("html")).toHaveAttribute("data-season", "halloween");
  await expect(page.locator("#season-stylesheet")).toHaveAttribute("href", "seasons/halloween/season.css");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "seasons/halloween/assets/favicon.svg");
  await expect(page.locator(".site-footer > span")).toHaveText(halloween.copy.footer);

  for (const [date, id] of [
    ["2026-11-12T12:00:00", "thanksgiving"],
    ["2026-12-11T12:00:00", "christmas"],
    ["2026-12-26T12:00:00", "new-year"]
  ]) {
    await page.clock.setFixedTime(new Date(date));
    await page.reload();
    await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
    await expect(page.locator("html")).toHaveAttribute("data-season", id);
    await expect(page.locator("#season-stylesheet")).toHaveAttribute("href", `seasons/${id}/season.css`);
  }

  await open(page, "overview", "season=classic");
  await expect(page.locator("html")).toHaveAttribute("data-season", "classic");
  await open(page, "overview", "season=unknown");
  await expect(page.locator("html")).toHaveAttribute("data-season", "new-year");
});

for (const [season, scenes] of [
  ["thanksgiving", ["pie-cutout", "pie-wagon", "pumpkin-train", "turkey-balloon", "cranberry-scoop", "squash-float", "electric-pie"]],
  ["new-year", ["sock-hop", "record-hop", "disco", "cassette-karaoke", "inflatable-alien", "cd-curtain", "photo-booth"]]
]) {
  test(`${season} advances one decade on each core chapter, including setup`, async ({ page }) => {
    for (const [index, chapter] of chapters.entries()) {
      await open(page, chapter.slug, `season=${season}`);
      await expect(page.locator("html")).toHaveAttribute("data-scene", scenes[index]);
    }
  });
}

test("the header stays fixed and decorative art is captionless in every theme", async ({ page }) => {
  for (const season of ["classic", "halloween", "thanksgiving", "christmas", "new-year"]) {
    for (const [route, art] of [["overview", ".hero-art"], ["01-assessment", ".era-art"]]) {
      await open(page, route, `season=${season}`);
      await expect(page.locator("html")).toHaveAttribute("data-season", season);
      await expect(page.locator(".brand-copy > span")).toHaveText("A self-paced course");
      await expect(page.locator(`${art}:visible`)).toBeVisible();
      await expect(page.locator(".scene-caption, .scene-name")).toHaveCount(0);
      await expect(page.locator(".course-illustration figcaption")).not.toBeEmpty();
    }
  }
});

test("Halloween gives every stop its own scene and art", async ({ page }) => {
  for (const chapter of chapters) {
    await open(page, chapter.slug, "season=halloween");
    const era = getEra(chapter.era, halloween);
    await expect(page.locator("html")).toHaveAttribute("data-scene", era.scene);
    if (chapter.slug === "overview") continue;
    const art = page.locator(".era-art:visible");
    await expect(art).toHaveAttribute("src", new RegExp(`/seasons/halloween/assets/${era.art}$`));
    await expect.poll(() => art.evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
  }
});

test("Halloween swaps lesson illustrations and setup text, and classic does not", async ({ page }) => {
  const setup = chapters.find(item => item.slug === "prerequisites");
  await open(page, setup.slug, "season=halloween");
  await expect(page.locator(".illustration-light")).toHaveAttribute("href", /\/seasons\/halloween\/illustrations\/soundcheck-light\.svg$/);
  await expect(page.locator(".illustration-light img")).toHaveAttribute("alt", halloween.illustrationText.soundcheck.description);
  await expect.poll(() => page.locator(".illustration-light img").evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
  expect(await page.locator(".era-intro h1").evaluate(element => getComputedStyle(element).fontStyle)).toBe("italic");

  await open(page, setup.slug, "season=classic");
  await expect(page.locator(".illustration-light")).toHaveAttribute("href", /\/content\/docs\/illustrations\/soundcheck-light\.svg$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-scene", /.+/);
});

test("switching seasons keeps progress, color mode, and the route", async ({ page }) => {
  await open(page, "01-assessment", "season=halloween&clawpilotTheme=dark");
  await page.getByRole("button", { name: "Mark step complete" }).click();
  await expect(page.locator("#course-progress")).toContainText("1 of 7");
  expect(await page.locator("html").evaluate(element => element.style.getPropertyValue("--paper")))
    .toBe(eraPalette("1980s", "dark", halloween).paper);
  await open(page, "01-assessment", "season=classic&clawpilotTheme=dark");
  await expect(page.locator("#course-progress")).toContainText("1 of 7");
  await expect(page.getByRole("button", { name: "Marked complete" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-era", "1980s");
});

test("the Halloween field guide keeps its opening action and mobile navigation usable", async ({ page }) => {
  for (const mode of ["light", "dark"]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await open(page, "overview", `season=halloween&clawpilotTheme=${mode}`);
    const start = page.locator(".hero-copy p > a:has(> strong)");
    await expect(start).toBeInViewport();
    await expect(page.locator(".hero-art:visible")).toBeInViewport();
    await expect(page.locator(".hero-copy > p").filter({ hasText: /\S/ })).toHaveCount(7);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(start).toBeInViewport();
    await page.getByRole("button", { name: "Chapters", exact: true }).click();
    await expect(page.locator("#course-nav")).toBeVisible();
    await page.locator("#chapter-nav a[href='#/02-planning']").click();
    await expect(page.locator("#article")).not.toHaveAttribute("aria-busy", "true");
    await expect(page.locator("html")).toHaveAttribute("data-scene", "spellbook");
    await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
    await expect(page.locator("#course-nav")).not.toBeVisible();
    await page.getByRole("button", { name: "On this page" }).click();
    await expect(page.locator("#page-outline")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#page-outline")).not.toBeVisible();
  }
});
