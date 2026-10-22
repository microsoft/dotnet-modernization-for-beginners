import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chapters, references } from "../../webpage/scripts/chapters.js";
import { parseRoute, routeForPath } from "../../webpage/scripts/routes.js";
import { selectPublicContent } from "../../webpage/tools/public-content.mjs";

const root = resolve(import.meta.dirname, "../..");
const read = path => readFileSync(join(root, path), "utf8");
const guide = "docs/modernization-reference.md";
const contentRoot = "https://microsoft.github.io/dotnet-modernization-for-beginners/content/";
const indexedPaths = [...read("llms.txt").matchAll(/\[[^\]]+\]\((https:[^)]+)\)/g)].map(match => {
  assert.ok(match[1].startsWith(contentRoot), `Index links must serve public Markdown: ${match[1]}`);
  return match[1].slice(contentRoot.length);
});

test("the modernization guide is discoverable without adding a required step", () => {
  assert.match(read("README.md"), /\[modernization reference guide\]\(docs\/modernization-reference\.md\)/);
  const reference = references.find(item => item.path === guide);
  assert.ok(reference);
  assert.equal(parseRoute(routeForPath(guide)).chapter.path, guide);
  assert.ok(!chapters.some(item => item.path === guide));
  assert.equal(chapters.filter(item => item.core).length, 7);
  assert.deepEqual(selectPublicContent([], [guide, "docs/private-notes.md"]), [guide]);
  assert.ok(read("tools/check-language.py").includes(`"${guide}"`));
});

test("the discovery index links to declared sources with sample and evidence boundaries", () => {
  assert.equal(indexedPaths[0], guide);
  assert.equal(indexedPaths.length, 10);
  assert.equal(new Set(indexedPaths).size, indexedPaths.length);
  for (const path of indexedPaths) {
    assert.ok([...chapters, ...references].some(item => item.path === path), path);
    assert.match(read(path), /^# /m, path);
  }
  assert.match(read("llms.txt"), /sample choices, not universal migration recommendations/);
  assert.match(read(guide), /not production migration advice/);
  assert.match(read(guide), /Reference tests don't validate a different agent-generated application/);
  assert.match(read(guide), /Planning approval isn't execution approval/);
});

test("the published index and its Markdown targets are available without the reader", {
  skip: !existsSync(join(root, "_site")) && "Build the website before checking its artifact."
}, () => {
  assert.equal(read("_site/llms.txt"), read("llms.txt"));
  for (const path of indexedPaths) {
    const markdown = read(`_site/content/${path}`);
    assert.ok(markdown.length > 0, path);
    assert.doesNotMatch(markdown, /<!-- repo-only:/, path);
  }
  assert.equal(read(`_site/content/${guide}`), read(guide));
});
