import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chapters, references } from "../../webpage/scripts/chapters.js";
import { parseRoute, routeForPath } from "../../webpage/scripts/routes.js";
import { selectPublicContent } from "../../webpage/tools/public-content.mjs";
import { stripRepositoryOnlySections } from "../../webpage/tools/repo-only.mjs";

const root = resolve(import.meta.dirname, "../..");
const path = "03-prerequisites/copilot-app.md";
const examplePath = "examples/assessments/copilot-app/README.md";
const read = file => readFileSync(join(root, file), "utf8");
const lesson = read(path);
const example = read(examplePath);
const videoFrames = ["request", "assessment", "baseline", "core-host", "views", "validation"];
const additionalFrames = [
  ["add-folder", 1438, 546],
  ["retirement-decision", 500, 260], ["completion-report", 495, 432],
  ["completion-summary", 495, 530], ["completed-overview", 768, 1138],
  ["completed-tasks", 768, 1126], ["report-card", 580, 460], ["report-canvas", 1485, 768]
];
const frames = [...videoFrames.map(name => [name, 1920, 1080]), ...additionalFrames];
const screenshots = frames.map(([name]) => `03-prerequisites/images/copilot-app-${name}.png`);

test("the Copilot app lesson and its example are optional and discoverable", () => {
  for (const document of [path, examplePath]) {
    assert.ok(references.some(item => item.path === document));
    assert.ok(!chapters.some(item => item.path === document));
    assert.equal(parseRoute(routeForPath(document)).chapter.path, document);
    assert.ok(read("tools/check-language.py").includes(`"${document}"`));
  }
  assert.equal(chapters.filter(item => item.core).length, 7);
  assert.equal(references.find(item => item.path === path).navAfter, "prerequisites");
  assert.equal(references.find(item => item.path === path).era, "autopilot");
  assert.match(read("README.md"), /Alternative after Setup:[\s\S]*03-prerequisites\/copilot-app\.md/);
  assert.match(read("03-prerequisites/README.md"), /\[Modernize with the GitHub Copilot app\]\(copilot-app\.md\)/);
  assert.ok(read("llms.txt").includes(`/content/${path}`));
  assert.match(lesson, /\[Copilot app upgrade example\]\(\.\.\/examples\/assessments\/copilot-app\/README\.md\)/);
  assert.match(example, /\[Back: Copilot app lesson\]/);
});

test("Setup compares both workflows without changing their application checks", () => {
  const setup = read("03-prerequisites/README.md");
  assert.match(setup, /route-choices-light\.svg/);
  assert.match(setup, /Request each stage and review before continuing in Guided flow/);
  assert.match(setup, /Give one goal and let Autopilot carry the stages forward/);
  assert.match(setup, /Rewrite in place with EF Core/);
  assert.match(setup, /Keep EF6 during a temporary side-by-side move/);
  assert.match(setup, /Run the app and check a saved edit after restart/);
  assert.match(lesson, /autopilot-flow-light\.svg/);
});

test("the public lesson teaches actions instead of narrating source materials", () => {
  assert.match(lesson, /Give Copilot a goal and let it work through the upgrade/);
  assert.match(read("03-prerequisites/README.md"), /For a guided, automatic experience/);
  for (const heading of ["Add the BookCatalog folder", "Ask for the upgrade", "Follow the work in the dashboard",
    "Review the upgraded app", "Try BookCatalog on .NET 10"]) {
    assert.ok(lesson.includes(`## ${heading}`), heading);
  }
  assert.doesNotMatch(lesson,
    /the recording|the video|recorded run|later screenshots|supplied images|source commit|screenshot provenance|not a transcript|main prompt/i);
  assert.doesNotMatch(lesson, /11\/11|88:00|agent-reported completion/);
  assert.match(example, /## Source notes/);
});

test("one upgrade request starts the automatic workflow", () => {
  const prompt = lesson.match(/```text\r?\n([\s\S]*?)\r?\n```/)?.[1];
  assert.equal(prompt,
    "Update this folder to .NET 10, use the Canvas to support our upgrade.");
  assert.equal([...lesson.matchAll(/```text/g)].length, 1);
  assert.match(lesson, /don't need to send separate requests to assess, plan, execute, or continue between stages/);
  assert.doesNotMatch(lesson, /Guided|planning-only|Don't apply the retirement yet|Execute this scenario's reviewed plan/);
});

test("the learner checks the result and can steer host retirement without restarting the workflow", () => {
  assert.match(lesson, /side-by-side migration/);
  assert.match(lesson, /keeps Entity Framework 6 \(EF6\)/);
  assert.match(lesson, /Don't apply the Visual Studio route's EF Core database-recreation steps/);
  assert.match(lesson, /first check that the new host serves the catalog and saves book edits/);
  assert.match(lesson, /Remove the old \.NET Framework host and finish with the standalone \.NET 10 app/);
  assert.match(lesson, /Autopilot updates the plan/);
  assert.match(lesson, /Confirm that the changed title remains/);
});

test("run-specific completion evidence stays in the example, with actual checks in the lesson", () => {
  assert.match(example, /11\/11 tasks complete/);
  assert.match(example, /At 88:00, the video shows 9 of 11 tasks complete/);
  assert.match(example, /agent-reported completion, not independently rerun verification/);
  assert.match(example, /\*\*Not run yet\*\* and \*\*No build recorded in this session\*\*/);
  assert.match(example, /automated tests were not run/);
  assert.match(lesson, /Open the final report card or document in Canvas/);
  assert.match(lesson, /A completed task list doesn't replace trying the application yourself/);
  assert.match(lesson, /Finish when the \.NET 10 app builds, opens, and keeps a saved edit after restart/);
});

test("desktop setup attaches the folder, activates the built-in workflow, and approves tools automatically", () => {
  assert.match(lesson, /Select \*\*\+\*\* in the prompt box/);
  assert.match(lesson, /Select \*\*Folder\.\.\.\*\*/);
  assert.match(lesson, /Choose `shared-legacy-app` inside your learner copy/);
  assert.match(lesson, /The folder is added to the conversation context/);
  assert.match(lesson, /workflow is included in the app and activates when you ask/);
  assert.match(lesson, /select \*\*Autopilot\*\*/);
  assert.match(lesson, /\*\*Tool permissions\*\*, select \*\*Approve all\*\*/);
  assert.match(lesson, /run tools without asking for each operation/);
  assert.doesNotMatch(lesson, /upgrade-agent-plugins|install the Upgrade plugin|Ask every time|Open local folder|Add GitHub repository/);
  assert.doesNotMatch(lesson, /Don't approve Git commits|Follow your organization's rules|If the app creates a separate workspace/);
});

test("only the reviewed documents and images are public before staging", () => {
  const privateFiles = [
    "03-prerequisites/images/private-recording.mkv",
    "03-prerequisites/images/copilot-app-other.png",
    "03-prerequisites/private-notes.md",
    "examples/assessments/copilot-app/private-notes.md"
  ];
  assert.deepEqual(selectPublicContent([], [path, examplePath, ...screenshots, ...privateFiles]),
    [path, examplePath, ...screenshots].sort());
  const embedded = [...example.matchAll(/!\[[^\]]+\]\(\.\.\/\.\.\/\.\.\/([^)]+)\)/g)].map(match => match[1]);
  assert.deepEqual(embedded.sort(), [...screenshots].sort());
  for (const [name, width, height] of frames) {
    const screenshot = `03-prerequisites/images/copilot-app-${name}.png`;
    const png = readFileSync(join(root, screenshot));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", screenshot);
    assert.equal(png.readUInt32BE(16), width, screenshot);
    assert.equal(png.readUInt32BE(20), height, screenshot);
  }
  assert.match(example, /cropped to omit account details and personal filesystem paths/);
});

test("the built site includes both public documents and all selected frames", {
  skip: !existsSync(join(root, "_site")) && "Build the website before checking its artifact."
}, () => {
  assert.equal(read(`_site/content/${path}`), lesson);
  assert.equal(read(`_site/content/${examplePath}`), stripRepositoryOnlySections(example, examplePath));
  for (const screenshot of screenshots) {
    assert.deepEqual(readFileSync(join(root, "_site/content", screenshot)),
      readFileSync(join(root, screenshot)), screenshot);
  }
});
