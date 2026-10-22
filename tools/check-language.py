"""Check course prose with the reviewed ASD-STE100 skill linter."""
import importlib.util
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
root = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("ste_lint", root / "tools/vendor/ste-lint.py")
linter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(linter)

paths = [root / "README.md"]
paths += sorted(root.glob("[0-9][0-9]-*/README.md"))
paths += [root / name for name in [
    "02-introduction/code/README.md", "shared-legacy-app/README.md", "webpage/README.md", "webpage/seasons/README.md",
    "examples/modernized/README.md", "examples/azure/README.md",
    "examples/assessments/bookcatalog/README.md",
    "examples/assessments/bookcatalog/assessment-excerpts.md",
    "examples/assessments/bookcatalog/planning-excerpts.md",
    "examples/assessments/bookcatalog/execution-excerpts.md",
    "docs/validation.md", "docs/writing.md", "docs/learner-record.md",
    "docs/data-transfer.md", "docs/advanced-checks.md", "docs/author-filter.md",
    "docs/instructor-guide.md", "docs/modernization-reference.md", "llms.txt",
    "07-cloud/deployment.md", "tools/BookCatalog.Data/README.md"
]]
failures = []
for path in paths:
    text = path.read_text(encoding="utf-8")
    # Keep link labels, not URL syntax, in the language check.
    text = re.sub(r"(!?\[[^\]]*\])\([^)]+\)", r"\1", text)
    findings, _ = linter.lint(text, str(path.relative_to(root)))
    failures.extend(f for f in findings
                    if f["level"] == "advisory-free" and f["rule"] != "synonym-rotation")
for failure in failures:
    print(f'{failure["file"]}:{failure["line"]} {failure["rule"]}: {failure["match"]}')
print(f"Language checks: {len(paths)} files, {len(failures)} structural failures.")
sys.exit(bool(failures))
