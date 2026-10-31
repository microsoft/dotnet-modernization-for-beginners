// Halloween: every stop is a different friendly-spooky scene. Era IDs stay shared with classic.
function palette(paper, surface, soft, accent, a, b, c, dark = false) {
  return {
    paper, surface, soft, accent, a, b, c,
    ink: dark ? "#f2eee4" : "#252b29",
    muted: dark ? "#c0c8c2" : "#55615b",
    line: dark ? "#54645f" : "#bdc6bd",
    accentText: dark ? "#172722" : "#ffffff",
    selected: accent, selectedText: dark ? "#172722" : "#ffffff"
  };
}

const eras = {
  autopilot: {
    label: "Clockwork observatory", scene: "clockwork-observatory", art: "halloween-clockwork-observatory-light.svg", artDark: "halloween-clockwork-observatory-dark.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "18px", control: "8px",
    light: palette("#eee5cf", "#fffaf0", "#f5ecd7", "#79521f", "#6a887d", "#b66b3f", "#d4b16a"),
    dark: palette("#242b2c", "#303839", "#3e4846", "#edc883", "#8daf9d", "#d4966e", "#edc883", true)
  },
  "1960s": {
    label: "Pumpkin patch", scene: "pumpkin-patch", art: "halloween-pumpkin-patch-light.svg", artDark: "halloween-pumpkin-patch-dark.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', radius: "4px", control: "5px",
    light: palette("#e6ebe2", "#fbfcf7", "#edf0e6", "#923e24", "#6a8663", "#da773e", "#e6bd76"),
    dark: palette("#142822", "#1b3029", "#263c32", "#efb17c", "#72997a", "#da8651", "#edca8b", true)
  },
  "1970s": {
    label: "Haunted library", scene: "haunted-library", art: "halloween-haunted-library-light.svg", artDark: "halloween-haunted-library-dark.svg",
    heading: '"Palatino Linotype", "Book Antiqua", Palatino, serif', interface: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', radius: "2px", control: "3px",
    light: palette("#e3e7da", "#fcfcf5", "#edf0e2", "#3c5942", "#7e9367", "#bc8055", "#d7bc7c"),
    dark: palette("#1b2822", "#24332a", "#304236", "#c0d5a3", "#7a9c7d", "#ca946b", "#dfc58e", true)
  },
  soundcheck: {
    label: "Trick-or-treat porch", scene: "trick-or-treat", art: "halloween-trick-or-treat-light.svg", artDark: "halloween-trick-or-treat-dark.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', radius: "12px", control: "8px",
    light: palette("#eee1e4", "#fffafa", "#f3e9ec", "#813e54", "#9d7c96", "#d58d62", "#edc888"),
    dark: palette("#30202e", "#3b2938", "#493646", "#e9b5c7", "#aa8da9", "#df9f73", "#e8c78c", true)
  },
  "1980s": {
    label: "Ghost detective bureau", scene: "ghost-bureau", art: "halloween-ghost-bureau-light.svg", artDark: "halloween-ghost-bureau-dark.svg",
    heading: '"Courier New", Consolas, monospace', interface: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', radius: "0px", control: "2px",
    light: palette("#dde8e9", "#f8fbfa", "#e9f0ef", "#315a65", "#7e9fa1", "#b28660", "#d9c58e"),
    dark: palette("#172a30", "#20353b", "#2c4249", "#a7d1d8", "#749caa", "#c49c77", "#e1cd9d", true)
  },
  "1990s": {
    label: "Witch's spellbook", scene: "spellbook", art: "halloween-spellbook-light.svg", artDark: "halloween-spellbook-dark.svg",
    heading: '"Palatino Linotype", "Book Antiqua", Palatino, serif', interface: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', radius: "3px", control: "4px",
    light: palette("#e8e1ed", "#fdfaff", "#f0eaf5", "#65457d", "#9b85b3", "#c38e72", "#cbb783"),
    dark: palette("#282237", "#342b44", "#413650", "#d6bfe9", "#a08cb9", "#ce9b7e", "#ddca95", true)
  },
  "2000s-2010s": {
    label: "Monster laboratory", scene: "monster-lab", art: "halloween-monster-lab-light.svg", artDark: "halloween-monster-lab-dark.svg",
    heading: '"Trebuchet MS", Verdana, sans-serif', interface: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', radius: "8px", control: "5px",
    light: palette("#e2eadc", "#fafcf6", "#ebf1e5", "#3f603e", "#8da76b", "#9b89ac", "#d1b16e"),
    dark: palette("#1d2b24", "#27372b", "#344735", "#bcd698", "#8fae78", "#b19cc2", "#ddc38b", true)
  },
  "2020s": {
    label: "Moonlit sky", scene: "moonlit-sky", art: "halloween-moonlit-sky-light.svg", artDark: "halloween-moonlit-sky-dark.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', radius: "20px", control: "8px",
    light: palette("#e2e6ef", "#fbfcff", "#edf0f6", "#495881", "#8195b8", "#a98aa9", "#d9c28f"),
    dark: palette("#1c253a", "#253047", "#323e56", "#c3d1ec", "#8eacd0", "#ba9bbd", "#e7d19e", true)
  },
  workbench: {
    label: "Pumpkin shed", scene: "pumpkin-shed", art: "halloween-pumpkin-shed-light.svg", artDark: "halloween-pumpkin-shed-dark.svg",
    heading: '"Courier New", Consolas, monospace', interface: 'Verdana, Tahoma, sans-serif', radius: "0px", control: "2px",
    light: palette("#e9e2d3", "#fffdf6", "#f1ede1", "#79532e", "#8e9b6f", "#c48850", "#d5bc81"),
    dark: palette("#2a2820", "#363329", "#464133", "#e2c298", "#a8b489", "#d7a16c", "#dfc68f", true)
  },
  briefing: {
    label: "Raven's lookout", scene: "raven-lookout", art: "halloween-raven-lookout-light.svg", artDark: "halloween-raven-lookout-dark.svg",
    heading: '"Trebuchet MS", Verdana, sans-serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "6px", control: "6px",
    light: palette("#e1e6e8", "#fafcfc", "#ecf0f2", "#425b6c", "#829cab", "#b58d68", "#d8c396"),
    dark: palette("#202b35", "#2a3743", "#374654", "#c1d2df", "#8ea9bc", "#caa581", "#ddc99f", true)
  },
  "1950s": {
    label: "Ghost story scrapbook", scene: "ghost-scrapbook", art: "halloween-ghost-scrapbook-light.svg", artDark: "halloween-ghost-scrapbook-dark.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "2px", control: "3px",
    light: palette("#ece1d8", "#fffbf7", "#f3eae2", "#834f45", "#a78e7b", "#c28b66", "#d2b983"),
    dark: palette("#302727", "#3d3030", "#4b3c3a", "#e6c0ae", "#b49c89", "#d4a17b", "#dfc695", true)
  },
  "2050s": {
    label: "Enchanted conservatory", scene: "enchanted-garden", art: "halloween-enchanted-garden-light.svg", artDark: "halloween-enchanted-garden-dark.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "40px", control: "10px",
    light: palette("#dce9e3", "#f7fcf9", "#e8f1eb", "#39624e", "#7fa78d", "#af8fac", "#cfb97d"),
    dark: palette("#18302a", "#223e33", "#304e40", "#b8dec3", "#8cb89c", "#c09dc0", "#ddc995", true)
  }
};
export default {
  id: "halloween",
  name: "Halloween",
  eras,
  hero: { art: "halloween-pumpkin-patch-light.svg", artDark: "halloween-pumpkin-patch-dark.svg", caption: "A little spooky. A new foundation." },
  sceneLabels: true,
  illustrations: true,
  illustrationText: {
    soundcheck: {
      title: "Trick-or-treat: get ready",
      description: "Three trick-or-treat tickets show the setup sequence: check your installed tools and Copilot access, open the BookCatalog solution in your learner copy, then run the app and try adding and editing a sample book. If your tools are ready, go straight to running BookCatalog."
    }
  },
  copy: {
    tagline: "The Halloween field guide",
    navDescription: "Seven stops. No scary surprises.",
    footer: "Friendly ghosts. Fresh starts.",
    sampleKicker: "Sample notes",
    futureKicker: "After the upgrade"
  }
};
