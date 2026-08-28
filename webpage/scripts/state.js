import { completionKey } from "./config.js";

export function getCompletedChapters() {
  try {
    return new Set(JSON.parse(localStorage.getItem(completionKey)) || []);
  } catch {
    return new Set();
  }
}

export function toggleChapterCompletion(slug) {
  const completed = getCompletedChapters();

  if (completed.has(slug)) completed.delete(slug);
  else completed.add(slug);

  localStorage.setItem(completionKey, JSON.stringify([...completed]));
}
