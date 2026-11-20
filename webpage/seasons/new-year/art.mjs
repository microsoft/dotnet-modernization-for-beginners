import { illustrations } from "../../scripts/illustrations.js";

export async function renderSeasonArt() {
  const { renderIllustration } = await import("./illustration-art.mjs");
  return illustrations.flatMap(item => ["light", "dark"].map(mode => [
    `webpage/seasons/new-year/illustrations/${item.id}-${mode}.svg`,
    renderIllustration(item.id, mode)
  ]));
}
