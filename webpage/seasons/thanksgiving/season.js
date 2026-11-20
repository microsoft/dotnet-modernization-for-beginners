import { sceneEras } from "../scene-pack.js";

const cider = {
  light: {
    paper: "#f6e2bf", surface: "#fffaf0", soft: "#ffedce", ink: "#3d281b", muted: "#6d513b",
    accent: "#933b17", accentText: "#ffffff", selected: "#833613", selectedText: "#fff8de",
    a: "#995029", b: "#dc7431", c: "#edbf64", line: "#b09470"
  },
  dark: {
    paper: "#2b211c", surface: "#382a21", soft: "#493527", ink: "#fff2d6", muted: "#dfc5a6",
    accent: "#ffb56f", accentText: "#362017", selected: "#833613", selectedText: "#fff8de",
    a: "#c27b50", b: "#ed975b", c: "#f4cd7b", line: "#977557"
  }
};
const orchard = {
  light: {
    paper: "#e5ebd8", surface: "#fffdf2", soft: "#eef2df", ink: "#293a26", muted: "#506246",
    accent: "#85283e", accentText: "#ffffff", selected: "#425e31", selectedText: "#fffbe5",
    a: "#547347", b: "#b34353", c: "#eac074", line: "#98a68a"
  },
  dark: {
    paper: "#20291f", surface: "#2a3629", soft: "#374438", ink: "#fcf4df", muted: "#d1d9bf",
    accent: "#ffa3ad", accentText: "#391724", selected: "#425e31", selectedText: "#fffbe5",
    a: "#90a974", b: "#da7c8b", c: "#e8c67f", line: "#798970"
  }
};

const eras = sceneEras("thanksgiving", {
  // Layout slots stay fixed. The parade starts in the 1950s and setup is its third stop.
  "1960s": ["pie-cutout", "1950s: One plywood slice on a little red wagon", cider, "1950s"],
  "1970s": ["pie-wagon", "1960s: A whole lattice pie on whitewall tires", cider, "1960s"],
  soundcheck: ["pumpkin-train", "1970s: All aboard the pumpkin train", orchard, "1970s"],
  "1980s": ["turkey-balloon", "1980s: Two sandbags and the turkey still takes off", cider],
  "1990s": ["cranberry-scoop", "1990s: The cranberries make a break for it", orchard],
  "2000s-2010s": ["squash-float", "2000s: A squash takes the wheel of a pie tin", cider],
  "2020s": ["electric-pie", "2010s: The turkey drives. The pumpkin pie rides shotgun.", orchard],
  "1950s": ["leaf-bunting", "From the parade scrapbook: The runaway spool of leaves", cider, "soundcheck"],
  workbench: ["apple-cutout", "Wet paint on the plywood apple", orchard],
  briefing: ["parade-map", "The parade map on the apple crate", orchard],
  "2050s": ["orbital-float", "The pie float that really floats", cider]
});

export default {
  id: "thanksgiving", name: "Pie Parade", eras, illustrations: true,
  hero: { art: eras["1960s"].art, artDark: eras["1960s"].artDark },
  copy: {
    navDescription: "Follow the floats from a red wagon to a battery-powered pumpkin pie.",
    footer: "Save a slice for the cleanup crew.",
    sampleKicker: "From the parade scrapbook",
    futureKicker: "Dessert in orbit"
  }
};
