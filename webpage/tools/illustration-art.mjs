import { getEra as eraFor } from "../scripts/eras.js";
import classic from "../seasons/classic/season.js";

const getEra = id => eraFor(id, classic);

const illustrations = {
  journey: { era: "1960s", height: 840, draw: journey },
  workflow: { era: "1970s", height: 820, draw: workflow },
  soundcheck: { era: "soundcheck", height: 850, draw: soundcheck },
  "route-choices": { era: "soundcheck", height: 820, draw: drawRouteChoices },
  "autopilot-flow": { era: "autopilot", height: 720, draw: drawAutopilotFlow },
  investigation: { era: "1980s", height: 830, draw: investigation },
  plan: { era: "1990s", height: 820, draw: plan },
  architecture: { era: "2000s-2010s", height: 860, draw: architecture },
  azure: { era: "2020s", height: 900, draw: azure }
};

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
})[character]);

function primitives(p, prefix) {
  const text = (x, y, value, options = {}) => {
    const { size = 24, fill = p.ink, weight = 400, anchor = "start",
      font = "Trebuchet MS, Verdana, sans-serif", spacing = 0 } = options;
    const lines = Array.isArray(value) ? value : [value];
    return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="${escape(font)}" letter-spacing="${spacing}">${lines.map((line, index) =>
      `<tspan x="${x}" dy="${index ? size * 1.28 : 0}">${escape(line)}</tspan>`).join("")}</text>`;
  };
  const path = (d, { stroke = p.accent, width = 4, fill = "none", dash = "",
    arrow = false, opacity = 1 } = {}) =>
    `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#${prefix}-${arrow === true ? "arrow" : arrow})"` : ""}/>`;
  const number = (x, y, value, color = p.accent, foreground = p.accentText, radius = 23) =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="${p.surface}" stroke-width="4"/>${text(x, y + 8, value, { size: 24, weight: 700, anchor: "middle", fill: foreground })}`;
  const lines = (x, y, widths, color = p.line, gap = 16) => widths.map((width, index) =>
    path(`M${x} ${y + index * gap}h${width}`, { stroke: color, width: 5 })).join("");
  const heading = (title, subtitle, options = {}) =>
    text(60, 89, title, { size: 48, weight: 700, ...options }) +
    text(63, 132, subtitle, { size: 23, fill: p.muted });
  const key = (x, y, scale = 1, color = p.accent) =>
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="0" r="9"/><path d="M9 0h25m-7 0v8m-8-8v6"/></g>`;
  return { text, path, number, lines, heading, key };
}

/**
 * Render a self-contained, theme-matched illustration without external assets.
 * The identifiers are stable so the build can give each chapter its own artwork.
 */
export function renderIllustration(id, mode) {
  if (!Object.hasOwn(illustrations, id)) throw new Error(`Unknown illustration: ${id}`);
  if (mode !== "light" && mode !== "dark") throw new Error(`Unknown illustration theme: ${mode}`);
  const { era, height, draw } = illustrations[id];
  const p = getEra(era)[mode];
  const prefix = `illustration-${id}-${mode}`;
  const { title, description, art, defs = "" } = draw(p, primitives(p, prefix), prefix);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="${height}" viewBox="0 0 1100 ${height}" role="img" aria-labelledby="${prefix}-title ${prefix}-desc" data-illustration="${id}" data-era="${era}" data-theme="${mode}">
  <title id="${prefix}-title">${escape(title)}</title>
  <desc id="${prefix}-desc">${escape(description)}</desc>
  <defs>
    <marker id="${prefix}-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="18" markerHeight="18" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1 1L11 6 1 11Z" fill="${p.accent}"/></marker>
    <marker id="${prefix}-return" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M1 1L11 6 1 11" fill="none" stroke="${p.muted}" stroke-width="2"/></marker>
    <marker id="${prefix}-trail" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="18" markerHeight="18" markerUnits="userSpaceOnUse" orient="auto"><path d="M1 1L11 6 1 11Z" fill="${p.surface}"/></marker>
    ${defs}
  </defs>
  <rect width="1100" height="${height}" fill="${p.paper}"/>
  ${art}
</svg>`;
}

export function drawRouteChoices(p, { text, path, heading }) {
  const card = (x, title, rhythm, details, data, color) => `
    <rect x="${x}" y="315" width="460" height="310" rx="18" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
    <path d="M${x + 18} 315h424" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
    ${text(x + 230, 365, title, { size: 34, weight: 700, anchor: "middle" })}
    ${text(x + 230, 410, rhythm, { size: 23, anchor: "middle", fill: p.accent })}
    ${text(x + 230, 470, details, { size: 23, anchor: "middle" })}
    ${text(x + 230, 583, data, { size: 22, anchor: "middle", fill: p.muted })}`;
  return {
    title: "One app, two upgrade routes",
    description: "Start with BookCatalog on .NET Framework 4.8. The Visual Studio route uses Guided flow to assess, plan, and execute with review stops, an in-place upgrade, and EF Core. The Copilot app route uses one goal and Autopilot, with progress in Canvas and EF6 during a temporary side-by-side migration. Both routes finish with running the .NET 10 app and checking a saved edit after restart.",
    art: `${heading("One app. Two ways to upgrade.", "Choose how you want to direct the work.", { size: 44 })}
      <rect x="340" y="165" width="420" height="90" rx="18" fill="${p.surface}" stroke="${p.accent}" stroke-width="2"/>
      ${text(550, 205, "BookCatalog", { size: 29, weight: 700, anchor: "middle" })}
      ${text(550, 237, ".NET Framework 4.8", { size: 21, anchor: "middle", fill: p.muted })}
      ${path("M550 255V285H290V315", { width: 3, arrow: true })}
      ${path("M550 285H810V315", { width: 3, arrow: true })}
      ${card(60, "Visual Studio", "Assess  >  Plan  >  Execute",
        ["Review each stage in chat.", "Use Guided flow to pause."], "In-place app + EF Core", p.a)}
      ${card(580, "Copilot app", "One goal  >  Autopilot",
        ["Follow progress in Canvas.", "Steer without restarting."], "Temporary host + EF6", p.b)}
      ${path("M290 625V650H550V680", { width: 3, arrow: true })}
      ${path("M810 625V650H550", { width: 3 })}
      <rect x="340" y="680" width="420" height="90" rx="18" fill="${p.soft}" stroke="${p.accent}" stroke-width="2"/>
      ${text(550, 718, "Run your .NET 10 app", { size: 27, weight: 700, anchor: "middle" })}
      ${text(550, 751, "Check add, edit, and restart.", { size: 21, anchor: "middle", fill: p.muted })}`
  };
}

export function drawAutopilotFlow(p, { text, path, number, heading }) {
  const stages = [
    ["Assess", ["Find changes", "for .NET 10"]],
    ["Plan", ["Choose the work", "and task order"]],
    ["Upgrade", ["Update the code", "and dependencies"]],
    ["Validate", ["Build and check", "the application"]]
  ];
  return {
    title: "One goal, continuous progress",
    description: "The BookCatalog folder and .NET 10 goal start an automatic sequence: Assess, Plan, Upgrade, and Validate. No new prompt is needed at each stage. The learner follows Canvas, steers the plan when needed, then runs the app and checks that a saved edit remains after restart. The steering path returns to the plan without restarting the upgrade.",
    art: `${heading("One goal. Continuous progress.", "Copilot runs the stages. You steer and try the app.", { size: 44 })}
      <rect x="60" y="170" width="980" height="80" rx="18" fill="${p.soft}" stroke="${p.accent}" stroke-width="2"/>
      ${text(550, 219, "BookCatalog folder + .NET 10 goal", { size: 29, weight: 700, anchor: "middle" })}
      ${path("M550 250V270H175V290", { width: 3, arrow: true })}
      ${stages.map(([title, detail], i) => {
        const x = 60 + i * 250;
        return `<rect x="${x}" y="290" width="230" height="175" rx="16" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
          ${number(x + 25, 318, String(i + 1), p.accent, p.accentText, 18)}
          ${text(x + 125, 346, title, { size: 29, weight: 700, anchor: "middle" })}
          ${text(x + 115, 394, detail, { size: 22, anchor: "middle" })}
          ${i < 3 ? path(`M${x + 230} 370h20`, { width: 3, arrow: true }) : ""}`;
      }).join("")}
      ${path("M925 465V500H820V535", { width: 3, arrow: true })}
      ${path("M300 535V505H425V465", { stroke: p.muted, width: 3, dash: "7 8", arrow: "return" })}
      <rect x="150" y="535" width="800" height="115" rx="18" fill="${p.soft}" stroke="${p.accent}" stroke-width="2"/>
      ${text(550, 580, "Follow Canvas. Steer when needed.", { size: 28, weight: 700, anchor: "middle" })}
      ${text(550, 619, "Run BookCatalog and check a saved edit after restart.", { size: 23, anchor: "middle", fill: p.muted })}`
  };
}

export function renderAutopilotHeader(mode) {
  if (!["light", "dark"].includes(mode)) throw new Error(`Unknown illustration theme: ${mode}`);
  const p = getEra("autopilot")[mode];
  const { text, path } = primitives(p, `autopilot-header-${mode}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="640" viewBox="0 0 720 640" role="img" aria-labelledby="autopilot-title" data-theme="${mode}">
    <title id="autopilot-title">Autopilot flight deck</title>
    <defs><clipPath id="window"><rect x="50" y="45" width="620" height="550" rx="94"/></clipPath></defs>
    <rect x="28" y="23" width="664" height="594" rx="108" fill="${p.soft}" stroke="${p.line}" stroke-width="2"/>
    <g clip-path="url(#window)">
      <path d="M50 45h620v550H50Z" fill="${p.surface}"/>
      <circle cx="532" cy="155" r="95" fill="${p.c}" opacity=".28"/>
      ${path("M93 338Q362 58 636 334M91 376Q362 120 636 373M90 416Q362 190 635 414", { stroke: p.a, width: 2, opacity: .7 })}
      ${path("M111 264Q382 271 602 122", { stroke: p.accent, width: 4, dash: "6 10" })}
      <circle cx="602" cy="122" r="12" fill="${p.b}" stroke="${p.surface}" stroke-width="5"/>
      <g transform="translate(359 257) rotate(-8)">
        <path d="M-92-64Q-46-84 0-58q46-26 92-6V72Q46 51 0 76-46 51-92 72Z" fill="${p.soft}" stroke="${p.accent}" stroke-width="4"/>
        ${path("M0-58V76M-67-40l43 5m-43 24 43 5M24-35l43-5M24-6l43-5", { stroke: p.accent, width: 3 })}
        <rect x="-52" y="4" width="104" height="47" rx="9" fill="${p.accent}"/>
        ${text(0, 35, ".NET 10", { size: 23, weight: 700, anchor: "middle", fill: p.accentText })}
      </g>
      <path d="M50 432q310-83 620 0v163H50Z" fill="${p.paper}" stroke="${p.line}" stroke-width="2"/>
      <rect x="183" y="429" width="354" height="111" rx="24" fill="${p.surface}" stroke="${p.accent}" stroke-width="2"/>
      ${text(360, 468, "AUTOPILOT", { size: 27, weight: 700, anchor: "middle", spacing: 3 })}
      ${path("M224 500H496", { stroke: p.line, width: 4 })}
      ${[224, 292, 360, 428, 496].map((x, i) => `<circle cx="${x}" cy="500" r="8" fill="${i < 3 ? p.accent : p.c}" stroke="${p.surface}" stroke-width="3"/>`).join("")}
      ${[116, 603].map(x => `<circle cx="${x}" cy="492" r="38" fill="${p.soft}" stroke="${p.line}" stroke-width="2"/>
        <path d="M${x - 24} 494a24 24 0 0 1 48 0" fill="none" stroke="${p.a}" stroke-width="5"/>
        ${path(`M${x} 494l17-18`, { stroke: p.accent, width: 3 })}`).join("")}
      ${path("M125 563H594", { stroke: p.line, width: 2 })}
      ${text(360, 586, "ONE GOAL. A NEW FOUNDATION.", { size: 18, anchor: "middle", fill: p.muted, spacing: 1 })}
    </g>
    ${path("M63 331h22m550 0h22M360 57v18", { stroke: p.accent, width: 3 })}
  </svg>`;
}

function journey(p, { text, path, number, heading }, prefix) {
  const road = "M140 645C158 560 243 566 245 490S335 330 465 365 629 552 700 490 790 329 935 320";
  const rays = Array.from({ length: 12 }, (_, index) => {
    const angle = index * Math.PI / 6;
    const point = (radius) => `${940 + Math.cos(angle) * radius} ${185 + Math.sin(angle) * radius}`;
    return path(`M${point(50)}L${point(70)}`, { stroke: p.c, width: 7 });
  }).join("");
  return {
    title: "A route to modernization",
    description: "A travel-poster road follows seven course chapters in order: 01 Start here, 02 Meet the app, 03 Get ready, 04 Assess, 05 Plan, 06 Upgrade and run, and 07 Azure plan.",
    defs: `<clipPath id="${prefix}-landscape"><rect x="35" y="171" width="1030" height="492" rx="8"/></clipPath>`,
    art: `<rect x="24" y="24" width="1052" height="792" rx="8" fill="none" stroke="${p.line}" stroke-width="2"/>
      ${heading("A route to modernization", "Keep the working application in view.", { font: "Georgia, Times New Roman, serif", size: 51 })}
      ${rays}<circle cx="940" cy="185" r="37" fill="${p.c}"/>
      <g clip-path="url(#${prefix}-landscape)">
        <path d="M35 519Q187 305 349 422T628 382T1065 442V663H35Z" fill="${p.soft}"/>
        <path d="M35 594Q211 463 414 570T785 523T1065 556V663H35Z" fill="${p.a}" opacity=".22"/>
        <path d="M35 636Q257 601 429 634T788 612T1065 635V663H35Z" fill="${p.a}" opacity=".35"/>
        ${path(road, { stroke: p.surface, width: 70 })}
        ${path(road, { stroke: p.accent, width: 56 })}
        ${path(road, { stroke: p.accentText, width: 3, dash: "11 17" })}
        ${path("M191 574l10-14-17 3M355 353l18 1-12 12M578 428l13 15-18-3M803 371l17-9-6 17", { stroke: p.accentText, width: 4 })}
      </g>
      ${text(64, 201, "THE REQUIRED ROUTE", { size: 18, weight: 700, spacing: 2, fill: p.muted })}
      <circle cx="193" cy="570" r="29" fill="${p.surface}" stroke="${p.accent}" stroke-width="4"/>
      <path d="M181 558q12-13 24 0v19h-6v-18q-6-7-12 0v18h-6Z" fill="${p.b}"/>
      ${path("M226 570h24", { stroke: p.accent, width: 3 })}
      ${text(268, 580, "Setup", { size: 29, weight: 700, font: "Georgia, serif" })}
      ${number(140, 645, "00", p.c, "#102e2a", 27)}
      ${text(140, 711, "Meet the app", { size: 29, weight: 700, anchor: "middle", font: "Georgia, serif" })}
      ${text(140, 744, "Start here", { size: 20, anchor: "middle", fill: p.muted })}
      <g transform="translate(130 355)">
        <circle r="43" fill="${p.surface}" stroke="${p.accent}" stroke-width="4"/>
        <circle r="33" fill="none" stroke="${p.line}" stroke-width="2"/>
        <path d="M0-32L12 10 0 24-12-10Z" fill="${p.b}"/>
        <path d="M0-32V24L-12-10Z" fill="${p.a}"/>
        <circle r="5" fill="${p.ink}"/>
      </g>
      ${text(130, 438, "Assess", { size: 29, weight: 700, anchor: "middle", font: "Georgia, serif" })}
      ${number(245, 490, "01", p.c, "#102e2a", 27)}
      ${text(465, 306, "Plan", { size: 30, weight: 700, anchor: "middle", font: "Georgia, serif" })}
      ${number(465, 365, "02", p.c, "#102e2a", 27)}
      <g transform="translate(414 446) rotate(-7 52 37)">
        <path d="M0 6L36-3 71 9 106 0v76L71 85 36 72 0 81Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M36-3v75M71 9v76" stroke="${p.line}" stroke-width="2"/>
        ${path("M12 61L28 39 50 49 76 25 92 30", { stroke: p.b, width: 5, dash: "3 7" })}
        <circle cx="92" cy="30" r="6" fill="${p.accent}"/>
      </g>
      <g transform="translate(667 349) rotate(15 25 30)">
        <path d="M14 4C-4 9-3 33 13 41v47a12 12 0 0 0 24 0V41C54 29 51 10 37 4v20H14Z" fill="${p.b}" stroke="${p.surface}" stroke-width="4"/>
        <circle cx="25" cy="87" r="4" fill="${p.surface}"/>
      </g>
      ${number(700, 490, "03", p.c, "#102e2a", 27)}
      ${text(670, 586, "Upgrade & run", { size: 29, weight: 700, anchor: "middle", font: "Georgia, serif" })}
      ${text(670, 621, "Review the changes", { size: 20, anchor: "middle", fill: p.muted })}
      ${text(924, 281, "Azure plan", { size: 29, weight: 700, anchor: "middle", font: "Georgia, serif" })}
      ${number(935, 320, "04", p.c, "#102e2a", 27)}
      ${text(911, 714, "Azure plan", { size: 25, weight: 700, anchor: "middle", font: "Georgia, serif" })}
      ${text(911, 746, "Review the migration plan", { size: 19, anchor: "middle", fill: p.muted })}
      ${path("M319 756h210M319 768h161M319 780h188", { stroke: p.line, width: 2, opacity: .4 })}
      <circle cx="581" cy="766" r="18" fill="none" stroke="${p.line}" stroke-width="2" opacity=".4"/>`
  };
}

function workflow(p, { text, path, number, lines, heading }) {
  const route = "M210 292C376 186 615 196 790 287S1042 532 804 582 449 703 220 580";
  return {
    title: "Move forward. Look back.",
    description: "The workflow runs in order: Assess, read the report and add a requirement if needed; Plan, request and review the plan; Upgrade, make the approved changes; Review, inspect changes and run the app. If requirements are missed, the dashed correction route returns from Review to Plan.",
    art: `${heading("Move forward. Look back.", "A deliberate workflow, with room to correct course.", { font: "Georgia, Times New Roman, serif", size: 51 })}
      ${path(route, { stroke: p.a, width: 106 })}
      ${path(route, { stroke: p.c, width: 75 })}
      ${path(route, { stroke: p.b, width: 44 })}
      ${path(route, { stroke: p.surface, width: 8 })}
      ${path("M452 224Q506 223 555 234", { stroke: p.surface, width: 4, arrow: "trail" })}
      ${path("M964 383Q981 422 969 458", { stroke: p.surface, width: 4, arrow: "trail" })}
      ${path("M575 639Q519 648 460 645", { stroke: p.surface, width: 4, arrow: "trail" })}
      <g transform="translate(211 279)">
        <circle r="95" fill="${p.surface}"/>
        <path d="M-62-62H18L46-34V60H-62Z" fill="${p.soft}" stroke="${p.accent}" stroke-width="4"/>
        <path d="M18-62v28h28" fill="none" stroke="${p.accent}" stroke-width="3"/>
        ${lines(-43, -33, [43, 54, 35, 47], p.line, 17)}
        <circle cx="34" cy="15" r="34" fill="${p.surface}" stroke="${p.accent}" stroke-width="7"/>
        <path d="M58 41L86 73" stroke="${p.accent}" stroke-width="13" stroke-linecap="round"/>
        <path d="M17 17h30M32 2v30" stroke="${p.a}" stroke-width="4"/>
      </g>
      ${number(121, 217, "1")}
      ${text(211, 407, "Assess", { size: 34, anchor: "middle", weight: 700, font: "Georgia, serif" })}
      ${text(211, 440, ["Read report", "& check findings"], { size: 21, anchor: "middle", fill: p.muted })}
      <g transform="translate(788 279)">
        <circle r="95" fill="${p.surface}"/>
        <path d="M-67-54L-22-68 22-51 65-63V57L22 70-22 52-67 66Z" fill="${p.soft}" stroke="${p.accent}" stroke-width="4"/>
        <path d="M-22-68V52M22-51V70" stroke="${p.line}" stroke-width="2"/>
        ${path("M-51 38L-32 7-7 14 10-16 39-5 49-35", { stroke: p.accent, width: 4, dash: "4 8" })}
        <circle cx="-51" cy="38" r="7" fill="${p.a}"/><circle cx="49" cy="-35" r="7" fill="${p.b}"/>
      </g>
      ${number(698, 217, "2")}
      ${text(788, 407, "Plan", { size: 34, anchor: "middle", weight: 700, font: "Georgia, serif" })}
      ${text(788, 437, ["Request plan", "& review choices"], { size: 21, anchor: "middle", fill: p.muted })}
      <g transform="translate(788 574)">
        <circle r="95" fill="${p.surface}"/>
        <rect x="-66" y="-52" width="130" height="105" rx="9" fill="${p.soft}" stroke="${p.accent}" stroke-width="4"/>
        <path d="M-66-26H64" stroke="${p.accent}" stroke-width="3"/>
        <circle cx="-51" cy="-40" r="4" fill="${p.a}"/><circle cx="-37" cy="-40" r="4" fill="${p.b}"/>
        <path d="M-31-3L-47 11-31 25M7-3L23 11 7 25M-4-6L-17 28" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
        <path d="M47 9L65 27 29 63 11 69 17 51Z" fill="${p.c}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M47 9L57-1Q62-6 67-1L75 7Q80 12 75 17L65 27" fill="${p.a}" stroke="${p.accent}" stroke-width="3"/>
      </g>
      ${number(698, 510, "3")}
      ${text(788, 711, "Upgrade", { size: 34, anchor: "middle", weight: 700, font: "Georgia, serif" })}
      ${text(788, 745, "Make approved changes", { size: 21, anchor: "middle", fill: p.muted })}
      <g transform="translate(211 574)">
        <circle r="95" fill="${p.surface}"/>
        <path d="M-70-44H1V59H-70Z" fill="${p.soft}" stroke="${p.accent}" stroke-width="3" transform="rotate(-8)"/>
        <path d="M-14-61H63V42H-14Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3" transform="rotate(9)"/>
        ${lines(-55, -19, [36, 30, 36], p.line, 18)}
        ${lines(4, -31, [38, 30, 38], p.line, 18)}
        <path d="M-34 30Q4-5 44 30 4 66-34 30Z" fill="${p.c}" stroke="${p.accent}" stroke-width="4"/>
        <circle cx="5" cy="30" r="12" fill="${p.accent}"/><circle cx="8" cy="26" r="4" fill="${p.surface}"/>
      </g>
      ${number(121, 510, "4")}
      ${text(211, 711, "Review", { size: 34, anchor: "middle", weight: 700, font: "Georgia, serif" })}
      ${text(211, 745, "Review changes & run", { size: 21, anchor: "middle", fill: p.muted })}
      ${path("M307 547C420 550 463 406 562 369S630 326 689 307", { stroke: p.muted, width: 3, dash: "7 9", arrow: "return" })}
      ${text(550, 504, "Requirements missed?", { size: 21, weight: 700, anchor: "middle" })}
      ${text(550, 535, "Return to Plan", { size: 21, anchor: "middle", fill: p.muted })}
      <path d="M42 779Q85 765 121 779M963 171Q1000 153 1038 171" fill="none" stroke="${p.line}" stroke-width="4" opacity=".5"/>`
  };
}

function starburst(x, y, radius, fill) {
  const points = Array.from({ length: 32 }, (_, index) => {
    const angle = index * Math.PI / 16 - Math.PI / 2;
    const r = index % 2 ? radius * .64 : radius;
    return `${(x + Math.cos(angle) * r).toFixed(2)},${(y + Math.sin(angle) * r).toFixed(2)}`;
  }).join(" ");
  return `<polygon points="${points}" fill="${fill}"/>`;
}

export function renderSoundcheckHeader(mode) {
  if (!["light", "dark"].includes(mode)) throw new Error(`Unknown illustration theme: ${mode}`);
  const p = getEra("soundcheck")[mode];
  const { text, path } = primitives(p, `soundcheck-header-${mode}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="480" viewBox="0 0 520 480" data-era="soundcheck" data-theme="${mode}">
    <title>Soundcheck concert poster</title>
    <rect x="12" y="12" width="496" height="456" rx="130" fill="${p.paper}"/>
    ${path("M-20 295C119 482 139 63 307 80S462 378 553 188", { stroke: p.a, width: 28 })}
    ${path("M-20 326C119 513 139 94 307 111S462 409 553 219", { stroke: p.b, width: 19 })}
    ${path("M-20 350C119 537 139 118 307 135S462 433 553 243", { stroke: p.c, width: 12 })}
    ${starburst(424, 89, 63, p.b)}
    ${starburst(75, 390, 48, p.a)}
    <g transform="rotate(-6 260 248)">
      <path d="M54 212Q260 78 466 202L451 318Q268 387 69 325Z" fill="${p.accent}"/>
      ${text(260, 236, "SOUND", { size: 87, weight: 700, anchor: "middle", fill: p.accentText, font: "Georgia, Times New Roman, serif", spacing: -6 })}
      ${text(260, 311, "CHECK", { size: 87, weight: 700, anchor: "middle", fill: p.accentText, font: "Georgia, Times New Roman, serif", spacing: -6 })}
    </g>
    <path d="M159 367h239v17a14 14 0 0 0 0 28v17H159v-17a14 14 0 0 0 0-28Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="2"/>
    ${text(278, 406, "READY TO RUN", { size: 24, weight: 700, anchor: "middle", spacing: 2 })}
  </svg>`;
}

function soundcheck(p, { text, path }) {
  const ticket = (x, number, title, lines) => `
    <path d="M${x} 346h300v76a20 20 0 0 0 0 40v163H${x}V462a20 20 0 0 0 0-40Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
    ${path(`M${x + 21} 445h258`, { stroke: p.line, width: 2, dash: "5 8" })}
    ${text(x + 150, 402, number, { size: 24, weight: 700, anchor: "middle", spacing: 3, fill: p.accent })}
    ${text(x + 150, 499, title, { size: 31, weight: 700, anchor: "middle", font: "Georgia, Times New Roman, serif" })}
    ${text(x + 150, 550, lines, { size: 23, anchor: "middle", fill: p.muted })}`;
  return {
    title: "Soundcheck: get ready",
    description: "A concert poster with three numbered tickets: 1 Check tools and Copilot access; 2 Open the BookCatalog solution in a learner copy; 3 Run the app, add a sample book, and edit it. Already set up? Go straight to running BookCatalog. Flowing ribbons connect the tickets, but the body instructions remain plain and readable.",
    art: `<rect x="24" y="24" width="1052" height="802" rx="38" fill="none" stroke="${p.accent}" stroke-width="3"/>
      <g transform="translate(0 48)">
      ${path("M-30 312C118 163 218 417 409 310S706 89 868 258 1027 321 1140 259", { stroke: p.a, width: 27 })}
      ${path("M-30 345C118 196 218 450 409 343S706 122 868 291 1027 354 1140 292", { stroke: p.b, width: 21 })}
      ${path("M-30 371C118 222 218 476 409 369S706 148 868 317 1027 380 1140 318", { stroke: p.c, width: 14 })}
      </g>
      ${text(69, 71, "BEFORE THE FIRST REPORT", { size: 23, weight: 700, spacing: 3, fill: p.muted })}
      <g transform="rotate(-4 455 174)">
        ${text(61, 214, "Soundcheck", { size: 105, weight: 700, font: "Georgia, Times New Roman, serif", spacing: -5, fill: p.accent })}
      </g>
      ${starburst(948, 153, 82, p.b)}
      ${starburst(948, 153, 42, p.c)}
      ${ticket(60, "01", "Check tools", ["Installed tools", "+ Copilot access"])}
      ${ticket(400, "02", "Open the app", ["BookCatalog solution", "in your learner copy"])}
      ${ticket(740, "03", "Try the app", ["Run, add a book,", "then edit it"])}
      ${text(550, 706, "Already set up?", { size: 32, weight: 700, anchor: "middle", font: "Georgia, Times New Roman, serif" })}
      ${text(550, 751, "Go straight to running BookCatalog.", { size: 26, anchor: "middle" })}
      ${path("M289 788Q550 818 811 788", { stroke: p.a, width: 10 })}
      ${starburst(116, 745, 45, p.c)}${starburst(984, 745, 45, p.a)}`
  };
}

function investigation(p, { text, path, number, lines, heading }) {
  return {
    title: "Make the report useful",
    description: "An assessment desk shows five report-review steps: 1 Open report, 2 Confirm app and target, 3 Read findings, 4 Edit if needed, and 5 Save report. Keep the assessment unchanged if it describes the correct application and target. An added requirement is optional.",
    art: `${heading("Make the report useful", "Check the findings. Add a requirement only if needed.", { font: "Trebuchet MS, Verdana, sans-serif", size: 53 })}
      <path d="M32 190L1034 165 1061 766 69 790Z" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
      <path d="M38 713L155 795H44ZM995 167L1061 257V167Z" fill="${p.a}"/>
      <path d="M974 717l19-17 19 17 19-17 19 17" fill="none" stroke="${p.b}" stroke-width="8"/>
      <circle cx="78" cy="209" r="13" fill="${p.c}"/><circle cx="1028" cy="633" r="16" fill="${p.b}"/>
      ${path("M271 291L420 267", { width: 4, arrow: true })}
      ${path("M646 271L787 289", { width: 4, arrow: true })}
      ${path("M1001 326C1040 415 1010 517 889 564", { width: 4, arrow: true })}
      ${path("M643 622L437 622", { width: 4, arrow: true })}
      <g transform="translate(172 301) rotate(-8)">
        <path d="M-61-80H42L67-54V76H-61Z" fill="${p.paper}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M42-80v26h25" fill="${p.c}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M-44-38H41v22H-44Z" fill="${p.c}"/>
        ${lines(-43, 4, [84, 65, 74], p.line, 20)}
        <path d="M-27-93H26v24H-27Z" fill="${p.a}" opacity=".9"/>
      </g>
      ${number(94, 239, "1")}
      ${text(176, 425, "Open report", { size: 28, anchor: "middle", weight: 700 })}
      <g transform="translate(536 290) rotate(5)">
        <path d="M-92-65H69V48H-92Z" fill="${p.soft}" stroke="${p.ink}" stroke-width="4"/>
        <path d="M-106 48H82L97 68H-121Z" fill="${p.a}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M-59-28L-76-12-59 4M-7-28L10-12-7 4M-27-36L-42 10" fill="none" stroke="${p.accent}" stroke-width="5"/>
        ${lines(-71, 26, [55], p.line)}
        <circle cx="60" cy="22" r="33" fill="${p.surface}" stroke="${p.ink}" stroke-width="6"/>
        <path d="M84 46L107 70" stroke="${p.b}" stroke-width="13" stroke-linecap="round"/>
        <path d="M43 22h34M60 5v34" stroke="${p.accent}" stroke-width="4"/>
      </g>
      ${number(436, 212, "2")}
      ${text(535, 425, "Confirm app & target", { size: 26, anchor: "middle", weight: 700 })}
      <g transform="translate(897 300) rotate(-4)">
        <rect x="-90" y="-67" width="177" height="128" fill="${p.soft}" stroke="${p.ink}" stroke-width="4"/>
        <path d="M-90-38H87" stroke="${p.ink}" stroke-width="3"/>
        <circle cx="-74" cy="-53" r="5" fill="${p.b}"/><circle cx="-58" cy="-53" r="5" fill="${p.a}"/>
        <rect x="-69" y="-18" width="49" height="57" fill="${p.a}"/>
        ${lines(-3, -12, [65, 48, 56], p.line, 19)}
        <path d="M36 16L43 69 58 54 75 52Z" fill="${p.c}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M67 25l12-8M54 12V-2M79 39l15 2" stroke="${p.b}" stroke-width="4" stroke-linecap="round"/>
      </g>
      ${number(810, 232, "3")}
      ${text(892, 425, "Read findings", { size: 27, anchor: "middle", weight: 700 })}
      <g transform="translate(757 608) rotate(7)">
        <path d="M-77-77H46L65-56V75H-77Z" fill="${p.paper}" stroke="${p.ink}" stroke-width="3"/>
        <circle cx="-48" cy="-35" r="10" fill="none" stroke="${p.accent}" stroke-width="3"/>
        <circle cx="-48" cy="13" r="10" fill="none" stroke="${p.accent}" stroke-width="3"/>
        ${lines(-24, -35, [60], p.line)}${lines(-24, 13, [53], p.line)}
        <path d="M66-59L82-46 29 26 8 34 13 12Z" fill="${p.c}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M66-59L76-73 92-60 82-46Z" fill="${p.b}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M-56 53H38" stroke="${p.a}" stroke-width="10"/>
      </g>
      ${number(656, 537, "4")}
      ${text(757, 746, "Edit if needed", { size: 29, anchor: "middle", weight: 700 })}
      <g transform="translate(316 617) rotate(-5)">
        <rect x="-70" y="-86" width="139" height="167" rx="6" fill="${p.soft}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M-29-93h57v24h-57Z" fill="${p.b}" stroke="${p.ink}" stroke-width="3"/>
        <path d="M-45-38h17v17h-17Zm0 41h17v17h-17Zm0 41h17v17h-17Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
        ${lines(-10, -29, [54], p.line)}${lines(-10, 12, [45], p.line)}${lines(-10, 53, [53], p.line)}
        <path d="M78-29L94-13 78 3 94 19" fill="none" stroke="${p.a}" stroke-width="7"/>
      </g>
      ${number(221, 543, "5")}
      ${text(316, 746, "Save report", { size: 29, anchor: "middle", weight: 700 })}
      <path d="M126 521l-27 13 26 14-25 14" fill="none" stroke="${p.b}" stroke-width="7"/>
      <path d="M465 746l15-27 15 27Z" fill="${p.c}"/>
      <circle cx="556" cy="567" r="19" fill="none" stroke="${p.a}" stroke-width="7"/>`
  };
}

function plan(p, { text, path, heading }) {
  const window = (x, y, width, height, caption, contents) => `
    <path d="M${x + 9} ${y + 9}h${width}v${height}H${x + 9}Z" fill="${p.ink}" opacity=".14"/>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${p.soft}" stroke="${p.ink}" stroke-width="2"/>
    <path d="M${x + 3} ${y + height - 3}V${y + 3}H${x + width - 3}" fill="none" stroke="${p.surface}" stroke-width="5"/>
    <path d="M${x + width - 3} ${y + 4}V${y + height - 3}H${x + 3}" fill="none" stroke="${p.line}" stroke-width="5"/>
    <rect x="${x + 8}" y="${y + 8}" width="${width - 16}" height="43" fill="${p.accent}"/>
    ${text(x + 23, y + 38, caption, { size: 23, weight: 700, font: "Verdana, Tahoma, sans-serif", fill: p.accentText })}
    ${contents}`;
  return {
    title: "Shape the upgrade plan",
    description: "A desktop planning scene links 1 Request plan: Ask the agent, to 2 Review choices: In-place and EF Core, to 3 Check plan: Read tasks and checks. The stage guidance is Review before execution. Building and running the app happens in Chapter 06, not during planning.",
    art: `${heading("Shape the upgrade plan", "Review the options. Make the next action clear.", { font: "Verdana, Tahoma, sans-serif", size: 43 })}
      <rect x="35" y="177" width="1030" height="606" fill="${p.a}" opacity=".13"/>
      <path d="M35 783V177H1065" fill="none" stroke="${p.line}" stroke-width="3"/>
      <path d="M1065 177V783H35" fill="none" stroke="${p.surface}" stroke-width="3"/>
      ${window(64, 219, 436, 213, "01  Request plan", `
        <path d="M96 291h57l23 23v88H96Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M153 291v23h23" fill="${p.c}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M112 339h47M112 356h37M112 373h45" stroke="${p.line}" stroke-width="4"/>
        ${text(202, 333, ["Ask the", "agent"], { size: 29, font: "Verdana, Tahoma, sans-serif" })}
      `)}
      ${path("M512 326H609", { width: 6, arrow: true })}
      ${window(625, 219, 409, 213, "02  Review choices", `
        <path d="M652 315v-24h40l14 14h45v83H652Z" fill="${p.b}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M652 323h111l-13 65h-98Z" fill="${p.c}" stroke="${p.accent}" stroke-width="3"/>
        ${text(780, 315, ["In-place", "and", "EF Core"], { size: 25, font: "Verdana, Tahoma, sans-serif" })}
      `)}
      ${path("M835 445V468H734V492", { width: 6, arrow: true })}
      ${window(281, 504, 572, 184, "03  Check plan", `
        <path d="M311 573h58v80h-58Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M399 573h58v80h-58Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
        <path d="M323 593h33M323 610h33M323 627h24M410 593h33M410 610h33M410 627h24" stroke="${p.line}" stroke-width="4"/>
        <path d="M378 604h12M378 618h12" stroke="${p.accent}" stroke-width="4"/>
        ${text(486, 603, ["Read tasks", "and checks"], { size: 28, font: "Verdana, Tahoma, sans-serif" })}
      `)}
      <path d="M79 590h139M79 604h95M903 569h99M903 583h66" stroke="${p.line}" stroke-width="2" opacity=".5"/>
      <rect x="48" y="714" width="1004" height="56" fill="${p.soft}" stroke="${p.line}" stroke-width="2"/>
      <path d="M51 767v-50h998" fill="none" stroke="${p.surface}" stroke-width="3"/>
      ${text(75, 749, "STAGE", { size: 19, weight: 700, fill: p.muted, font: "Verdana, sans-serif", spacing: 1 })}
      <path d="M173 725v34" stroke="${p.line}" stroke-width="2"/>
      ${text(199, 751, "Review before execution", { size: 27, font: "Verdana, Tahoma, sans-serif" })}
      <g fill="${p.accent}" opacity=".65"><rect x="974" y="733" width="8" height="18"/><rect x="989" y="727" width="8" height="24"/><rect x="1004" y="721" width="8" height="30"/></g>`
  };
}

function architecture(p, { text, path, heading }, prefix) {
  return {
    title: "Follow one request",
    description: "The browser sends a request to BooksController. The controller uses its injected ApplicationDbContext for data access to BookCatalogModernizedLab, and data returns to the context. The controller selects a Razor view. The view renders HTML back to the browser; the view does not query the database directly. Solid arrows show requests or data access, and dashed arrows show the response or returned data.",
    defs: `<linearGradient id="${prefix}-glass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${p.surface}"/><stop offset=".48" stop-color="${p.soft}"/><stop offset="1" stop-color="${p.paper}"/></linearGradient>
      <linearGradient id="${prefix}-metal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${p.a}"/><stop offset=".35" stop-color="${p.surface}"/><stop offset="1" stop-color="${p.b}"/></linearGradient>`,
    art: `${heading("Follow one request", "The controller coordinates the page and its data.", { size: 53 })}
      <ellipse cx="572" cy="731" rx="229" ry="22" fill="${p.ink}" opacity=".08"/>
      <ellipse cx="952" cy="629" rx="117" ry="17" fill="${p.ink}" opacity=".09"/>
      <rect x="376" y="235" width="423" height="481" rx="36" fill="url(#${prefix}-glass)" stroke="${p.line}" stroke-width="3"/>
      <path d="M394 266Q395 250 416 250H759" fill="none" stroke="${p.surface}" stroke-width="8" stroke-linecap="round"/>
      <path d="M789 281v383" stroke="${p.b}" stroke-width="8" stroke-linecap="round" opacity=".4"/>
      ${text(588, 209, "Application", { size: 28, weight: 700, anchor: "middle" })}
      <g transform="translate(46 305)">
        <rect width="247" height="231" rx="14" fill="url(#${prefix}-glass)" stroke="${p.accent}" stroke-width="3"/>
        <path d="M0 47H247" stroke="${p.line}" stroke-width="2"/>
        <path d="M16 12h80l14 25H16Z" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
        <circle cx="202" cy="24" r="5" fill="${p.a}"/><circle cx="219" cy="24" r="5" fill="${p.b}"/>
        <rect x="16" y="63" width="214" height="27" rx="4" fill="${p.accent}"/>
        <rect x="19" y="107" width="208" height="98" rx="5" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
        <path d="M29 123h30v64H29Z" fill="${p.a}"/><path d="M65 134h27v53H65Z" fill="${p.b}"/>
        <path d="M100 118l28-4 10 73h-27Z" fill="${p.c}"/>
        <path d="M24 190H146M159 124h50M159 144h42M159 165h49" stroke="${p.line}" stroke-width="4"/>
      </g>
      ${text(170, 278, "Browser", { size: 28, weight: 700, anchor: "middle" })}
      ${path("M294 352H413", { width: 5, arrow: true })}
      ${text(337, 331, "Request", { size: 19, anchor: "middle", fill: p.muted })}
      <g>
        <rect x="417" y="300" width="345" height="95" rx="17" fill="${p.accent}"/>
        <path d="M430 310H749" stroke="${p.accentText}" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>
        ${text(589, 357, "BooksController", { size: 29, weight: 700, anchor: "middle", fill: p.accentText })}
        <path d="M447 286v-14m28 14v-14m229 14v-14m28 14v-14" stroke="${p.line}" stroke-width="5" stroke-linecap="round"/>
      </g>
      ${path("M591 397V446", { width: 4, arrow: true })}
      ${text(620, 430, "uses", { size: 19, fill: p.muted })}
      <rect x="429" y="452" width="333" height="95" rx="12" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
      ${text(595, 481, "injected", { size: 19, anchor: "middle", fill: p.muted })}
      ${text(595, 520, "ApplicationDbContext", { size: 26, weight: 700, anchor: "middle" })}
      ${path("M764 485H862", { width: 4, arrow: true })}
      ${text(829, 466, "query", { size: 19, anchor: "middle", fill: p.muted })}
      ${path("M862 531H765", { stroke: p.muted, width: 3, dash: "7 7", arrow: "return" })}
      ${text(829, 560, "data", { size: 19, anchor: "middle", fill: p.muted })}
      <g transform="translate(865 405)">
        <path d="M0 34V166C0 210 182 210 182 166V34" fill="url(#${prefix}-metal)" stroke="${p.accent}" stroke-width="3"/>
        <ellipse cx="91" cy="34" rx="91" ry="30" fill="${p.soft}" stroke="${p.accent}" stroke-width="3"/>
        <ellipse cx="91" cy="31" rx="72" ry="20" fill="${p.surface}" opacity=".75"/>
        <path d="M0 94c0 43 182 43 182 0M0 148c0 43 182 43 182 0" fill="none" stroke="${p.accent}" stroke-width="3"/>
        <path d="M18 75v15m0 39v16m0 35v9" stroke="${p.surface}" stroke-width="6" stroke-linecap="round"/>
      </g>
      ${text(956, 379, "Data store", { size: 26, weight: 700, anchor: "middle" })}
      <g aria-label="BookCatalogModernizedLab">
        ${text(956, 672, ["BookCatalog", "ModernizedLab"], { size: 25, weight: 700, anchor: "middle" })}
      </g>
      ${path("M418 378H399V638H434", { width: 4, arrow: true })}
      ${text(443, 584, "selects", { size: 19, fill: p.muted })}
      <rect x="441" y="604" width="292" height="78" rx="10" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
      <path d="M460 619h30l13 13v36h-43Z" fill="${p.soft}" stroke="${p.line}" stroke-width="2"/>
      <path d="M490 619v13h13M469 643h25m-25 10h18" fill="none" stroke="${p.line}" stroke-width="2"/>
      ${text(613, 652, "Razor view", { size: 27, weight: 700, anchor: "middle" })}
      ${path("M439 657H172V538", { stroke: p.muted, width: 3, dash: "8 8", arrow: "return" })}
      ${text(258, 625, "Rendered HTML", { size: 20, anchor: "middle", fill: p.muted })}
      ${path("M88 796h65", { width: 4, arrow: true })}
      ${text(172, 803, "Request / data access", { size: 21 })}
      ${path("M563 796h65", { stroke: p.muted, width: 3, dash: "7 7", arrow: "return" })}
      ${text(647, 803, "Response / returned data", { size: 21 })}`
  };
}

function azure(p, { text, path, heading, key }, prefix) {
  const person = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="87" rx="61" ry="16" fill="${p.ink}" opacity=".09"/>
    <path d="M-47 76V49a47 47 0 0 1 94 0v27Q0 103-47 76Z" fill="${p.a}"/>
    <path d="M-47 76V49a47 47 0 0 1 29-43v76Z" fill="${p.b}"/>
    <circle cy="-29" r="32" fill="${p.soft}" stroke="${p.accent}" stroke-width="3"/>
    <path d="M-20-46Q0-64 20-46" fill="none" stroke="${p.accent}" stroke-width="4" stroke-linecap="round"/>
  </g>`;
  return {
    title: "A proposed home in Azure",
    description: "Proposed target, not an existing deployment. Demo data only. A public sample user sends HTTPS requests to App Service running BookCatalog. The application accesses Key Vault for its connection setting and Azure SQL for Books. Its runtime managed identity authorizes access to both Key Vault and SQL. Separately, an approved administrator creates the schema from the EF Core model and adds demo seed data. Solid arrows are runtime requests or access; the dashed arrow is administrator setup, not runtime identity.",
    defs: `<linearGradient id="${prefix}-sculpture" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${p.surface}"/><stop offset="1" stop-color="${p.soft}"/></linearGradient>`,
    art: `${heading("A proposed home in Azure", "Disposable sample data only", { size: 49 })}
      ${text(63, 185, "PROPOSED TARGET", { size: 18, spacing: 2, weight: 700, fill: p.muted })}
      <path d="M361 285Q514 178 670 285L694 496Q533 578 354 510Z" fill="${p.soft}"/>
      <ellipse cx="523" cy="595" rx="184" ry="28" fill="${p.ink}" opacity=".065"/>
      <ellipse cx="927" cy="356" rx="96" ry="18" fill="${p.ink}" opacity=".075"/>
      <ellipse cx="932" cy="656" rx="104" ry="17" fill="${p.ink}" opacity=".075"/>
      ${person(123, 352)}
      ${text(123, 482, ["Public sample", "user"], { size: 24, anchor: "middle" })}
      ${path("M195 365H371", { width: 4, arrow: true })}
      ${text(284, 343, "HTTPS", { size: 21, anchor: "middle", fill: p.muted })}
      ${text(522, 246, "App Service", { size: 28, weight: 700, anchor: "middle" })}
      <g>
        <path d="M379 312L419 281H676L645 312Z" fill="${p.a}"/>
        <path d="M645 312L676 281V477L645 510Z" fill="${p.b}"/>
        <rect x="379" y="312" width="266" height="198" rx="9" fill="url(#${prefix}-sculpture)" stroke="${p.line}" stroke-width="2"/>
        <path d="M401 333H620" stroke="${p.surface}" stroke-width="5" stroke-linecap="round"/>
        <g transform="translate(510 374)">
          <path d="M-52-22Q-25-32 0-17V47Q-25 32-52 42Z" fill="${p.a}" stroke="${p.accent}" stroke-width="2"/>
          <path d="M0-17Q25-32 52-22V42Q25 32 0 47Z" fill="${p.c}" stroke="${p.accent}" stroke-width="2"/>
          <path d="M0-17V47" stroke="${p.accent}" stroke-width="3"/>
          <path d="M-41-10l26 3m-26 14l26 3M15-7l26-3M15 10l26-3" stroke="${p.accent}" stroke-width="2" opacity=".6"/>
        </g>
        ${text(512, 472, "BookCatalog", { size: 29, weight: 700, anchor: "middle" })}
        <circle cx="606" cy="491" r="4" fill="${p.accent}"/>
        <rect x="378" y="536" width="299" height="53" rx="26" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
        ${key(405, 562, .8)}
        ${text(547, 569, "Managed identity", { size: 23, anchor: "middle" })}
      </g>
      ${path("M678 338H756V283H844", { width: 4, arrow: true })}
      ${text(765, 257, "Read setting", { size: 19, anchor: "middle", fill: p.muted })}
      <g transform="translate(928 272)">
        <path d="M-65-58L-41-75H65L44-58Z" fill="${p.c}"/>
        <path d="M44-58L65-75V69L44 87Z" fill="${p.a}"/>
        <rect x="-65" y="-58" width="109" height="145" rx="27" fill="url(#${prefix}-sculpture)" stroke="${p.line}" stroke-width="2"/>
        <path d="M-49-24Q-50-43-31-43H12" stroke="${p.surface}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="-10" cy="3" r="18" fill="${p.accent}"/>
        <path d="M-17 15h14l5 28h-24Z" fill="${p.accent}"/>
      </g>
      ${text(924, 403, "Key Vault", { size: 27, weight: 700, anchor: "middle" })}
      ${text(924, 433, "connection setting", { size: 20, anchor: "middle", fill: p.muted })}
      ${path("M679 472H735V580H841", { width: 4, arrow: true })}
      ${text(797, 555, "Query data", { size: 19, anchor: "middle", fill: p.muted })}
      ${key(812, 475, .7)}
      ${text(951, 482, "Managed identity", { size: 20, anchor: "middle" })}
      ${text(951, 509, "authorizes both", { size: 19, anchor: "middle", fill: p.muted })}
      <g transform="translate(852 526)">
        <path d="M0 25V102C0 141 168 141 168 102V25" fill="url(#${prefix}-sculpture)" stroke="${p.line}" stroke-width="2"/>
        <path d="M137 39V119Q166 114 168 102V25Z" fill="${p.a}" opacity=".5"/>
        <ellipse cx="84" cy="25" rx="84" ry="26" fill="${p.c}" stroke="${p.line}" stroke-width="2"/>
        <ellipse cx="84" cy="22" rx="63" ry="14" fill="${p.surface}" opacity=".6"/>
        <path d="M0 72c0 37 168 37 168 0" fill="none" stroke="${p.line}" stroke-width="2"/>
        <path d="M17 48v21m0 29v9" stroke="${p.surface}" stroke-width="6" stroke-linecap="round"/>
      </g>
      ${text(936, 693, "Azure SQL", { size: 27, weight: 700, anchor: "middle" })}
      ${text(936, 724, "Books", { size: 22, anchor: "middle", fill: p.muted })}
      <path d="M62 646H666" stroke="${p.line}" stroke-width="2" opacity=".5"/>
      ${person(343, 731, .69)}
      ${text(76, 745, ["Approved", "administrator"], { size: 24 })}
      ${text(467, 696, "ONE-TIME SETUP", { size: 18, weight: 700, spacing: 1, fill: p.muted })}
      ${path("M391 759H1061V628H1024", { stroke: p.muted, width: 3, dash: "8 9", arrow: "return" })}
      ${text(692, 795, "Schema and demo seed data", { size: 22, anchor: "middle", fill: p.muted })}
      ${path("M65 857h53", { width: 4, arrow: true })}
      ${text(134, 864, "Runtime requests / access", { size: 21 })}
      ${path("M628 857h53", { stroke: p.muted, width: 3, dash: "8 8", arrow: "return" })}
      ${text(698, 864, "Administrator setup", { size: 21 })}`
  };
}
