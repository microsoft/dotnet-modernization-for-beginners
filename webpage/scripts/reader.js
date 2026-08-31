import { chapters, contentUrl, siteUrl } from "./config.js";
import { article, chapterPager, outlineNav } from "./dom.js";
import { buildOutline, closeDrawers, renderChapterNav, renderPager } from "./ui.js";

let diagramManifestPromise;

function getRoute() {
  const route = window.location.hash.replace(/^#\/?/, "");
  const [slug = "overview", query = ""] = route.split("?");
  const chapter = chapters.find((item) => item.slug === slug) || chapters[0];
  const section = new URLSearchParams(query).get("section");

  return { chapter, section };
}

export function getCurrentChapter() {
  return getRoute().chapter;
}

function normalizePath(path) {
  const parts = [];

  path.replace(/\\/g, "/").split("/").forEach((part) => {
    if (!part || part === ".") return;
    if (part === "..") parts.pop();
    else parts.push(part);
  });

  return parts.join("/");
}

function chapterForPath(path) {
  const normalized = normalizePath(path);
  return chapters.find((chapter) => normalizePath(chapter.path) === normalized);
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function rewriteDocumentLinks(chapter) {
  const currentFolder = chapter.path.includes("/")
    ? chapter.path.slice(0, chapter.path.lastIndexOf("/") + 1)
    : "";

  article.querySelectorAll("img[src]").forEach((image) => {
    const source = image.getAttribute("src");
    image.addEventListener("error", () => {
      const notice = document.createElement("div");
      notice.className = "media-unavailable";
      notice.setAttribute("role", "note");
      notice.innerHTML = `<strong>Image unavailable</strong><span>${escapeHtml(image.alt || "This image is not present in the repository.")}</span>`;
      image.replaceWith(notice);
    }, { once: true });

    if (!source || /^(?:https?:|data:)/i.test(source)) return;
    image.src = contentUrl(normalizePath(`${currentFolder}${source}`));
    image.loading = "lazy";
    image.decoding = "async";
  });

  article.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || /^(?:https?:|mailto:)/i.test(href)) {
      if (/^https?:/i.test(href || "")) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      return;
    }

    if (href.startsWith("#")) {
      link.href = `#/${chapter.slug}?section=${encodeURIComponent(href.slice(1))}`;
      return;
    }

    const [path, section] = href.split("#");
    const targetPath = normalizePath(`${currentFolder}${path}`);
    const targetChapter = chapterForPath(targetPath);

    if (targetChapter) {
      const sectionQuery = section ? `?section=${encodeURIComponent(section)}` : "";
      link.href = `#/${targetChapter.slug}${sectionQuery}`;
    } else {
      link.href = contentUrl(targetPath);
    }
  });
}

async function loadDiagramManifest() {
  if (!diagramManifestPromise) {
    diagramManifestPromise = fetch(siteUrl("diagrams/manifest.json"))
      .then((response) => response.ok ? response.json() : null)
      .catch(() => null);
  }

  return diagramManifestPromise;
}

function createDiagramVariant(diagram, theme) {
  const link = document.createElement("a");
  link.className = `diagram-variant diagram-${theme}`;
  link.href = siteUrl(diagram[theme]);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.setAttribute("aria-label", `Open ${diagram.alt} in a new tab`);

  const image = document.createElement("img");
  image.src = siteUrl(diagram[theme]);
  image.alt = diagram.alt;
  image.loading = "lazy";
  image.decoding = "async";
  link.append(image);

  return link;
}

async function renderDiagrams(chapter) {
  const diagrams = article.querySelectorAll("pre code.language-mermaid");
  if (!diagrams.length) return;

  const manifest = await loadDiagramManifest();
  const assets = manifest?.documents?.[chapter.path];
  if (!assets || assets.length !== diagrams.length) return;

  diagrams.forEach((code, index) => {
    const figure = document.createElement("figure");
    figure.className = "diagram-asset";
    figure.append(
      createDiagramVariant(assets[index], "light"),
      createDiagramVariant(assets[index], "dark")
    );
    code.parentElement.replaceWith(figure);
  });
}

export async function renderRoute() {
  const { chapter, section } = getRoute();
  closeDrawers();
  renderChapterNav(chapter);
  article.setAttribute("aria-busy", "true");
  article.innerHTML = `
    <div class="loading-state" role="status">
      <span class="loading-line loading-line-short"></span>
      <span class="loading-line"></span>
      <span class="loading-line"></span>
      <span class="loading-line loading-line-medium"></span>
      <span class="sr-only">Loading ${chapter.title}</span>
    </div>
  `;

  try {
    const response = await fetch(contentUrl(chapter.path));
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

    const markdown = await response.text();
    const rendered = marked.parse(markdown, { gfm: true });
    article.innerHTML = DOMPurify.sanitize(rendered, { USE_PROFILES: { html: true } });
    rewriteDocumentLinks(chapter);
    buildOutline(chapter);
    renderPager(chapter);
    await renderDiagrams(chapter);
    document.title = `${chapter.title} | .NET Modernization for Beginners`;
    article.removeAttribute("aria-busy");

    requestAnimationFrame(() => {
      const target = section ? document.getElementById(section) : null;
      if (target) target.scrollIntoView();
      else window.scrollTo({ top: 0 });
    });
  } catch (error) {
    article.removeAttribute("aria-busy");
    article.innerHTML = `
      <div class="error-state" role="alert">
        <h1>We couldn't load this chapter</h1>
        <p>Open <a href="${contentUrl(chapter.path)}">${chapter.path}</a> directly or refresh the page.</p>
      </div>
    `;
    outlineNav.innerHTML = "";
    chapterPager.innerHTML = "";
    console.error(error);
  }
}
