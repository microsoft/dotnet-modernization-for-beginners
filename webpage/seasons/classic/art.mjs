import { illustrations, illustrationPath } from "../../scripts/illustrations.js";
import { renderIllustration, renderSoundcheckHeader, renderAutopilotHeader } from "../../tools/illustration-art.mjs";
import classic from "./season.js";

// Classic owns the default lesson illustrations in docs/ and its generated headers.
export function renderSeasonArt() {
  const outputs = illustrations.flatMap(item => ["light", "dark"].map(mode => [illustrationPath(item.id, mode), renderIllustration(item.id, mode)]));
  for (const [id, render] of [["soundcheck", renderSoundcheckHeader], ["autopilot", renderAutopilotHeader]]) {
    const era = classic.eras[id];
    for (const [mode, file] of [["light", era.art], ["dark", era.artDark]]) {
      outputs.push([`webpage/seasons/classic/assets/${file}`, render(mode)]);
    }
  }
  return outputs;
}
