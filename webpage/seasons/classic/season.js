// Classic: the course gets more modern at each stop. Era IDs are shared by every season.
const eras = {
  autopilot: {
    label: "Autopilot flight deck", art: "era-autopilot-light.svg", artDark: "era-autopilot-dark.svg",
    heading: 'Outfit, "Trebuchet MS", sans-serif', interface: '"Segoe UI", Tahoma, sans-serif', radius: "18px", control: "10px",
    light: { paper: "#eaf0ff", surface: "#ffffff", ink: "#172747", muted: "#4f5d77", accent: "#2752b3", accentText: "#ffffff",
      soft: "#dfe8ff", line: "#8b9bc0", selected: "#f4be72", selectedText: "#172747", a: "#5288be", b: "#cf704d", c: "#f4be72" },
    dark: { paper: "#0d1930", surface: "#152541", ink: "#f0f5ff", muted: "#b6c8e3", accent: "#a5c9ff", accentText: "#12223b",
      soft: "#213657", line: "#6d88ae", selected: "#f4be72", selectedText: "#172747", a: "#72a6df", b: "#f19a79", c: "#f4be72" }
  },
  workbench: {
    label: "Workshop manual", art: "era-workbench.svg",
    heading: '"Courier New", Consolas, monospace', interface: 'Verdana, Tahoma, sans-serif', radius: "0px", control: "2px",
    light: { paper: "#e5e2cf", surface: "#faf8ed", ink: "#283b2a", muted: "#59604d", accent: "#4a6028", accentText: "#ffffff",
      soft: "#eeeddd", line: "#92987c", selected: "#e2bb51", selectedText: "#283b2a", a: "#718344", b: "#b77932", c: "#e2bb51" },
    dark: { paper: "#1c251a", surface: "#263122", ink: "#f5f2d9", muted: "#c9ccb6", accent: "#d8de9c", accentText: "#263122",
      soft: "#34422e", line: "#8b9974", selected: "#e2bb51", selectedText: "#283b2a", a: "#a7ba79", b: "#d69b51", c: "#e2bb51" }
  },
  briefing: {
    label: "Mission briefing", art: "era-briefing.svg",
    heading: 'Outfit, "Trebuchet MS", sans-serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "6px", control: "6px",
    light: { paper: "#e0edf0", surface: "#f6fcfc", ink: "#102d42", muted: "#46616d", accent: "#006577", accentText: "#ffffff",
      soft: "#e5f1f2", line: "#799ba5", selected: "#006577", selectedText: "#ffffff", a: "#218d9b", b: "#d28153", c: "#badbe2" },
    dark: { paper: "#071b29", surface: "#102736", ink: "#edfaff", muted: "#b8d2dc", accent: "#80dfe9", accentText: "#071b29",
      soft: "#193b49", line: "#6997a7", selected: "#80dfe9", selectedText: "#071b29", a: "#45b7c6", b: "#eda478", c: "#badbe2" }
  },
  "1950s": {
    label: "1950s", art: "era-1950s.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "2px", control: "3px",
    light: { paper: "#eee6d5", surface: "#fffaf0", ink: "#183449", muted: "#52616a", accent: "#9a391c", accentText: "#fffaf0",
      soft: "#ece4d4", line: "#9a9d95", selected: "#183449", selectedText: "#fffaf0", a: "#416777", b: "#d56832", c: "#d5b77b" },
    dark: { paper: "#102331", surface: "#172d3c", ink: "#f7eedc", muted: "#c4cbbf", accent: "#ffb280", accentText: "#102331",
      soft: "#203a49", line: "#789099", selected: "#ffb280", selectedText: "#102331", a: "#8eafb9", b: "#f29860", c: "#d5b77b" }
  },
  "1960s": {
    label: "1960s", art: "retro-workshop.svg",
    heading: 'Outfit, "Segoe UI", sans-serif', interface: '"Segoe UI", Arial, sans-serif', radius: "10px", control: "8px",
    light: { paper: "#fff2d5", surface: "#fffbf2", ink: "#102e2a", muted: "#405952", accent: "#14675f", accentText: "#fff2d5",
      soft: "#f6e9c7", line: "#8d9b87", selected: "#f0c24d", selectedText: "#102e2a", a: "#40b7a5", b: "#ef6b3b", c: "#f0c24d" },
    dark: { paper: "#103d3d", surface: "#153331", ink: "#fff2d5", muted: "#c7d5c4", accent: "#86e1cd", accentText: "#102e2a",
      soft: "#204642", line: "#638f85", selected: "#f0c24d", selectedText: "#102e2a", a: "#40b7a5", b: "#ef6b3b", c: "#f0c24d" }
  },
  "1970s": {
    label: "1970s", art: "era-1970s.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '"Trebuchet MS", Arial, sans-serif', radius: "28px", control: "30px",
    light: { paper: "#f5dfb7", surface: "#fff7e7", ink: "#442710", muted: "#65503a", accent: "#883718", accentText: "#fff7e7",
      soft: "#f1e1bf", line: "#9c7950", selected: "#63702c", selectedText: "#fff7e7", a: "#c87132", b: "#63702c", c: "#e6b947" },
    dark: { paper: "#2e2117", surface: "#34271b", ink: "#fff0d0", muted: "#decaad", accent: "#ffc37c", accentText: "#34271b",
      soft: "#463221", line: "#a08663", selected: "#d4d486", selectedText: "#34271b", a: "#c87132", b: "#8e9b48", c: "#e6b947" }
  },
  soundcheck: {
    label: "Soundcheck", art: "era-soundcheck-light.svg", artDark: "era-soundcheck-dark.svg",
    heading: 'Georgia, "Times New Roman", serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "16px", control: "8px",
    light: { paper: "#fff1d5", surface: "#fffaf0", ink: "#44213e", muted: "#685261", accent: "#7b285d", accentText: "#fffaf0",
      soft: "#f6e4ca", line: "#a27e90", selected: "#f6b574", selectedText: "#44213e", a: "#087e80", b: "#de692e", c: "#f5ba67" },
    dark: { paper: "#261a2b", surface: "#312137", ink: "#fff1d5", muted: "#e1c7d4", accent: "#ffc189", accentText: "#312137",
      soft: "#452b45", line: "#b58b9e", selected: "#ffc189", selectedText: "#312137", a: "#56c6bd", b: "#ef925a", c: "#e9b8d4" }
  },
  "1980s": {
    label: "1980s", art: "era-1980s.svg",
    heading: 'Outfit, "Arial Black", sans-serif', interface: '"Trebuchet MS", Arial, sans-serif', radius: "0px", control: "0px",
    light: { paper: "#e6e0fa", surface: "#fffcff", ink: "#271443", muted: "#5f4b75", accent: "#742393", accentText: "#ffffff",
      soft: "#f1e8fa", line: "#786391", selected: "#ffcc46", selectedText: "#271443", a: "#37d5dd", b: "#ee4d9a", c: "#ffcc46" },
    dark: { paper: "#201130", surface: "#251537", ink: "#fcf2ff", muted: "#d5bee9", accent: "#66e8ea", accentText: "#201130",
      soft: "#352148", line: "#a17cba", selected: "#ffcc46", selectedText: "#271443", a: "#37d5dd", b: "#ee4d9a", c: "#ffcc46" }
  },
  "1990s": {
    label: "1990s", art: "era-1990s.svg",
    heading: 'Verdana, Tahoma, Arial, sans-serif', interface: 'Tahoma, Verdana, Arial, sans-serif', radius: "0px", control: "0px",
    light: { paper: "#bdcecf", surface: "#f7f7f1", ink: "#142a35", muted: "#465761", accent: "#173e82", accentText: "#ffffff",
      soft: "#e2e6e5", line: "#697e83", selected: "#173e82", selectedText: "#ffffff", a: "#168b8e", b: "#658ab4", c: "#f5d36e" },
    dark: { paper: "#10282b", surface: "#1d2e35", ink: "#f4f5eb", muted: "#c4d1d5", accent: "#a6ceff", accentText: "#142a35",
      soft: "#30424a", line: "#83989f", selected: "#a6ceff", selectedText: "#142a35", a: "#249fa1", b: "#658ab4", c: "#f5d36e" }
  },
  "2000s-2010s": {
    label: "2000s / 2010s", art: "era-2000s.svg",
    heading: 'Arial, "Segoe UI", sans-serif', interface: 'Arial, "Segoe UI", sans-serif', radius: "12px", control: "7px",
    light: { paper: "#dbe9f3", surface: "#ffffff", ink: "#173449", muted: "#476073", accent: "#155b91", accentText: "#ffffff",
      soft: "#eaf3fa", line: "#8caabd", selected: "#155b91", selectedText: "#ffffff", a: "#66bfdf", b: "#448dbd", c: "#a6d49a" },
    dark: { paper: "#102a3d", surface: "#163247", ink: "#f0f8ff", muted: "#bbd3e5", accent: "#a5d8ff", accentText: "#123045",
      soft: "#23465f", line: "#789cb5", selected: "#a5d8ff", selectedText: "#123045", a: "#66bfdf", b: "#448dbd", c: "#a6d49a" }
  },
  "2050s": {
    label: "2050s", art: "era-2050s.svg",
    heading: 'Outfit, "Trebuchet MS", sans-serif', interface: '"Trebuchet MS", Verdana, sans-serif', radius: "2px", control: "3px",
    light: { paper: "#e8eeea", surface: "#f7faf5", ink: "#102b28", muted: "#49605b", accent: "#166452", accentText: "#ffffff",
      soft: "#e2ece5", line: "#829d91", selected: "#d9f56a", selectedText: "#102b28", a: "#2b8977", b: "#607669", c: "#d9f56a" },
    dark: { paper: "#091612", surface: "#10211c", ink: "#eff8e7", muted: "#b3c9bb", accent: "#d9f56a", accentText: "#10211c",
      soft: "#1b342a", line: "#648b78", selected: "#d9f56a", selectedText: "#10211c", a: "#79d9b8", b: "#8aac98", c: "#d9f56a" }
  },
  "2020s": {
    label: "2020s", art: "era-2020s.svg",
    heading: 'Outfit, "Segoe UI", sans-serif', interface: '"Segoe UI", Arial, sans-serif', radius: "18px", control: "12px",
    light: { paper: "#f2f2f0", surface: "#ffffff", ink: "#252332", muted: "#625f6c", accent: "#5143b5", accentText: "#ffffff",
      soft: "#f0eef9", line: "#a4a0b7", selected: "#e3ddfc", selectedText: "#3c2e91", a: "#a395e7", b: "#7d68d5", c: "#dce9a7" },
    dark: { paper: "#191921", surface: "#20202b", ink: "#f5f3ff", muted: "#c5c0d4", accent: "#c5baff", accentText: "#252332",
      soft: "#302e41", line: "#837d97", selected: "#433761", selectedText: "#f5f3ff", a: "#a395e7", b: "#7d68d5", c: "#dce9a7" }
  }
};
export default {
  id: "classic",
  name: "Classic",
  eras,
  hero: { art: "retro-workshop.svg" },
  copy: {
    tagline: "A self-paced course",
    navDescription: "One app. A new foundation.",
    footer: "Built for a new chapter.",
    sampleKicker: "Sample notes / Test-flight log",
    futureKicker: "2050s / After the upgrade"
  }
};
