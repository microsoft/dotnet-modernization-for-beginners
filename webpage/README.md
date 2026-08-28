# Course Webpage

This folder contains the static GitHub Pages reader. Course content stays in the repository's existing README files and is not duplicated here.

## Local preview

From the repository root, run:

```powershell
python -m http.server 4173
```

Then open <http://localhost:4173/webpage/>.

## JavaScript structure

| File | Responsibility |
|------|----------------|
| `app.js` | Application initialization and event wiring |
| `scripts/config.js` | Chapter manifest and content location |
| `scripts/dom.js` | Shared DOM element references |
| `scripts/state.js` | Persisted chapter completion state |
| `scripts/ui.js` | Navigation, outline, pager, drawers, and theme UI |
| `scripts/reader.js` | Markdown loading, link rewriting, and Mermaid rendering |

The Pages workflow copies this folder into the deployment root and stages the course READMEs and assets under `content/`. No package manager or build framework is required.