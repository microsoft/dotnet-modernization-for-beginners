const holly = {
  light: {
    paper: "#e5efdf", surface: "#fffdf6", soft: "#f6e8df", ink: "#17382e", muted: "#465f50",
    accent: "#9b203b", accentText: "#ffffff", selected: "#9b203b", selectedText: "#ffffff",
    a: "#277052", b: "#d34947", c: "#edbb66", line: "#89a698"
  },
  dark: {
    paper: "#102821", surface: "#17362c", soft: "#234638", ink: "#fff4db", muted: "#c5d5bf",
    accent: "#ffa3a5", accentText: "#3d1420", selected: "#90263e", selectedText: "#fff7eb",
    a: "#69b991", b: "#ef7678", c: "#ebc57a", line: "#678f7b"
  }
};
const frost = {
  light: {
    paper: "#dcedfa", surface: "#fcfeff", soft: "#e7f3ff", ink: "#142f51", muted: "#405d76",
    accent: "#164d91", accentText: "#ffffff", selected: "#164d91", selectedText: "#ffffff",
    a: "#4588be", b: "#86c6e5", c: "#c8e9f8", line: "#83a6bf"
  },
  dark: {
    paper: "#102341", surface: "#172e4b", soft: "#203e5d", ink: "#f1f9ff", muted: "#c1d9ee",
    accent: "#a6dbff", accentText: "#102947", selected: "#245790", selectedText: "#f4fbff",
    a: "#72afd7", b: "#abdced", c: "#d8efff", line: "#6d8fa8"
  }
};

const makeEra = (id, label, scene, heading, interfaceFont, radius, control, colors) => ({
  label, scene,
  art: `christmas-${id}-light.webp`,
  artDark: `christmas-${id}-dark.webp`,
  heading, interface: interfaceFont, radius, control, ...colors
});

const eras = {
  workbench: makeEra("workbench", "A coat of spots for the plywood reindeer", "yard-workbench",
    '"Courier New", Consolas, monospace', 'Verdana, Tahoma, sans-serif', "0px", "2px",
    holly),
  "1960s": makeEra("1960s", "Flamingos in scarves", "yard-flamingos",
    'Georgia, "Times New Roman", serif', '"Trebuchet MS", Verdana, sans-serif', "4px", "5px",
    holly),
  "1970s": makeEra("1970s", "The peppermint lawn train", "yard-train",
    '"Palatino Linotype", "Book Antiqua", Palatino, serif', '"Trebuchet MS", Verdana, sans-serif', "18px", "8px",
    holly),
  soundcheck: makeEra("soundcheck", "Who packed the lights like this?", "yard-tangle",
    'Georgia, "Times New Roman", serif', '"Trebuchet MS", Verdana, sans-serif', "10px", "7px",
    frost),
  "1980s": makeEra("1980s", "The blow-mold snowman family", "yard-snowmen",
    '"Courier New", Consolas, monospace', '"Trebuchet MS", Verdana, sans-serif', "0px", "2px",
    holly),
  "1990s": makeEra("1990s", "The reindeer caught in the lights", "yard-reindeer",
    '"Palatino Linotype", "Book Antiqua", Palatino, serif', '"Trebuchet MS", Verdana, sans-serif', "3px", "4px",
    frost),
  "2000s-2010s": makeEra("2000s-2010s", "The two-story inflatable penguin", "yard-penguin",
    '"Trebuchet MS", Verdana, sans-serif', '"Trebuchet MS", Verdana, sans-serif', "10px", "6px",
    holly),
  "2020s": makeEra("2020s", "The dinosaur in earmuffs", "yard-dinosaur",
    '"Trebuchet MS", Verdana, sans-serif', 'system-ui, -apple-system, "Segoe UI", sans-serif', "20px", "10px",
    frost),
  briefing: makeEra("briefing", "The lights tour starts at the mailbox", "yard-map",
    '"Trebuchet MS", Verdana, sans-serif', '"Trebuchet MS", Verdana, sans-serif', "6px", "6px",
    holly),
  "1950s": makeEra("1950s", "The hand-painted plywood snowman", "yard-cutout",
    'Georgia, "Times New Roman", serif', '"Trebuchet MS", Verdana, sans-serif', "2px", "3px",
    holly),
  "2050s": makeEra("2050s", "One small step for a snowman", "yard-moon",
    '"Trebuchet MS", Verdana, sans-serif', '"Trebuchet MS", Verdana, sans-serif', "40px", "12px",
    frost)
};

export default {
  id: "christmas",
  name: "Tinsel Lane",
  eras,
  hero: {
    art: "christmas-1960s-light.webp",
    artDark: "christmas-1960s-dark.webp"
  },
  illustrations: true,
  copy: {
    navDescription: "Follow the lights from one front yard to the next.",
    footer: "Last one home, unplug the penguin.",
    sampleKicker: "From the neighborhood album",
    futureKicker: "The view from the moon"
  }
};
