import {
  chapterPager,
  chaptersToggle,
  courseNavPanel,
  drawerBackdrop,
  outlinePanel,
  outlineToggle,
  themeToggle
} from "./scripts/dom.js";
import { getCurrentChapter, renderRoute } from "./scripts/reader.js";
import { toggleChapterCompletion } from "./scripts/state.js";
import {
  closeDrawers,
  openDrawer,
  renderChapterNav,
  renderPager,
  toggleTheme,
  updateReadingProgress
} from "./scripts/ui.js";

marked.use({ breaks: false, gfm: true });

themeToggle.addEventListener("click", toggleTheme);
chaptersToggle.addEventListener("click", () => {
  if (courseNavPanel.classList.contains("is-open")) closeDrawers();
  else openDrawer(courseNavPanel, chaptersToggle);
});
outlineToggle.addEventListener("click", () => {
  if (outlinePanel.classList.contains("is-open")) closeDrawers();
  else openDrawer(outlinePanel, outlineToggle);
});
drawerBackdrop.addEventListener("click", closeDrawers);
chapterPager.addEventListener("click", (event) => {
  const button = event.target.closest("[data-complete-chapter]");
  if (!button) return;

  toggleChapterCompletion(button.dataset.completeChapter);
  const chapter = getCurrentChapter();
  renderChapterNav(chapter);
  renderPager(chapter);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDrawers();
});
window.addEventListener("hashchange", renderRoute);
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);

lucide.createIcons();
if (!window.location.hash) window.location.hash = "/overview";
else renderRoute();
