import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const documents = [
  "README.md",
  "00-introduction/README.md",
  "01-assessment/README.md",
  "02-planning/README.md",
  "03-upgrade-execution/README.md",
  "04-cloud/README.md"
];

const themes = {
  light: {
    theme: "base",
    themeVariables: {
      background: "#fdfcff",
      primaryColor: "#f1eef8",
      primaryTextColor: "#211c28",
      primaryBorderColor: "#512bd4",
      lineColor: "#62596e",
      secondaryColor: "#e9e3f7",
      tertiaryColor: "#ffffff"
    }
  },
  dark: {
    theme: "base",
    themeVariables: {
      background: "#110e17",
      primaryColor: "#211a2b",
      primaryTextColor: "#f5f2f8",
      primaryBorderColor: "#8f78ff",
      lineColor: "#b7adbf",
      secondaryColor: "#2b1f3a",
      tertiaryColor: "#18131f"
    }
  }
};
const rendererFingerprint = JSON.stringify({ version: 2, themes });

const [contentArgument, outputArgument] = process.argv.slice(2);
if (!contentArgument || !outputArgument) {
  throw new Error("Usage: node render-mermaid.mjs <content-directory> <output-directory>");
}

const contentDirectory = resolve(contentArgument);
const outputDirectory = resolve(outputArgument);
const temporaryDirectory = await mkdtemp(join(tmpdir(), "dotnet-modernization-mermaid-"));
const manifest = { version: 1, documents: {} };
const rendered = new Set();

function diagramTitle(markdown, diagramIndex) {
  const prefix = markdown.slice(0, diagramIndex);
  const headings = [...prefix.matchAll(/^#{1,6}\s+(.+)$/gm)];
  const heading = headings.at(-1)?.[1].replace(/[*_`]/g, "").trim();
  return heading ? `${heading} diagram` : "Course diagram";
}

function sourceForTheme(source, textColor) {
  return source.replace(
    /(\bclassDef\b[^\r\n]*\bcolor:)#[0-9a-fA-F]{3,8}/g,
    `$1${textColor}`
  );
}

function renderDiagram(sourceFile, outputFile, configFile, backgroundColor, puppeteerConfigFile) {
  const executable = process.platform === "win32" ? "mmdc.cmd" : "mmdc";
  const argumentsList = [
    "--input", sourceFile,
    "--output", outputFile,
    "--configFile", configFile,
    "--backgroundColor", backgroundColor,
    "--quiet"
  ];

  if (puppeteerConfigFile) {
    argumentsList.push("--puppeteerConfigFile", puppeteerConfigFile);
  }

  const result = spawnSync(executable, argumentsList, {
    encoding: "utf8",
    shell: process.platform === "win32"
  });

  if (result.status !== 0) {
    throw new Error(result.error?.message || result.stderr || result.stdout || `Mermaid CLI exited with status ${result.status}`);
  }
}

try {
  await mkdir(outputDirectory, { recursive: true });
  const configFiles = {};

  for (const [theme, config] of Object.entries(themes)) {
    const configFile = join(temporaryDirectory, `${theme}.json`);
    await writeFile(configFile, JSON.stringify(config));
    configFiles[theme] = configFile;
  }

  let puppeteerConfigFile;
  if (process.env.CI === "true") {
    puppeteerConfigFile = join(temporaryDirectory, "puppeteer.json");
    await writeFile(puppeteerConfigFile, JSON.stringify({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }));
  }

  for (const documentPath of documents) {
    const markdown = await readFile(join(contentDirectory, documentPath), "utf8");
    const diagrams = [...markdown.matchAll(/```mermaid[^\r\n]*\r?\n([\s\S]*?)```/g)];
    manifest.documents[documentPath] = [];

    for (const [index, match] of diagrams.entries()) {
      const source = match[1].trim();
      const hash = createHash("sha256")
        .update(rendererFingerprint)
        .update("\0")
        .update(source)
        .digest("hex")
        .slice(0, 16);

      if (!rendered.has(hash)) {
        for (const [theme, config] of Object.entries(themes)) {
          const sourceFile = join(temporaryDirectory, `${hash}-${theme}.mmd`);
          await writeFile(sourceFile, sourceForTheme(source, config.themeVariables.primaryTextColor));
          renderDiagram(
            sourceFile,
            join(outputDirectory, `${hash}-${theme}.svg`),
            configFiles[theme],
            config.themeVariables.background,
            puppeteerConfigFile
          );
        }

        rendered.add(hash);
      }

      manifest.documents[documentPath].push({
        light: `diagrams/${hash}-light.svg`,
        dark: `diagrams/${hash}-dark.svg`,
        alt: diagramTitle(markdown, match.index),
        index
      });
    }
  }

  await writeFile(join(outputDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Rendered ${rendered.size} unique Mermaid diagrams in light and dark themes.`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}