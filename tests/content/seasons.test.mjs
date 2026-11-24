import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import "../../webpage/seasons/seasons.js";
import { eras, useSeason, activeSeason } from "../../webpage/scripts/eras.js";
import classic from "../../webpage/seasons/classic/season.js";

const root = resolve(import.meta.dirname, "../..");
const { seasonConfig, resolveSeason } = globalThis.courseSeasons;
const on = day => new Date(`2026-${day}T12:00:00`);
const localDay = (year, month, day) => new Date(year, month - 1, day, 12);

test("every listed season is a complete pack", async () => {
  assert.deepEqual(readdirSync(join(root, "webpage/seasons"), { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort(),
    [...seasonConfig.packs].sort());
  for (const id of seasonConfig.packs) {
    const folder = join(root, "webpage/seasons", id);
    const { default: pack } = await import(`../../webpage/seasons/${id}/season.js`);
    assert.equal(pack.id, id);
    for (const file of ["season.css", "assets/favicon.svg", `assets/${pack.hero.art}`]) assert.ok(existsSync(join(folder, file)), `${id}: ${file}`);
    if (pack.hero.artDark) assert.ok(existsSync(join(folder, "assets", pack.hero.artDark)));
    for (const key of ["navDescription", "footer", "sampleKicker", "futureKicker"]) assert.ok(pack.copy[key], `${id}: copy.${key}`);
    assert.deepEqual(Object.keys(pack.eras).sort(), Object.keys(classic.eras).sort(), `${id} must define every era`);
    for (const era of Object.values(pack.eras)) {
      for (const file of [era.art, era.artDark].filter(Boolean)) assert.ok(existsSync(join(folder, "assets", file)), `${id}: ${file}`);
    }
  }
});

test("the calendar, pins, and preview override choose a season", () => {
  assert.equal(seasonConfig.fallback, "classic");
  assert.equal(resolveSeason({ date: on("06-15") }), "classic");
  assert.equal(resolveSeason({ date: on("10-01") }), "halloween");
  assert.equal(resolveSeason({ date: on("11-02") }), "halloween");
  assert.equal(resolveSeason({ date: on("11-03") }), "classic");
  assert.equal(resolveSeason({ date: localDay(2026, 11, 11) }), "classic");
  assert.equal(resolveSeason({ date: localDay(2026, 11, 12) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2026, 11, 26) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2026, 11, 27) }), "classic");
  assert.equal(resolveSeason({ date: localDay(2024, 11, 13) }), "classic");
  assert.equal(resolveSeason({ date: localDay(2024, 11, 14) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2024, 11, 28) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2024, 11, 29) }), "classic");
  assert.equal(resolveSeason({ date: localDay(2025, 11, 13) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2025, 11, 27) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2027, 11, 11) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2027, 11, 25) }), "thanksgiving");
  assert.equal(resolveSeason({ date: localDay(2026, 12, 10) }), "classic");
  assert.equal(resolveSeason({ date: localDay(2026, 12, 11) }), "christmas");
  assert.equal(resolveSeason({ date: localDay(2026, 12, 25) }), "christmas");
  assert.equal(resolveSeason({ date: localDay(2026, 12, 26) }), "new-year");
  assert.equal(resolveSeason({ date: localDay(2027, 1, 1) }), "new-year");
  assert.equal(resolveSeason({ date: localDay(2027, 1, 2) }), "classic");
  assert.equal(resolveSeason({ date: on("10-20"), requested: "classic" }), "classic");
  assert.equal(resolveSeason({ date: on("06-15"), requested: "halloween" }), "halloween");
  assert.equal(resolveSeason({ date: localDay(2026, 12, 20), requested: "new-year" }), "new-year");
  assert.equal(resolveSeason({ date: on("06-15"), requested: "../private" }), "classic");
  const wrap = { ...seasonConfig, packs: ["classic", "winter"], calendar: [{ season: "winter", from: "12-15", to: "01-05" }] };
  assert.equal(resolveSeason({ date: on("12-31"), config: wrap }), "winter");
  assert.equal(resolveSeason({ date: on("01-05"), config: wrap }), "winter");
  assert.equal(resolveSeason({ date: on("01-06"), config: wrap }), "classic");
  assert.equal(resolveSeason({ date: on("10-20"), config: { ...seasonConfig, active: "classic" } }), "classic");
  assert.equal(resolveSeason({ date: on("06-15"), config: { ...seasonConfig, active: "halloween" } }), "halloween");
  assert.equal(resolveSeason({ date: on("06-15"), config: { ...seasonConfig, active: "missing" } }), "classic");
  assert.equal(resolveSeason({ date: localDay(2026, 12, 20), config: { ...seasonConfig, active: "classic" } }), "classic");
});

test("a season must define every era before it can be used", async () => {
  const { default: halloween } = await import("../../webpage/seasons/halloween/season.js");
  assert.throws(() => useSeason({ id: "broken", eras: { "1960s": classic.eras["1960s"] } }), /missing eras/);
  useSeason(halloween);
  assert.equal(activeSeason().id, "halloween");
  assert.equal(eras, halloween.eras);
  useSeason(classic);
  assert.equal(eras, classic.eras);
});
