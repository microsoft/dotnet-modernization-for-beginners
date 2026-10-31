import { extname } from "node:path";
import { chapters, references } from "../scripts/chapters.js";
import { illustrations, illustrationPath } from "../scripts/illustrations.js";

const exact = new Set([
  ...chapters.map(item => item.path), ...references.map(item => item.path),
  ...illustrations.flatMap(item => ["light", "dark"].map(mode => illustrationPath(item.id, mode))),
  "LICENSE", "package.json", "package-lock.json", ".config/dotnet-tools.json", "webpage/seasons/README.md",
  "scripts/Test-DataTransfer.ps1", "scripts/Test-ModernizedApp.ps1",
  "examples/modernized/.gitignore",
  "examples/modernized/compose.yaml",
  "examples/modernized/Start-BookCatalog.ps1",
  "examples/modernized/Test-Quickstart.ps1",
  "03-prerequisites/images/copilot-app-request.png",
  "03-prerequisites/images/copilot-app-add-folder.png",
  "03-prerequisites/images/copilot-app-assessment.png",
  "03-prerequisites/images/copilot-app-baseline.png",
  "03-prerequisites/images/copilot-app-core-host.png",
  "03-prerequisites/images/copilot-app-views.png",
  "03-prerequisites/images/copilot-app-validation.png",
  "03-prerequisites/images/copilot-app-retirement-decision.png",
  "03-prerequisites/images/copilot-app-completion-report.png",
  "03-prerequisites/images/copilot-app-completion-summary.png",
  "03-prerequisites/images/copilot-app-completed-overview.png",
  "03-prerequisites/images/copilot-app-completed-tasks.png",
  "03-prerequisites/images/copilot-app-report-card.png",
  "03-prerequisites/images/copilot-app-report-canvas.png",
  "examples/assessments/bookcatalog/images/legacy-preview.png",
  "examples/assessments/bookcatalog/images/ch1-1-upgrade-agent-dashboard.png",
  "examples/assessments/bookcatalog/images/ch1-2-dashboard-assessment.png",
  "examples/assessments/bookcatalog/images/ch1-3-assessment-view.png",
  "examples/assessments/bookcatalog/images/ch2-1-dashboard-plan.png",
  "examples/assessments/bookcatalog/images/ch3-1-dashboard-task1-done.png",
  "examples/assessments/bookcatalog/images/ch3-2-most-tasks-complete.png"
]);
const roots = [
  ...chapters.slice(1).map(item => item.path.split("/")[0]), "shared-legacy-app", "examples/modernized",
  "examples/azure", "tests/BookCatalog.Tests",
  "tests/BookCatalog.Data.Tests", "tools/BookCatalog.Data", "scripts"
];
const extensions = new Set([".md", ".cs", ".cshtml", ".css", ".json", ".sln", ".csproj", ".config",
  ".asax", ".png", ".svg", ".bicep", ".mjs", ".csv", ".ps1"]);
const excluded = new Set(["bin", "obj", "packages", "node_modules", ".git", ".vs", "testresults",
  "history", ".bookcatalog-lab", ".azure-lab", "app_data", "snapshots", ".appmod", ".github", "scenarios"]);

export function selectPublicContent(tracked, untracked) {
  const safe = path => !path.split("/").some(part => excluded.has(part.toLowerCase()))
    && !/(^|\/)(secrets\.json|\.env(?:\..*)?)$|\.local\.json$|\.user$/i.test(path);
  const supported = path => exact.has(path) ||
    (roots.some(root => path.startsWith(`${root}/`)) && extensions.has(extname(path).toLowerCase()));
  // Newly authored public helper code is usable in previews before staging or committing.
  // Do not copy arbitrary untracked JSON, Markdown, databases, or local configuration.
  const newPublic = path => exact.has(path) ||
    /^(tools\/BookCatalog\.Data|tests\/BookCatalog\.Data\.Tests)\/(?:[^/]+\/)*[^/]+\.(cs|csproj)$/.test(path);
  return [...new Set([
    ...tracked.filter(path => safe(path) && supported(path)),
    ...untracked.filter(path => safe(path) && newPublic(path))
  ])].sort();
}
