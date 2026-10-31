import { contentUrl, siteUrl } from "./config.js";
import { normalizePath, parseRoute, routeForPath } from "./routes.js";
import { article, chapterPager, outlineNav } from "./dom.js";
import { buildOutline, closeDrawers, escapeHtml, renderPager, renderProgress } from "./ui.js";
import { activeSeason, applyEra, getEra, referenceEra, seasonAsset } from "./eras.js";
import { illustrations, illustrationPath } from "./illustrations.js";

let request;
let current = parseRoute("#/overview").chapter;
export const getCurrentChapter = () => current;

function reportImageFailure(image) {
  image.addEventListener("error", () => {
    const notice = document.createElement("p");
    notice.className = "notice";
    notice.setAttribute("role", "status");
    notice.textContent = `The image could not load. ${image.alt}`;
    image.replaceWith(notice);
  }, { once: true });
}

function rewriteLinks(chapter) {
  const folder = chapter.path.includes("/") ? chapter.path.slice(0, chapter.path.lastIndexOf("/") + 1) : "";
  for (const image of article.querySelectorAll("img[src]")) {
    const src = image.getAttribute("src");
    if (/^https?:/i.test(src)) {
      image.replaceWith(document.createTextNode(image.alt || "External image"));
      continue;
    }
    image.src = contentUrl(normalizePath(folder + src));
    image.loading = "lazy";
    reportImageFailure(image);
  }
  for (const link of article.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href");
    if (/^(https?:|mailto:)/i.test(href)) {
      link.rel = "noreferrer";
      continue;
    }
    const [path, section = ""] = href.split("#");
    const target = path ? normalizePath(folder + path) : chapter.path;
    link.href = routeForPath(target, section) || `${contentUrl(target)}${section ? `#${section}` : ""}`;
  }
}

function addCodeCopy() {
  for (const pre of article.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (!code) continue;
    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";
    const language = [...code.classList].find(value => value.startsWith("language-"))?.slice(9) || "text";
    toolbar.innerHTML = `<span>${escapeHtml(language)}</span><button type="button">Copy code</button>`;
    const button = toolbar.querySelector("button");
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = "Copied";
        document.querySelector("#copy-notice").textContent = "The code is copied.";
      } catch {
        button.textContent = "Copy failed";
        document.querySelector("#copy-notice").textContent = "Copy failed. Select the code and copy it manually.";
      }
    });
    pre.before(toolbar);
    pre.classList.add("with-toolbar");
    pre.tabIndex = 0;
    pre.setAttribute("aria-label", `${language} code`);
  }
}

function heroImage(file, className) {
  const art = document.createElement("img");
  art.src = siteUrl(seasonAsset(file));
  art.alt = "";
  art.className = className;
  art.setAttribute("aria-hidden", "true");
  reportImageFailure(art);
  return art;
}

function addHero() {
  const hero = document.createElement("div");
  hero.className = "workshop-hero";
  const copy = document.createElement("div");
  copy.className = "hero-copy";
  for (const node of [...article.childNodes]) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "H2") break;
    copy.append(node);
  }

  const { art: lightArt, artDark, caption: sceneCaption } = activeSeason().hero;
  if (artDark) {
    const artwork = document.createElement("div");
    artwork.className = "hero-scene";
    for (const [mode, file] of [["light", lightArt], ["dark", artDark]]) artwork.append(heroImage(file, `hero-art era-art-${mode}`));
    if (sceneCaption) {
      const caption = document.createElement("p");
      caption.className = "scene-caption";
      caption.textContent = sceneCaption;
      artwork.append(caption);
    }
    hero.append(copy, artwork);
  } else {
    hero.append(copy, heroImage(lightArt, "hero-art"));
  }
  article.prepend(hero);
  const actions = copy.querySelector("p:has(> strong > a)");
  if (actions) {
    const links = [...actions.querySelectorAll("a")];
    actions.className = "hero-actions";
    const primary = document.createElement("strong");
    primary.append(links[0]);
    const secondary = document.createElement("span");
    secondary.className = "hero-secondary";
    secondary.append(...links.slice(1));
    actions.replaceChildren(primary, secondary);
  }
}

function addChapterHeader(chapter) {
  const heading = article.querySelector("h1");
  if (!heading) throw new Error("The chapter has no title. Check its source.");
  const panel = document.createElement("div");
  panel.className = "era-intro";
  const era = getEra(chapter.era);
  heading.before(panel);
  panel.append(heading);
  if (activeSeason().sceneLabels) {
    const setting = document.createElement("div");
    setting.className = "scene-name";
    setting.textContent = era.label;
    panel.before(setting);
  }
  if (chapter.era === "autopilot") {
    panel.classList.add("autopilot-intro");
    const copy = document.createElement("div");
    copy.className = "autopilot-copy";
    const kicker = document.createElement("p");
    kicker.className = "autopilot-kicker";
    kicker.textContent = "Autopilot / One goal";
    const caption = document.createElement("p");
    caption.className = "autopilot-caption";
    caption.textContent = "Set the direction. Follow the upgrade.";
    const tags = document.createElement("ul");
    tags.className = "autopilot-tags";
    tags.setAttribute("aria-label", "Copilot app workflow");
    for (const label of ["Attach a folder", "Start Autopilot", "Follow Canvas"]) {
      const tag = document.createElement("li");
      tag.textContent = label;
      tags.append(tag);
    }
    copy.append(kicker, heading, caption, tags);
    panel.append(copy);
  }
  if (chapter.era === "1950s") {
    panel.classList.add("flight-intro");
    const copy = document.createElement("div");
    copy.className = "flight-copy";
    const kicker = document.createElement("p");
    kicker.className = "flight-kicker";
    kicker.textContent = activeSeason().copy.sampleKicker;
    const caption = document.createElement("p");
    caption.className = "flight-caption";
    caption.textContent = "Earlier observations. Not a finished upgrade.";
    copy.append(kicker, heading, caption);
    panel.append(copy);
    const tabs = document.createElement("nav");
    tabs.className = "flight-tabs";
    tabs.setAttribute("aria-label", "Sample run dates");
    for (const [date, label, description, section] of [
      ["2026-09-18", "18 Sep 2026", "Legacy launch", "sample-run-environment"],
      ["2026-09-21", "21 Sep 2026", "Assessment and upgrade attempt", "september-21-supplied-assessment-and-upgrade"]
    ]) {
      const link = document.createElement("a");
      link.href = routeForPath(chapter.path, section);
      const time = document.createElement("time");
      time.dateTime = date;
      time.textContent = label;
      const detail = document.createElement("span");
      detail.textContent = description;
      link.append(time, detail);
      tabs.append(link);
    }
    panel.append(tabs);
  }
  if (chapter.era === "2050s") {
    panel.classList.add("future-intro");
    const copy = document.createElement("div");
    copy.className = "future-copy";
    const kicker = document.createElement("p");
    kicker.className = "future-kicker";
    kicker.textContent = activeSeason().copy.futureKicker;
    const caption = document.createElement("p");
    caption.className = "future-caption";
    caption.textContent = "AI can write the upgrade. You run the result.";
    const stack = document.createElement("ul");
    stack.className = "future-stack";
    stack.setAttribute("aria-label", "Application stack");
    for (const name of [".NET 10", "ASP.NET Core MVC", "EF Core + SQL Server"]) {
      const item = document.createElement("li");
      item.textContent = name;
      stack.append(item);
    }
    copy.append(kicker, heading, caption, stack);
    panel.append(copy);
  }
  for (const [mode, file] of era.artDark ? [["light", era.art], ["dark", era.artDark]] : [["", era.art]]) {
    const image = document.createElement("img");
    image.src = siteUrl(seasonAsset(file));
    image.alt = "";
    image.className = `era-art${mode ? ` era-art-${mode}` : ""}`;
    image.setAttribute("aria-hidden", "true");
    reportImageFailure(image);
    panel.append(image);
  }
}

function renderIllustrations() {
  for (const image of article.querySelectorAll("img[src]")) {
    const match = illustrations.find(item => image.src === contentUrl(illustrationPath(item.id, "light")));
    if (!match) continue;
    const season = activeSeason();
    const illustration = { ...match, ...season.illustrationText?.[match.id] };
    const versionUrl = theme => season.illustrations
      ? siteUrl(`seasons/${season.id}/illustrations/${illustration.id}-${theme}.svg`)
      : contentUrl(illustrationPath(illustration.id, theme));
    const figure = document.createElement("figure");
    figure.className = "course-illustration";
    figure.dataset.illustration = illustration.id;
    for (const theme of ["light", "dark"]) {
      const link = document.createElement("a");
      link.className = `illustration-version illustration-${theme}`;
      link.href = versionUrl(theme);
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-label", `Open full-size image: ${illustration.title} (new tab)`);
      const img = document.createElement("img");
      img.src = link.href;
      img.alt = illustration.description;
      img.loading = "lazy";
      reportImageFailure(img);
      const label = document.createElement("span");
      label.className = "illustration-open";
      label.textContent = "Open full-size image";
      link.append(img, label);
      figure.append(link);
    }
    const caption = document.createElement("figcaption");
    caption.textContent = illustration.caption;
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "Read the illustration";
    const description = document.createElement("p");
    description.textContent = illustration.description;
    details.append(summary, description);
    figure.append(caption, details);
    const parent = image.parentElement;
    if (parent.tagName === "P" && parent.childNodes.length === 1) parent.replaceWith(figure);
    else image.replaceWith(figure);
  }
}

export async function renderRoute(store) {
  request?.abort();
  request = new AbortController();
  const { signal } = request;
  closeDrawers();
  article.setAttribute("aria-busy", "true");
  article.innerHTML = '<p role="status">The lesson is loading.</p>';
  chapterPager.innerHTML = "";
  outlineNav.innerHTML = "";
  let routeResolved = false;
  try {
    const { chapter, section } = parseRoute(location.hash);
    const era = chapter.era || referenceEra;
    applyEra(era, document.documentElement.dataset.theme);
    document.querySelector("#chapter-label").textContent = chapter.slug === "overview"
      ? "A .NET course with GitHub Copilot" : chapter.slug === "reference"
      ? "Your course reference" : `${chapter.number} / Core course`;
    document.body.classList.toggle("is-overview", chapter.slug === "overview");
    routeResolved = true;
    const response = await fetch(contentUrl(chapter.path), { signal });
    if (!response.ok) throw new Error(`The lesson could not load (HTTP ${response.status}).`);
    const markdown = await response.text();
    if (signal.aborted) return;
    current = chapter;
    article.innerHTML = DOMPurify.sanitize(marked.parse(markdown, { gfm: true }), { USE_PROFILES: { html: true } });
    rewriteLinks(chapter);
    renderIllustrations();
    if (chapter.slug === "overview") addHero();
    else if (chapter.era) addChapterHeader(chapter);
    buildOutline(chapter);
    addCodeCopy();
    document.body.classList.toggle("is-overview", chapter.slug === "overview");
    store.visit(chapter.slug);
    renderProgress(store, chapter);
    renderPager(chapter, store);
    document.title = `${chapter.title} | .NET Modernization`;
    article.removeAttribute("aria-busy");
    const main = document.querySelector("#main-content");
    main.focus({ preventScroll: true });
    const target = section ? document.getElementById(section) : null;
    if (section && !target) {
      const notice = document.createElement("p");
      notice.className = "notice";
      notice.textContent = "This section moved. Use the page outline to find it.";
      article.prepend(notice);
    }
    if (target) {
      for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (ancestor.tagName === "DETAILS") ancestor.open = true;
      }
      target.scrollIntoView({ behavior: "instant", block: "start" });
    } else window.scrollTo({ top: 0, behavior: "instant" });
  } catch (error) {
    if (signal.aborted) return;
    if (!routeResolved) {
      applyEra(referenceEra, document.documentElement.dataset.theme);
      document.querySelector("#chapter-label").textContent = "Course";
      document.body.classList.remove("is-overview");
    }
    article.removeAttribute("aria-busy");
    article.innerHTML = `<div class="notice" role="alert"><h1>The lesson could not load</h1>
      <p>${escapeHtml(error.message)}</p><button id="retry-lesson" type="button">Try again</button>
      <a href="#/overview">Return to the overview</a></div>`;
    document.querySelector("#retry-lesson").addEventListener("click", () => renderRoute(store));
    console.error(error);
  }
}
