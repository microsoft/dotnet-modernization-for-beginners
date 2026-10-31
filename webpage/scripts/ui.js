import GithubSlugger from "../vendor/github-slugger/index.js";
import { chapters, references, sectionAliases } from "./chapters.js";
import { routeForPath } from "./routes.js";
import { applyEra } from "./eras.js";
import { article, chapterNav, chapterPager, outlineNav, courseProgress, courseNavPanel, outlinePanel,
  chaptersToggle, outlineToggle, drawerBackdrop, themeToggle } from "./dom.js";

export function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

export function renderProgress(store, chapter) {
  const { completed, previousCompleted, previousReading, lastVisited } = store.value;
  const core = chapters.filter(item => item.core);
  const count = core.filter(item => completed.includes(item.slug)).length;
  courseProgress.textContent = `${count} of ${core.length} required steps complete`;
  document.querySelector("#completion-bar").style.width = `${100 * count / core.length}%`;
  const resume = document.querySelector("#resume-link");
  const start = core.find(item => !completed.includes(item.slug)) || core[0];
  resume.href = `#/${lastVisited || start.slug}`;
  resume.textContent = lastVisited ? "Resume your last chapter" : "Start the course";
  const notice = document.querySelector("#storage-notice");
  notice.textContent = store.warning || (previousCompleted.length
    ? "Your earlier completion marks are saved as history. Follow each chapter's current steps before marking it complete."
    : previousReading.length
    ? "Your previous reading marks are saved. Follow each chapter's steps before marking it complete." : "");
  notice.hidden = !notice.textContent;
  chapterNav.innerHTML = `<ol class="chapter-list">${chapters.map(item => `
    <li><a class="chapter-link" href="#/${item.slug}" ${item.slug === chapter.slug ? 'aria-current="page"' : ""}>
      <span class="chapter-number ${completed.includes(item.slug) ? "is-complete" : ""}">${completed.includes(item.slug) ? "✓" : item.number}</span>
      <span>${item.title}${item.slug === "04-cloud" ? '<small>Assessment and plan</small>' : ""}
      ${previousCompleted.some(mark => mark.slug === item.slug) && !completed.includes(item.slug) ? "<small>Earlier exercise completed</small>" : ""}
      ${previousReading.includes(item.slug) && !completed.includes(item.slug) ? "<small>Previously read</small>" : ""}
      ${completed.includes(item.slug) ? '<span class="sr-only">Completed</span>' : ""}</span>
    </a></li>
    ${references.filter(reference => reference.navAfter === item.slug).map(reference => `
      <li><a class="chapter-link" href="${routeForPath(reference.path)}" ${reference.path === chapter.path ? 'aria-current="page"' : ""}>
        <span class="chapter-number" aria-hidden="true">+</span>
        <span>${reference.title}<small>Optional automatic route</small></span>
      </a></li>`).join("")}`).join("")}</ol>`;
}

export function buildOutline(chapter) {
  const slugger = new GithubSlugger();
  for (const heading of article.querySelectorAll("h1,h2,h3,h4")) {
    let id = slugger.slug(heading.textContent);
    while (document.getElementById(id)) id = slugger.slug(heading.textContent);
    heading.id = id;
    const legacy = heading.textContent.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
    if (legacy && legacy !== id && !document.getElementById(legacy)) {
      const alias = document.createElement("span");
      alias.id = legacy;
      alias.className = "anchor-alias";
      heading.before(alias);
    }
    for (const [oldId, targetId] of Object.entries(sectionAliases[chapter.slug] || {})) {
      const target = document.getElementById(targetId);
      if (!target) continue;
      for (const aliasId of [oldId, `-${oldId}`]) {
        if (document.getElementById(aliasId)) continue;
        const alias = document.createElement("span");
        alias.id = aliasId;
        alias.className = "anchor-alias";
        target.before(alias);
      }
    }
  }
  outlineNav.innerHTML = `<ol>${[...article.querySelectorAll("h2,h3")].map(heading => `
    <li><a class="outline-link depth-${heading.tagName.slice(1)}" href="${routeForPath(chapter.path, heading.id)}">${escapeHtml(heading.textContent)}</a></li>`).join("")}</ol>`;
}

export function renderPager(chapter, store) {
  const index = chapters.findIndex(item => item.slug === chapter.slug);
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  const complete = store.value.completed.includes(chapter.slug);
  chapterPager.innerHTML = `
    ${chapter.core ? `<div class="chapter-completion"><div><strong>Ready for the next step?</strong>
      <p>${chapter.slug === "overview"
        ? "Review the course goals and learning path, then continue to meet BookCatalog."
        : chapter.slug === "04-cloud"
        ? "Complete the Azure assessment and migration plan."
        : chapter.slug === "prerequisites"
        ? "Check your tools, run BookCatalog, and try adding and editing a sample book."
        : chapter.slug === "00-introduction"
        ? "Meet BookCatalog and the Copilot workflow, then continue to Setup."
        : "Finish this chapter's tool steps, then mark it complete."}</p></div>
      <button type="button" data-complete="${chapter.slug}" aria-pressed="${complete}">${complete ? "Marked complete" : "Mark step complete"}</button></div>` : ""}
    <div class="pager-grid">
      ${previous ? `<a href="#/${previous.slug}"><small>Previous chapter</small><strong>${previous.title}</strong></a>` : '<a href="#/overview"><small>Course</small><strong>Return to the overview</strong></a>'}
      ${next ? `<a href="#/${next.slug}"><small>Next chapter</small><strong>${next.title} <span aria-hidden="true">→</span></strong></a>` : ""}
    </div>`;
}

let drawer;
let opener;
export function closeDrawers(restoreFocus = false) {
  courseNavPanel.classList.remove("is-open");
  outlinePanel.classList.remove("is-open");
  chaptersToggle.setAttribute("aria-expanded", "false");
  outlineToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("drawer-open");
  drawerBackdrop.hidden = true;
  drawer = null;
  syncDrawers();
  if (restoreFocus) opener?.focus();
}
export function syncDrawers() {
  const mobile = matchMedia("(max-width: 850px)").matches;
  courseNavPanel.inert = mobile && !courseNavPanel.classList.contains("is-open");
  outlinePanel.inert = matchMedia("(max-width: 1250px)").matches && !outlinePanel.classList.contains("is-open");
}
export function toggleDrawer(panel, button) {
  const isOpen = panel.classList.contains("is-open");
  closeDrawers();
  if (isOpen) { button.focus(); return; }
  opener = button;
  drawer = panel;
  panel.classList.add("is-open");
  panel.inert = false;
  button.setAttribute("aria-expanded", "true");
  document.body.classList.add("drawer-open");
  drawerBackdrop.hidden = false;
  panel.querySelector("a,button,summary")?.focus();
}
export function handleDrawerKey(event) {
  if (!drawer) return;
  if (event.key === "Escape") { event.preventDefault(); closeDrawers(true); }
  if (event.key !== "Tab") return;
  const focusable = [...drawer.querySelectorAll("a,button,summary")]
    .filter(element => !element.disabled && element.checkVisibility());
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}
export function setTheme(theme, store) {
  document.documentElement.dataset.theme = theme;
  applyEra(document.documentElement.dataset.era || "1960s", theme);
  themeToggle.textContent = theme === "light" ? "Dark theme" : "Light theme";
  themeToggle.setAttribute("aria-label", `Use ${theme === "light" ? "dark" : "light"} theme`);
  store.theme(theme);
}
