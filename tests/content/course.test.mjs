import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { chapters, references } from "../../webpage/scripts/chapters.js";
import { normalizePath, parseRoute, routeForPath } from "../../webpage/scripts/routes.js";
import { createProgressStore } from "../../webpage/scripts/state.js";
import { eras, eraPalette, getEra, referenceEra } from "../../webpage/scripts/eras.js";
import { illustrations, illustrationPath } from "../../webpage/scripts/illustrations.js";
import { zipEntries } from "./zip-entries.mjs";
import { selectPublicContent } from "../../webpage/tools/public-content.mjs";
import { stripRepositoryOnlySections } from "../../webpage/tools/repo-only.mjs";

const root = resolve(import.meta.dirname, "../..");
const read = path => readFileSync(join(root, path), "utf8");
function firstModernizationPrompt(text) {
  const match = text.match(/```text\r?\n(@Modernize [\s\S]*?)```/);
  assert.ok(match, "The lesson must include a copyable modernization prompt.");
  return match[1];
}
const documents = [...chapters, ...references].map(item => item.path);
const recordedBookCatalogFiles = [
  "examples/assessments/bookcatalog/README.md",
  "examples/assessments/bookcatalog/assessment-excerpts.md",
  "examples/assessments/bookcatalog/planning-excerpts.md",
  "examples/assessments/bookcatalog/execution-excerpts.md",
  ...["legacy-preview", "ch1-1-upgrade-agent-dashboard", "ch1-2-dashboard-assessment",
    "ch1-3-assessment-view", "ch2-1-dashboard-plan", "ch3-1-dashboard-task1-done",
    "ch3-2-most-tasks-complete"].map(name => `examples/assessments/bookcatalog/images/${name}.png`)
];

test("the shared page head includes Clarity tracking", () => {
  const html = read("webpage/index.html");
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, "The shared page must have a head element.");
  assert.match(head, /<script type="text\/javascript">[\s\S]*https:\/\/www\.clarity\.ms\/tag\/[\s\S]*"ynx84zjbvb"[\s\S]*<\/script>/);
  assert.equal(html.match(/https:\/\/www\.clarity\.ms\/tag\//g)?.length, 1);
});

test("the published site retains the shared page shell", {
  skip: !existsSync(join(root, "_site")) && "Build the website before checking its artifact."
}, () => {
  assert.equal(read("_site/index.html"), read("webpage/index.html"));
});

test("each chapter has the planned era and complete palettes", () => {
  assert.deepEqual(chapters.map(chapter => chapter.era),
    ["1960s", "1970s", "soundcheck", "1980s", "1990s", "2000s-2010s", "2020s"]);
  const keys = Object.keys(eraPalette("1960s", "light")).sort();
  for (const [id, era] of Object.entries(eras)) {
    assert.ok(existsSync(join(root, "webpage/assets", era.art)));
    if (era.artDark) assert.ok(existsSync(join(root, "webpage/assets", era.artDark)));
    for (const mode of ["light", "dark"]) {
      const palette = eraPalette(id, mode);
      assert.deepEqual(Object.keys(palette).sort(), keys);
      assert.ok(Object.values(palette).every(value => typeof value === "string" && value.length));
    }
  }
  assert.equal(referenceEra, "2020s");
  assert.throws(() => getEra("unknown"), /Unknown visual era/);
  assert.throws(() => eraPalette("1960s", "unknown"), /Unknown color mode/);
});

test("all declared local links and images resolve", () => {
  const failures = [];
  for (const path of documents) {
    for (const match of read(path).matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = match[1].split("#")[0].split("?")[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      if (!existsSync(resolve(root, dirname(path), target))) failures.push(`${path}: ${target}`);
    }
  }
  assert.deepEqual(failures, []);
});

test("repository-only guidance stays out of the course site", {
  skip: !existsSync(join(root, "_site")) && "Build the website before checking its artifact."
}, () => {
  const readmes = documents.filter(path => path === "README.md" || path.endsWith("/README.md"));
  for (const path of readmes) {
    const source = read(path);
    const siteUrl = `https://microsoft.github.io/dotnet-modernization-for-beginners/${routeForPath(path)}`;
    assert.match(source, /<!-- repo-only:start -->[\s\S]*<!-- repo-only:end -->/);
    assert.ok(source.includes(siteUrl), `${path} should link to its generated page`);
    assert.doesNotMatch(read(`_site/content/${path}`), /Prefer the web experience/);
  }
  assert.equal(stripRepositoryOnlySections("before\n<!-- repo-only:start -->\nhidden\n<!-- repo-only:end -->\nafter"),
    "before\nafter");
  assert.throws(() => stripRepositoryOnlySections("<!-- repo-only:start -->\nmissing end", "README.md"),
    /unbalanced/);
});

test("manifest preserves identifiers and the sequential chapter path", () => {
  assert.deepEqual(chapters.map(chapter => [chapter.slug, chapter.number]), [
    ["overview", "01"], ["00-introduction", "02"], ["prerequisites", "03"],
    ["01-assessment", "04"], ["02-planning", "05"], ["03-upgrade-execution", "06"], ["04-cloud", "07"]
  ]);
  assert.equal(chapters.filter(chapter => chapter.core).length, 7);
  assert.equal(chapters.find(chapter => chapter.slug === "overview").core, true);
  assert.equal(chapters.find(chapter => chapter.slug === "04-cloud").core, true);
  assert.ok(chapters.filter(chapter => chapter.core).every(chapter => chapter.exerciseRevision > 1));
  assert.ok(references.some(item => item.path === "07-cloud/deployment.md"));
  assert.ok(references.some(item => item.path === "docs/learner-record.md"));
  assert.ok(references.some(item => item.path === "docs/instructor-guide.md"));
  assert.ok(references.some(item => item.path === "tools/BookCatalog.Data/README.md"));
  for (const path of ["docs/data-transfer.md", "docs/advanced-checks.md", "docs/author-filter.md",
    "examples/assessments/bookcatalog/README.md"]) {
    assert.ok(references.some(item => item.path === path));
    assert.ok(!chapters.some(item => item.path === path));
  }
  assert.equal(new Set(documents).size, documents.length);
  for (const item of [...chapters, ...references]) assert.ok(existsSync(join(root, item.path)));
});

test("chapter source folders match course numbers without changing progress identifiers", () => {
  assert.equal(chapters[0].path, "README.md");
  for (const chapter of chapters.slice(1)) {
    assert.ok(chapter.path.startsWith(`${chapter.number}-`), chapter.path);
    assert.ok(!existsSync(join(root, chapter.slug)), `Remove the old ${chapter.slug} folder.`);
    assert.equal(parseRoute(`#/${chapter.slug}`).chapter.path, chapter.path);
    assert.equal(routeForPath(chapter.path), `#/${chapter.slug}`);
    assert.equal(routeForPath(`${chapter.slug}/README.md`), `#/${chapter.slug}`);
  }
});

test("routes constrain references and preserve sections", () => {
  assert.equal(routeForPath("04-assessment/../README.md", "-prerequisites"), "#/overview?section=-prerequisites");
  assert.equal(routeForPath("07-cloud/deployment.md", "delete-the-dedicated-lab-group"),
    "#/reference?path=07-cloud%2Fdeployment.md&section=delete-the-dedicated-lab-group");
  assert.equal(parseRoute("#/reference?path=docs%2Fvalidation.md").chapter.path, "docs/validation.md");
  assert.equal(routeForPath("03-prerequisites/README.md", "run-bookcatalog"),
    "#/prerequisites?section=run-bookcatalog");
  assert.equal(parseRoute("#/prerequisites").chapter.number, "03");
  assert.throws(() => parseRoute("#/reference?path=../../secret"), /not in the course/);
  assert.throws(() => normalizePath("../../secret"), /leaves the course/);
  assert.throws(() => parseRoute("#/unknown"), /not in the course/);
});

test("old reference links resolve to the renamed chapter folders", () => {
  for (const [oldPath, newPath] of [
    ["00-introduction/code/README.md", "02-introduction/code/README.md"],
    ["04-cloud/deployment.md", "07-cloud/deployment.md"]
  ]) {
    const route = routeForPath(newPath, "reference");
    assert.equal(routeForPath(oldPath, "reference"), route);
    const parsed = parseRoute(`#/reference?path=${encodeURIComponent(oldPath)}&section=reference`);
    assert.equal(parsed.chapter.path, newPath);
    assert.equal(parsed.section, "reference");
  }
  assert.throws(() => parseRoute("#/reference?path=04-cloud%2Fprivate.md"), /not in the course/);
  assert.throws(() => parseRoute("#/reference?path=..%2F..%2Fsecret"), /not in the course/);
});

test("the completed reference has its own future era without adding a course step", () => {
  const reference = parseRoute("#/reference?path=examples%2Fmodernized%2FREADME.md").chapter;
  assert.equal(reference.era, "2050s");
  assert.equal(reference.slug, "reference");
  assert.ok(!reference.core);
  assert.deepEqual(references.filter(item => item.era).map(item => item.path),
    ["shared-legacy-app/README.md", "examples/modernized/README.md",
      "examples/assessments/bookcatalog/README.md", "docs/instructor-guide.md"]);
  assert.ok(existsSync(join(root, "webpage/assets", getEra("2050s").art)));
  assert.equal(routeForPath(reference.path), "#/reference?path=examples%2Fmodernized%2FREADME.md");
});

test("the previous sample run has its own logbook theme without claiming a completed upgrade", () => {
  const path = "examples/assessments/bookcatalog/README.md";
  const reference = parseRoute(`#/reference?path=${encodeURIComponent(path)}`).chapter;
  assert.equal(reference.title, "Previous BookCatalog sample run");
  assert.equal(reference.era, "1950s");
  assert.ok(!reference.core);
  assert.match(read(path), /# BookCatalog: a previous sample run/);
  assert.match(read(path), /not a completed upgrade/);
  assert.match(read(path), /id="bookcatalog-visual-studio-recording"/);
  assert.match(read(path), /id="recording-environment"/);
  assert.match(read("README.md"), /\[Previous BookCatalog sample run\]/);
  const art = read(`webpage/assets/${getEra("1950s").art}`);
  assert.match(art, /<title>BookCatalog test-flight notes<\/title>/);
  assert.doesNotMatch(art, /<script|<image|<animate|(?:href|src)=["']https?:/i);
  assert.ok(!references.find(item => item.path.endsWith("bookcatalog/assessment-excerpts.md")).era);
});

test("Samples and help keeps useful themed references and excludes the old console report", () => {
  const section = read("README.md").split("## Samples and help")[1].split("## Contributing")[0];
  const links = [...section.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(match => match[1]);
  const local = links.filter(path => !path.startsWith("https:"));
  assert.deepEqual(local, ["shared-legacy-app/README.md", "examples/modernized/README.md",
    "examples/assessments/bookcatalog/README.md", "docs/instructor-guide.md"]);
  for (const path of local) assert.ok(references.find(item => item.path === path)?.era, path);
  const themes = local.map(path => references.find(item => item.path === path).era);
  assert.equal(new Set(themes).size, local.length, "Every Samples and help page needs a distinct theme.");
  for (const theme of themes) {
    assert.ok(!chapters.some(chapter => chapter.era === theme), "Support pages must not reuse chapter themes.");
  }
  assert.equal(new Set(themes.map(theme => getEra(theme).art)).size, local.length,
    "Support page headers must have distinct artwork.");
  assert.equal(links.length, 7);
  assert.ok(!existsSync(join(root, "examples/assessments/README.md")));
  assert.ok(!existsSync(join(root, "examples/assessments/simple-legacy-app")));
  assert.deepEqual(selectPublicContent(["examples/assessments/simple-legacy-app/assessment.json"], []), []);
});

function memory(entries = []) {
  const values = new Map(entries);
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
test("old reading marks do not award new activity completion", () => {
  const storage = memory([["dotnet-modernization-course-progress", '["overview","01-assessment","unknown"]'], ["other-app", "keep"]]);
  const store = createProgressStore(storage, "course");
  assert.deepEqual(store.value.previousReading, ["overview", "01-assessment"]);
  assert.deepEqual(store.value.completed, []);
  store.toggle("01-assessment");
  store.visit("01-assessment");
  store.theme("dark");
  const reloaded = createProgressStore(storage, "course");
  assert.deepEqual(reloaded.value.completed, ["01-assessment"]);
  assert.equal(reloaded.value.lastVisited, "01-assessment");
  reloaded.reset();
  assert.deepEqual(reloaded.value.completed, []);
  assert.equal(reloaded.value.theme, "dark");
  assert.equal(storage.values.get("other-app"), "keep");
  assert.equal(storage.values.get("dotnet-modernization-course-progress"), '["overview","01-assessment","unknown"]');
});
test("unavailable storage reports its limit and retains in-session changes", () => {
  const store = createProgressStore({ getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } }, "course");
  store.toggle("01-assessment");
  assert.deepEqual(store.value.completed, ["01-assessment"]);
  assert.match(store.warning, /this visit/);
  assert.throws(() => store.toggle("bad"), /Unknown/);
});
test("malformed progress recovers without deleting other data", () => {
  const storage = memory([["course", "{invalid"], ["other-app", "keep"]]);
  const store = createProgressStore(storage, "course");
  assert.match(store.warning, /could not read/);
  store.toggle("02-planning");
  assert.deepEqual(createProgressStore(storage, "course").value.completed, ["02-planning"]);
  assert.equal(storage.values.get("other-app"), "keep");
  const invalidFields = memory([["course", '{"version":2,"completed":"not-an-array"}']]);
  assert.match(createProgressStore(invalidFields, "course").warning, /could not read/);
});

test("starter stays classic and uses a stable SDK policy", () => {
  const project = read("shared-legacy-app/src/BookCatalog.Web/BookCatalog.Web.csproj");
  assert.match(project, /<TargetFrameworkVersion>v4.8/);
  assert.doesNotMatch(project, /<Project Sdk=/);
  assert.match(read("shared-legacy-app/src/BookCatalog.Web/Web.config"), /AttachDbFilename=/);
  for (const path of ["shared-legacy-app/global.json", "examples/modernized/global.json"]) {
    const { sdk } = JSON.parse(read(path));
    assert.equal(sdk.version, "10.0.100");
    assert.equal(sdk.rollForward, "latestMajor");
    assert.equal(sdk.allowPrerelease, false);
  }
});
test("new lesson prose does not restore the recorded-run guarantees", () => {
  const prose = chapters.map(chapter => read(chapter.path)).join("\n");
  for (const obsolete of ["No Source Control", "Skip source control", "one-developer, few-day", "AdminController.cs",
    ".github/upgrades/scenarios/dotnet-version-upgrade", "watched the agent auto-recover", "no global.json exists"]) {
    assert.ok(!prose.toLowerCase().includes(obsolete.toLowerCase()), obsolete);
  }
  assert.ok(!existsSync(join(root, ".github/upgrades/scenarios/dotnet-version-upgrade/scenario.json")));
});
test("setup uses a copyable official clone and accepts newer stable SDKs", () => {
  const setup = read("03-prerequisites/README.md");
  assert.match(setup, /git clone https:\/\/github\.com\/microsoft\/dotnet-modernization-for-beginners\.git bookcatalog-course/);
  assert.doesNotMatch(setup, /<course-repository-url>/);
  assert.match(setup, /stable SDK version of `10\.0\.100` or later/);
  assert.doesNotMatch(setup, /`10\.0\.401` is supported/);
  assert.match(setup, /later stable major versions/i);
  assert.match(setup, /Visual Studio Installer[\s\S]*Individual components/);
});
test("assessment uses the recorded dashboard workflow without a mandatory report edit", () => {
  const assessment = read("04-assessment/README.md");
  assert.match(assessment, /Why assess the app/);
  assert.match(assessment, /team or management/);
  assert.match(assessment, /First, send just `@Modernize`/);
  assert.match(assessment, /@Modernize open the web version of the dashboard/);
  assert.match(assessment, /Upgrade Agent Dashboard/);
  assert.match(assessment, /Keep it unchanged/);
  assert.match(assessment, /zero packages[\s\S]*seven package issues/);
  assert.doesNotMatch(assessment, /<details>|Earlier detailed-review links|Copilot writes the report/);
});
test("lessons introduce concepts before prompts and application inspections", () => {
  const introduction = read("02-introduction/README.md");
  assert.match(introduction, /Entity Framework 6 \(EF6\)[\s\S]*reads and saves book records/);
  assert.match(introduction, /`BooksController` asks `ApplicationDbContext` for the active books/);
  assert.match(introduction, /schema[\s\S]*tables and columns/);
  assert.match(introduction, /Seed data[\s\S]*sample content/);
  assert.doesNotMatch(introduction, /Earlier setup and exercise links|Setup has moved to/);
  const setup = read("03-prerequisites/README.md");
  assert.match(setup, /Date Added[\s\S]*`CreatedDate`/);
  const assessment = read("04-assessment/README.md");
  const assessmentPrompt = assessment.indexOf("```text");
  for (const term of ["**Guided mode**", "**scenario**"]) {
    const definition = assessment.indexOf(term);
    assert.ok(definition >= 0 && definition < assessmentPrompt, `${term} must precede the assessment prompt.`);
  }
  const planning = read("05-planning/README.md");
  const definition = planning.indexOf("**in-place upgrade**");
  assert.ok(definition >= 0 && definition < planning.indexOf("```text"));
  const execution = read("06-upgrade-execution/README.md");
  const injection = execution.indexOf("**dependency injection**");
  assert.ok(injection >= 0 && injection < execution.indexOf("| `Program.cs`"));
  const cloud = read("07-cloud/README.md");
  for (const term of ["**subscription**", "**resource group**", "**region**"]) {
    const definition = cloud.indexOf(term);
    assert.ok(definition >= 0 && definition < cloud.indexOf("Keep local BookCatalog development working"), term);
  }
});
test("the reviewed plan owns the demo scope without preservation or side-by-side prerequisites", () => {
  const planning = read("05-planning/README.md");
  const execution = read("06-upgrade-execution/README.md");
  assert.ok(planning.indexOf("## Ask for the plan") < planning.indexOf("## Understand the choices"));
  const prompt = firstModernizationPrompt(planning);
  assert.match(prompt, /only BookCatalog\.Web in place[\s\S]*EF Core/i);
  assert.match(prompt, /ASP\.NET Core APIs directly[\s\S]*without a second web app or compatibility adapters/);
  assert.match(prompt, /BookCatalogModernizedLab/);
  assert.match(prompt, /Only that disposable database may be recreated/);
  assert.match(prompt, /Don't transfer old records/i);
  assert.match(prompt, /Saved edits must survive normal app restarts/i);
  assert.match(prompt, /Stop for review without changing application code or creating Git commits/);
  for (const lesson of [planning, execution]) {
    assert.doesNotMatch(lesson, /Leave the legacy database unchanged|separate-database boundary|finish its export first|import your snapshot|Stop before the first upgraded-app launch/i);
  }
  assert.match(planning, /Direct Migration to ASP\.NET Core APIs/);
  assert.match(planning, /You may also see `upgrade-options\.md`/);
  assert.doesNotMatch(execution, /## If the agent keeps working on database preservation/);
  assert.doesNotMatch(execution, /still in progress after more than five hours/);
});
test("execution follows the saved plan and retains approval and reporting boundaries", () => {
  const execution = read("06-upgrade-execution/README.md");
  const prompt = firstModernizationPrompt(execution);
  assert.match(execution, /saved plan and `scenario-instructions\.md` contain the scope you reviewed/i);
  assert.match(prompt, /Execute this scenario's reviewed plan/);
  assert.match(prompt, /Follow the plan through to completion/);
  assert.match(prompt, /Build the app and report which checks ran/);
  assert.match(prompt, /Visual Studio profile[\s\S]*app-use checks remain/);
  assert.match(prompt, /Don't create Git commits, create Azure resources, or deploy/);
  assert.match(execution, /only `BookCatalogModernizedLab`, not the original database/);
  assert.match(execution, /keeping saved edits across normal restarts/);
  assert.match(execution, /checks it didn't run marked \*\*not run\*\*/);
  assert.match(execution, /^> \*\*It may take up to an hour\.\*\*/m);
  assert.match(execution, /^> .*tell the agent to `continue`/m);
});
test("cloud assessment starts in chat without the old deployment-links panel", () => {
  const cloud = read("07-cloud/README.md");
  assert.match(cloud, /Start the process from Copilot Chat/);
  assert.match(cloud, /Back to course overview/);
  assert.doesNotMatch(cloud, /Right-click the solution|Earlier activities and deployment links|<details>/);
});
test("optional application preparation retains the Azure helper contract", () => {
  const deployment = read("07-cloud/deployment.md");
  const prompt = firstModernizationPrompt(deployment);
  for (const setting of ["KeyVaultName", "AZURE_CLIENT_ID", "InitializeDatabase", "BookCatalogModernizedLab"]) {
    assert.ok(prompt.includes(setting), setting);
  }
  assert.match(prompt, /user-assigned managed identity/);
  assert.match(prompt, /local startup independent of Azure/);
  assert.match(prompt, /saved edits across restarts/);
  assert.match(prompt, /Disable automatic schema creation in Azure/);
  assert.match(prompt, /schema SQL, including the demo seed books, without a live database connection/);
  assert.match(prompt, /Don't create Azure resources, deploy, or commit/);
});
test("cloud reference keeps initialization and identity permissions separate", () => {
  assert.match(read("examples/azure/main.bicep"), /azureADOnlyAuthentication: true/);
  assert.match(read("examples/azure/main.bicep"), /name: 'InitializeDatabase', value: 'false'/);
  assert.doesNotMatch(read("examples/azure/main.bicep"), /administratorLoginPassword/);
  assert.doesNotMatch(read("examples/azure/lab.mjs"), /db_owner|db_ddladmin/);
  assert.match(read("examples/azure/lab.mjs"), /GRANT SELECT, INSERT, UPDATE, DELETE ON OBJECT::dbo.Books/);
});
test("sample source downloads retain required project source", {
  skip: !existsSync(join(root, "_site")) && "Build the website before checking its artifact."
}, () => {
  assert.ok(existsSync(join(root, "_site/content/shared-legacy-app/src/BookCatalog.Web/Properties/AssemblyInfo.cs")));
  assert.ok(existsSync(join(root, "_site/content/shared-legacy-app/NuGet.Config")));
  const walk = path => readdirSync(path, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(path, entry.name)) : [join(path, entry.name)]);
  const files = walk(join(root, "_site/content"));
  assert.ok(!files.some(path => /[/\\](bin|obj|packages|history|\.bookcatalog-lab|\.azure-lab)[/\\]/i.test(path)));
  const entries = zipEntries(readFileSync(join(root, "_site/downloads/samples.zip")));
  assert.deepEqual([...entries.keys()].filter(path => path.startsWith("examples/assessments/bookcatalog/")).sort(),
    [...recordedBookCatalogFiles].sort(), "The ZIP must contain only the reviewed BookCatalog evidence files.");
  for (const path of [
    "tools/BookCatalog.Data/README.md", "tools/BookCatalog.Data/BookCatalog.Data.csproj",
    "tests/BookCatalog.Data.Tests/BookCatalog.Data.Tests.csproj",
    "tests/BookCatalog.Tests/BookCatalog.Tests.csproj", "scripts/Test-DataTransfer.ps1",
    "scripts/Test-LegacyApp.ps1", "scripts/Test-ModernizedApp.ps1", "docs/learner-record.md", "docs/instructor-guide.md",
    "docs/data-transfer.md", "docs/advanced-checks.md", "docs/author-filter.md",
    ...recordedBookCatalogFiles,
    "07-cloud/deployment.md", ".config/dotnet-tools.json",
    "examples/modernized/compose.yaml", "examples/modernized/Start-BookCatalog.ps1",
    "examples/modernized/Test-Quickstart.ps1", "examples/modernized/.gitignore",
    "shared-legacy-app/src/BookCatalog.Web/Properties/AssemblyInfo.cs",
    "examples/modernized/src/BookCatalog.Web/Program.cs", "DOWNLOAD-README.txt"
  ]) assert.ok(entries.get(path)?.length > 0, path);
  assert.ok([...entries.keys()].some(path => /^tools\/BookCatalog.Data\/.*\.cs$/.test(path)));
  assert.ok([...entries.keys()].some(path => /^tests\/BookCatalog.Data.Tests\/.*\.cs$/.test(path)));
  assert.ok(![...entries.keys()].some(path =>
    /(^|\/)(bin|obj|packages|history|\.bookcatalog-lab|\.azure-lab|snapshots|secrets\.json)(\/|$)|\.(mdf|ldf|pfx)$/i.test(path)));
  assert.match(entries.get("README.md").toString("utf8"),
    /https:\/\/github.com\/microsoft\/dotnet-modernization-for-beginners\/blob\/main\/02-introduction\/README.md/);
  const brokenLinks = [];
  for (const [path, bytes] of entries) {
    if (!path.endsWith(".md")) continue;
    for (const match of bytes.toString("utf8").matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = match[1].split("#")[0].split("?")[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      const resolved = normalizePath(`${path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : ""}${target}`);
      if (!entries.has(resolved) && ![...entries.keys()].some(name => name.startsWith(`${resolved}/`))) {
        brokenLinks.push(`${path}: ${target}`);
      }
    }
  }
  assert.deepEqual(brokenLinks, [], "ZIP Markdown links and images must resolve without a repository checkout.");
  for (const illustration of illustrations) {
    for (const mode of ["light", "dark"]) {
      const path = illustrationPath(illustration.id, mode);
      assert.equal(read(`_site/content/${path}`), read(path));
      assert.ok(entries.get(path)?.length > 0, path);
    }
  }
});

test("public previews include authored helper files without exposing untracked local data", () => {
  const safe = [
    "tools/BookCatalog.Data/Program.cs", "tools/BookCatalog.Data/BookCatalog.Data.csproj",
    "tools/BookCatalog.Data/README.md", "tests/BookCatalog.Data.Tests/TransferTests.cs",
    "scripts/Test-DataTransfer.ps1", "docs/learner-record.md", "docs/instructor-guide.md", "07-cloud/deployment.md",
    "docs/illustrations/journey-light.svg", "docs/illustrations/azure-dark.svg",
    "docs/illustrations/soundcheck-light.svg", "docs/illustrations/soundcheck-dark.svg",
    "03-prerequisites/README.md", "docs/data-transfer.md", "docs/advanced-checks.md", "docs/author-filter.md",
    "examples/modernized/compose.yaml", "examples/modernized/Start-BookCatalog.ps1",
    "examples/modernized/Test-Quickstart.ps1", "examples/modernized/.gitignore",
    ...recordedBookCatalogFiles
  ];
  const privateFiles = [
    "tools/BookCatalog.Data/.bookcatalog-lab/records.json", "tools/BookCatalog.Data/snapshot.json",
    "tools/BookCatalog.Data/private-notes.md", "tools/BookCatalog.Data/bin/Generated.cs",
    "tools/BookCatalog.Data/secrets.json", "shared-legacy-app/App_Data/books.mdf",
    "docs/private-notes.md", "scripts/private-script.ps1", "examples/azure/.env",
    "examples/azure/.azure-lab/state.json", "docs/illustrations/private.svg", "docs/illustrations/private-notes.md",
    "examples/modernized/.env", "examples/modernized/.env.local", "examples/modernized/private-compose.yaml",
    "examples/modernized/private-helper.ps1",
    "examples/assessments/bookcatalog/private-notes.md", "examples/assessments/bookcatalog/assessment.json",
    "examples/assessments/bookcatalog/images/private.png", "examples/assessments/bookcatalog/.appmod/report.md",
    "examples/assessments/bookcatalog/.github/upgrades/run/assessment.md", "examples/assessments/bookcatalog/books.mdf",
    "examples/assessments/bookcatalog/final-mod-agent-files/tasks.md",
    "examples/assessments/bookcatalog/runtime-acceptance.md",
    "examples/assessments/bookcatalog/images/ch4-private-dashboard.png"
  ];
  assert.deepEqual(selectPublicContent([], [...safe, ...privateFiles]), [...safe].sort());
  assert.deepEqual(selectPublicContent(["07-cloud/example.bicep", "04-cloud/obsolete.bicep"], []),
    ["07-cloud/example.bicep"], "Tracked chapter support files must use the new folder roots.");
  const rawEvidence = privateFiles.filter(path => path.startsWith("examples/assessments/bookcatalog/"));
  assert.deepEqual(selectPublicContent([...recordedBookCatalogFiles, ...rawEvidence], []),
    [...recordedBookCatalogFiles].sort(), "Tracking raw evidence must not make it public.");
  assert.deepEqual(selectPublicContent([
    "examples/azure/secrets.json", "examples/azure/.bookcatalog-lab/records.json",
    "examples/modernized/.env", "examples/modernized/.env.local", "examples/modernized/private-compose.yaml",
    "examples/modernized/appsettings.Test.Local.json", "tools/BookCatalog.Data/obj/Generated.cs",
    "examples/assessments/bookcatalog/private-notes.md", "examples/assessments/bookcatalog/assessment.json",
    "examples/assessments/bookcatalog/images/private.png", "shared-legacy-app/.appmod/report.md",
    "shared-legacy-app/.github/upgrades/run/assessment.md", "examples/assessments/bookcatalog/books.mdf"
  ], []), []);
});

test("validation covers data transfer without publishing feature branches", () => {
  const validation = read(".github/workflows/course-validation.yml");
  assert.match(validation, /dotnet test tests\/BookCatalog\.Data\.Tests\/BookCatalog\.Data\.Tests\.csproj/);
  assert.match(validation, /windows-legacy:[\s\S]*runs-on: windows-latest[\s\S]*scripts\/Test-DataTransfer\.ps1/);
  assert.match(validation, /scripts\/Test-DataTransfer\.ps1[\s\S]*scripts\/Test-ModernizedApp\.ps1/);
  assert.doesNotMatch(validation, /actions\/deploy-pages|pages: write/);
  const pages = read(".github/workflows/pages.yml");
  assert.match(pages, /deploy:\s+if: github\.ref == 'refs\/heads\/main'\s+needs: validate/);
});
