import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chapters, references } from "../../webpage/scripts/chapters.js";
import { illustrations, illustrationPath } from "../../webpage/scripts/illustrations.js";
import { eras } from "../../webpage/scripts/eras.js";
import { renderIllustration, renderSoundcheckHeader, renderAutopilotHeader } from "../../webpage/tools/illustration-art.mjs";
import { renderIllustrations } from "../../webpage/tools/render-illustrations.mjs";

const root = resolve(import.meta.dirname, "../..");

test("chapters and illustrated references embed their original SVGs as normal Markdown images", async () => {
  assert.equal(new Set(illustrations.map(item => item.id)).size, illustrations.length);
  for (const chapter of chapters) {
    assert.ok(illustrations.some(item => item.document === chapter.path), chapter.path);
  }
  for (const illustration of illustrations) {
    const document = [...chapters, ...references].find(item => item.path === illustration.document);
    assert.ok(document, illustration.document);
    assert.equal(illustration.era, document.era);
    assert.ok(illustration.description.length > 100);
    const markdown = await readFile(resolve(root, document.path), "utf8");
    const images = [...markdown.matchAll(/!\[([^\]]+)\]\(([^)\s]+)\)/g)];
    const path = resolve(root, illustrationPath(illustration.id, "light"));
    const embedded = images.filter(match => resolve(root, dirname(document.path), match[2]) === path);
    assert.equal(embedded.length, 1, document.path);
    assert.ok(embedded[0][1].length > 60, "README images need meaningful alternative text.");
  }
  for (const document of [...chapters, ...references]) {
    const markdown = await readFile(resolve(root, document.path), "utf8");
    assert.doesNotMatch(markdown, /^```mermaid\b/m, document.path);
  }
});

test("route diagrams distinguish stage control while keeping the final app check", () => {
  const text = id => renderIllustration(id, "light").replace(/<[^>]+>/g, " ");
  assert.match(text("route-choices"), /Visual Studio/);
  assert.match(text("route-choices"), /Copilot app/);
  assert.match(text("route-choices"), /EF Core/);
  assert.match(text("route-choices"), /EF6/);
  assert.match(text("route-choices"), /Check add, edit, and restart/);
  assert.match(text("autopilot-flow"), /No new prompt is needed at each stage/);
  assert.match(text("autopilot-flow"), /saved edit after restart/);
});

test("Autopilot headers have original generated artwork in both modes", async () => {
  for (const [mode, file] of [["light", eras.autopilot.art], ["dark", eras.autopilot.artDark]]) {
    const svg = renderAutopilotHeader(mode);
    assert.equal((await readFile(resolve(root, "webpage/seasons/classic/assets", file), "utf8")).trim(), svg.trim());
    assert.match(svg, /Autopilot flight deck/);
    assert.match(svg, /\.NET 10/);
    assert.ok(svg.includes(eras.autopilot[mode].paper));
    assert.doesNotMatch(svg, /<image|<script|<animate|(?:href|src)=["']https?:/);
  }
});

test("the tool-first artwork includes setup and keeps technical relationships accurate", () => {
  const text = id => renderIllustration(id, "light").replace(/<[^>]+>/g, " ");
  assert.match(text("journey"), /seven course chapters/);
  assert.match(text("journey"), /Setup/);
  assert.doesNotMatch(text("journey"), /OPTIONAL SIDE ROUTE|Deploy & clean up|Requires cost approval/);
  for (const id of ["journey", "workflow", "investigation", "plan"]) {
    assert.doesNotMatch(text(id), /baseline|inspect source|preserve stored values|compare selected records/i);
  }
  assert.match(text("investigation"), /Edit if needed/);
  assert.match(text("investigation"), /requirement is optional/);
  assert.match(text("plan"), /01  Request plan/);
  assert.match(text("plan"), /02  Review choices/);
  assert.match(text("plan"), /03  Check plan/);
  assert.doesNotMatch(text("plan"), /Instruction: Build and run|02  Instruction/);
  assert.match(text("plan"), /Review before execution/);
  assert.match(text("architecture"), /controller selects a Razor view/);
  assert.match(text("architecture"), /view does not query the database directly/);
  assert.match(text("azure"), /creates the schema from the EF Core model and adds demo seed data/);
});

test("soundcheck headers are generated for both modes without external or animated artwork", async () => {
  for (const [mode, file] of [["light", eras.soundcheck.art], ["dark", eras.soundcheck.artDark]]) {
    const svg = renderSoundcheckHeader(mode);
    assert.equal((await readFile(resolve(root, "webpage/seasons/classic/assets", file), "utf8")).trim(),
      svg.trim().replace(/[ \t]+$/gm, ""));
    assert.match(svg, /SOUND/);
    assert.match(svg, /CHECK/);
    assert.ok(svg.includes(eras.soundcheck[mode].paper));
    assert.doesNotMatch(svg, /<image|<script|<animate|(?:href|src)=["']https?:|1960s|1970s/);
  }
});

test("saved image variants exactly match their artwork and shared palettes", async () => {
  await renderIllustrations({ check: true });
  for (const illustration of illustrations) {
    for (const mode of ["light", "dark"]) {
      const saved = await readFile(resolve(root, illustrationPath(illustration.id, mode)), "utf8");
      assert.doesNotMatch(saved, /[ \t]+$/m, "Generated images must not contain trailing whitespace.");
    }
    const variants = ["light", "dark"].map(mode => {
      const svg = renderIllustration(illustration.id, mode);
      assert.match(svg, /<svg\b/);
      assert.match(svg, /viewBox=/);
      assert.match(svg, /<title\b/);
      assert.match(svg, /<desc\b/);
      assert.ok(svg.includes(eras[illustration.era][mode].ink));
      assert.doesNotMatch(svg, /<(?:script|foreignObject|image)\b|\son\w+=/i);
      assert.doesNotMatch(svg, /(?:href|src)=["']https?:/i);
      assert.ok(svg.length < 150_000, "Keep illustrations lightweight.");
      return svg;
    });
    assert.notEqual(variants[0], variants[1]);
  }
});

test("illustration selection rejects unknown IDs and themes", () => {
  assert.throws(() => illustrationPath("../private", "light"), /Unknown illustration/);
  assert.throws(() => illustrationPath("journey", "sepia"), /Unknown color mode/);
  assert.throws(() => renderIllustration("../private", "light"));
  assert.throws(() => renderIllustration("journey", "sepia"));
});

test("Halloween headers are distinct and generated for every stop in both modes", async () => {
  const { default: halloween } = await import("../../webpage/seasons/halloween/season.js");
  const { renderHalloweenHeader } = await import("../../webpage/seasons/halloween/art.mjs");
  assert.equal(new Set(Object.values(halloween.eras).map(era => era.scene)).size, Object.keys(halloween.eras).length);
  const variants = new Set();
  for (const [id, era] of Object.entries(halloween.eras)) {
    for (const [mode, file] of [["light", era.art], ["dark", era.artDark]]) {
      const svg = renderHalloweenHeader(id, mode);
      assert.equal((await readFile(resolve(root, "webpage/seasons/halloween/assets", file), "utf8")).trim(), svg.trim());
      assert.ok(svg.includes(`data-scene="${era.scene}"`));
      assert.ok(svg.includes(era[mode].a));
      assert.ok(svg.includes(era[mode].c));
      assert.ok(svg.includes(`data-theme="${mode}"`));
      assert.doesNotMatch(svg, /<script|<image|<animate|(?:href|src)=["']https?:/i);
      variants.add(svg);
    }
  }
  assert.equal(variants.size, Object.keys(halloween.eras).length * 2);
});

test("Halloween lesson illustrations cover every lesson illustration in both modes", async () => {
  const { default: halloween } = await import("../../webpage/seasons/halloween/season.js");
  for (const illustration of illustrations) {
    for (const mode of ["light", "dark"]) {
      const svg = await readFile(resolve(root, `webpage/seasons/halloween/illustrations/${illustration.id}-${mode}.svg`), "utf8");
      assert.ok(svg.includes(halloween.eras[illustration.era][mode].ink));
      assert.doesNotMatch(svg, /<script|<image|<animate|(?:href|src)=["']https?:/i);
    }
  }
});
