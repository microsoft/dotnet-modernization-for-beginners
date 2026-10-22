import { cp, lstat, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { chapters, references } from "../scripts/chapters.js";
import { selectPublicContent } from "./public-content.mjs";
import { renderIllustrations } from "./render-illustrations.mjs";
import { illustrations, illustrationPath } from "../scripts/illustrations.js";
import { publishSite } from "./publish-site.mjs";
import { stripRepositoryOnlySections } from "./repo-only.mjs";
import { runPython } from "../../tools/python.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const output = join(root, "_site");
const stage = await mkdtemp(join(root, ".site-build-"));
async function copyPublicFile(path) {
  let source = root;
  for (const part of path.split("/")) {
    source = join(source, part);
    if ((await lstat(source)).isSymbolicLink()) throw new Error(`The source contains a symbolic link: ${path}`);
  }
  const destination = join(stage, "content", path);
  await mkdir(dirname(destination), { recursive: true });
  if (path.endsWith(".md")) {
    await writeFile(destination, stripRepositoryOnlySections(await readFile(source, "utf8"), path));
  } else {
    await cp(source, destination);
  }
}
function gitFiles(args) {
  const result = spawnSync("git", ["ls-files", "-z", ...args], { cwd: root, encoding: "utf8" });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr);
  return result.stdout.split("\0").filter(Boolean);
}
try {
  await renderIllustrations({ check: true });
  for (const path of ["index.html", "app.js", ".nojekyll", "scripts", "seasons"]) {
    await cp(join(root, "webpage", path), join(stage, path), { recursive: true, filter: source => !source.endsWith(".mjs") && !source.endsWith("README.md") });
  }
  await cp(join(root, "llms.txt"), join(stage, "llms.txt"));
  await mkdir(join(stage, "content"), { recursive: true });
  const publicFiles = selectPublicContent(gitFiles([]), gitFiles(["--others", "--exclude-standard"]));
  for (const document of [...chapters, ...references]) {
    if (!publicFiles.includes(document.path)) throw new Error(`Required public content is missing: ${document.path}`);
    const markdown = await readFile(join(root, document.path), "utf8");
    if (/^```mermaid\b/m.test(markdown)) throw new Error(`Replace the Mermaid block with an illustration: ${document.path}`);
  }
  for (const illustration of illustrations) {
    for (const mode of ["light", "dark"]) {
      const path = illustrationPath(illustration.id, mode);
      if (!publicFiles.includes(path)) throw new Error(`Required illustration is missing: ${path}`);
    }
  }
  for (const path of publicFiles) await copyPublicFile(path);
  await mkdir(join(stage, "vendor/github-slugger"), { recursive: true });
  await mkdir(join(stage, "assets"), { recursive: true });
  for (const [source, target] of [
    ["marked/lib/marked.umd.js", "vendor/marked.umd.js"],
    ["marked/LICENSE", "vendor/marked-LICENSE"],
    ["dompurify/dist/purify.min.js", "vendor/purify.min.js"],
    ["dompurify/LICENSE", "vendor/dompurify-LICENSE"],
    ["github-slugger/index.js", "vendor/github-slugger/index.js"],
    ["github-slugger/regex.js", "vendor/github-slugger/regex.js"],
    ["github-slugger/LICENSE", "vendor/github-slugger/LICENSE"],
    ["@fontsource/outfit/files/outfit-latin-700-normal.woff2", "assets/outfit-latin-700-normal.woff2"],
    ["@fontsource/outfit/LICENSE", "assets/Outfit-LICENSE"]
  ]) await cp(join(root, "node_modules", source), join(stage, target));
  await mkdir(join(stage, "downloads"));
  const packaged = runPython([join(root, "webpage/tools/package-samples.py"), join(stage, "content"), join(stage, "downloads/samples.zip")], { cwd: root });
  if (packaged.status !== 0) throw new Error(`Sample packaging failed with exit ${packaged.status}.`);
  await writeFile(join(stage, ".workshop-build"), "dotnet-modernization-workshop\n");
  let existing;
  try { existing = await lstat(output); } catch (error) { if (error.code !== "ENOENT") throw error; }
  if (existing) {
    if (existing.isSymbolicLink() || await readFile(join(output, ".workshop-build"), "utf8") !== "dotnet-modernization-workshop\n") {
      throw new Error("Refuse to replace an unknown _site directory.");
    }
    await rm(output, { recursive: true });
  }
  await publishSite(stage, output);
  console.log("The course artifact is ready in _site.");
} finally {
  await rm(stage, { recursive: true, force: true });
}
