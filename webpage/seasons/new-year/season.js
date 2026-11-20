import { sceneEras } from "../scene-pack.js";

const brass = {
  light: {
    paper: "#f4e7c9", surface: "#fffdf4", soft: "#f7edd6", ink: "#202944", muted: "#575a69",
    accent: "#34396d", accentText: "#ffffff", selected: "#303662", selectedText: "#fff6da",
    a: "#584985", b: "#ba8135", c: "#efcb77", line: "#aaa193"
  },
  dark: {
    paper: "#191c35", surface: "#242740", soft: "#30344f", ink: "#fff3d4", muted: "#d3cbbe",
    accent: "#f4cb7a", accentText: "#26223b", selected: "#504b79", selectedText: "#fff6da",
    a: "#9184bd", b: "#d79a4c", c: "#f2d284", line: "#878196"
  }
};
const neon = {
  light: {
    paper: "#dcefed", surface: "#f7fffd", soft: "#e7f4f3", ink: "#19354a", muted: "#425e67",
    accent: "#00656c", accentText: "#ffffff", selected: "#12626d", selectedText: "#effffe",
    a: "#167d87", b: "#b35b9e", c: "#bee5ed", line: "#87a5ac"
  },
  dark: {
    paper: "#102434", surface: "#163140", soft: "#204151", ink: "#eff9ff", muted: "#bfd8df",
    accent: "#86e1de", accentText: "#102939", selected: "#185f69", selectedText: "#effffe",
    a: "#63bcbf", b: "#dc8abe", c: "#c5eaf2", line: "#668c98"
  }
};
// Object keys are the workshop's fixed layout slots, not the decades in the party album.
const eras = sceneEras("new-year", {
  "1960s": ["sock-hop", "1950s: Paper crowns at the punch bowl", brass],
  "1970s": ["record-hop", "1960s: Daisies around the record player", neon],
  soundcheck: ["disco", "1970s: Big shoes. Bigger mirror ball.", brass],
  "1980s": ["cassette-karaoke", "1980s: One boombox, one mic, no backup singers", neon],
  "1990s": ["inflatable-alien", "1990s: The inflatable alien gets the good chair", brass],
  "2000s-2010s": ["cd-curtain", "2000s: Dress code is whatever matches the CDs", neon],
  "2020s": ["photo-booth", "2010s: Pick a moustache for the photo booth", brass],
  "1950s": ["party-favors", "1950s: The box of leftover party favors", brass],
  workbench: ["rosette-table", "Tissue paper, twine, and one last rosette", neon],
  briefing: ["video-party", "2020s: The cat joins the video countdown", neon],
  "2050s": ["zero-gravity-disco", "2050s: Nobody tied down the disco balls", brass]
});

export default {
  id: "new-year", name: "Midnight Mixtape", eras, illustrations: true,
  hero: { art: eras["1960s"].art, artDark: eras["1960s"].artDark },
  copy: {
    navDescription: "Start at the sock hop. Jump ten years at every party.",
    footer: "The paper hats can stay on.",
    sampleKicker: "From the party favor box",
    futureKicker: "Midnight in zero gravity"
  }
};
