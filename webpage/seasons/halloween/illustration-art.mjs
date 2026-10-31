import { getEra as eraFor } from "../../scripts/eras.js";
import halloween from "./season.js";
import { halloweenMotifs } from "./art.mjs";
import { drawRouteChoices, drawAutopilotFlow } from "../../tools/illustration-art.mjs";

const getEra = id => eraFor(id, halloween);

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
      font = "Segoe UI, Arial, sans-serif", spacing = 0 } = options;
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
    text(60, 89, title, { size: 48, weight: 400, font: "Georgia, serif", ...options }) +
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
  <g aria-hidden="true">${halloweenMotifs(p).ghost(1028, 75, .45)}${halloweenMotifs(p).star(984, 37, .5)}</g>
</svg>`;
}

function journey(p, { text, path, number, heading }) {
  const { pumpkin, ghost, moon, bat, star } = halloweenMotifs(p);
  const stops = [
    [135, 287, "01", "Start here", "Pumpkin patch"],
    [410, 287, "02", "Meet the app", "Haunted library"],
    [685, 287, "03", "Get ready", "Trick-or-treat porch"],
    [960, 287, "04", "Assess", "Ghost detective bureau"],
    [825, 589, "05", "Plan", "Witch's spellbook"],
    [510, 589, "06", "Upgrade & run", "Monster laboratory"],
    [190, 589, "07", "Azure plan", "Moonlit sky"]
  ];
  return {
    title: "A friendly-spooky route to modernization",
    description: "A Halloween trail follows seven course chapters in order: 01 Start here, 02 Meet the app, 03 Setup and get ready, 04 Assess, 05 Plan, 06 Upgrade and run, and 07 Azure plan. Each stop has its own friendly Halloween setting.",
    art: `${heading("A little spooky. A new foundation.", "Seven stops. One working application.", { font: "Georgia, serif", size: 46 })}
      ${path("M135 287H960Q1060 438 825 589H190", { stroke: p.a, width: 2 })}
      ${path("M135 298H960Q1045 438 825 578H190", { stroke: p.a, width: 1, opacity: .45 })}
      ${stops.map(([x, y, n, title, scene]) => `${number(x, y, n)}
        ${text(x, y + 62, title, { size: 27, weight: 700, anchor: "middle" })}
        ${text(x, y + 95, scene, { size: 17, anchor: "middle", fill: p.muted })}`).join("")}
      ${pumpkin(135, 211, .8)}${ghost(410, 209, .7)}${pumpkin(685, 214, .65)}
      ${ghost(960, 211, .7)}${star(825, 506, 1.7)}${ghost(510, 507, .7)}${moon(190, 505, 37)}
      ${bat(422, 434, .7)}${star(729, 425)}${star(94, 460, .8)}
      ${text(550, 762, "Keep the learning. Leave the cobwebs behind.", { size: 25, anchor: "middle", fill: p.muted })}`
  };
}

function workflow(p, { text, path, number, lines, heading }) {
  const route = "M210 292C376 186 615 196 790 287S1042 532 804 582 449 703 220 580";
  return {
    title: "Move forward. Look back.",
    description: "The workflow runs in order: Assess, read the report and add a requirement if needed; Plan, request and review the plan; Upgrade, make the approved changes; Review, inspect changes and run the app. If requirements are missed, the dashed correction route returns from Review to Plan.",
    art: `${heading("Move forward. Look back.", "A deliberate workflow, with room to correct course.", { font: "Georgia, Times New Roman, serif", size: 51 })}
      ${path(route, { stroke: p.a, width: 2 })}
      ${path("M452 224Q506 223 555 234", { width: 3, arrow: true })}
      ${path("M964 383Q981 422 969 458", { width: 3, arrow: true })}
      ${path("M575 639Q519 648 460 645", { width: 3, arrow: true })}
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

function soundcheck(p, { text, path }) {
  const ticket = (x, number, title, lines) => `
    <path d="M${x} 346h300v76a20 20 0 0 0 0 40v163H${x}V462a20 20 0 0 0 0-40Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="3"/>
    ${path(`M${x + 21} 445h258`, { stroke: p.line, width: 2, dash: "5 8" })}
    ${text(x + 150, 402, number, { size: 24, weight: 700, anchor: "middle", spacing: 3, fill: p.accent })}
    ${text(x + 150, 499, title, { size: 31, weight: 700, anchor: "middle", font: "Georgia, Times New Roman, serif" })}
    ${text(x + 150, 550, lines, { size: 23, anchor: "middle", fill: p.muted })}`;
  return {
    title: "Trick-or-treat: get ready",
    description: "Three trick-or-treat tickets show the setup sequence: 1 Check tools and Copilot access; 2 Open the BookCatalog solution in a learner copy; 3 Run the app, add a sample book, and edit it. Already set up? Go straight to running BookCatalog. Friendly ghosts and candy colors decorate the tickets, but the body instructions remain plain and readable.",
    art: `<rect x="24" y="24" width="1052" height="802" rx="12" fill="none" stroke="${p.line}" stroke-width="1"/>
      ${path("M60 260q490 90 980 0", { stroke: p.a, width: 2 })}
      ${[130, 270, 410, 550, 690, 830, 970].map((x, i) => `<circle cx="${x}" cy="${273 + Math.sin(i / 6 * Math.PI) * 32}" r="6" fill="${p.b}"/>`).join("")}
      ${text(69, 71, "BEFORE THE FIRST REPORT", { size: 23, weight: 700, spacing: 3, fill: p.muted })}
      ${text(65, 194, "Trick or treat?", { size: 72, font: "Georgia, Times New Roman, serif", spacing: -2, fill: p.accent })}
      ${halloweenMotifs(p).pumpkin(947, 193, .9)}
      ${ticket(60, "01", "Check tools", ["Installed tools", "+ Copilot access"])}
      ${ticket(400, "02", "Open the app", ["BookCatalog solution", "in your learner copy"])}
      ${ticket(740, "03", "Try the app", ["Run, add a book,", "then edit it"])}
      ${text(550, 706, "Already set up?", { size: 32, weight: 700, anchor: "middle", font: "Georgia, Times New Roman, serif" })}
      ${text(550, 751, "Go straight to running BookCatalog.", { size: 26, anchor: "middle" })}
      ${path("M360 790h380", { stroke: p.line, width: 1 })}`
  };
}

function investigation(p, { text, path, number, lines, heading }) {
  return {
    title: "Make the report useful",
    description: "An assessment desk shows five report-review steps: 1 Open report, 2 Confirm app and target, 3 Read findings, 4 Edit if needed, and 5 Save report. Keep the assessment unchanged if it describes the correct application and target. An added requirement is optional.",
    art: `${heading("Make the report useful", "Check the findings. Add a requirement only if needed.", { font: "Courier New, monospace", size: 46 })}
      <path d="M35 178h1030v612H35Z" fill="${p.surface}" stroke="${p.line}" stroke-width="1"/>
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
      ${path("M84 482h926", { stroke: p.line, width: 1, dash: "4 8" })}`
  };
}

function plan(p, { text, path, heading }) {
  const window = (x, y, width, height, caption, contents) => `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="2" fill="${p.surface}" stroke="${p.line}" stroke-width="1"/>
    <path d="M${x + 8} ${y + 8}h${width - 16}v${height - 16}H${x + 8}Z" fill="none" stroke="${p.line}" stroke-width="1"/>
    ${text(x + 23, y + 38, caption, { size: 25, font: "Georgia, serif", fill: p.accent })}
    ${path(`M${x + 23} ${y + 55}h${width - 46}`, { stroke: p.line, width: 1 })}
    ${contents}`;
  return {
    title: "Shape the upgrade plan",
    description: "Three spellbook panels link 1 Request plan: Ask the agent, to 2 Review choices: In-place and EF Core, to 3 Check plan: Read tasks and checks. The stage guidance is Review before execution. Building and running the app happens in Chapter 06, not during planning.",
    art: `${heading("Shape the upgrade plan", "Review the options. Make the next action clear.", { size: 49 })}
      <rect x="35" y="177" width="1030" height="606" fill="${p.a}" opacity=".13"/>
      <path d="M35 783V177H1065V783Z" fill="none" stroke="${p.line}" stroke-width="1"/>
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
      ${text(75, 749, "STAGE", { size: 19, weight: 700, fill: p.muted, font: "Verdana, sans-serif", spacing: 1 })}
      <path d="M173 725v34" stroke="${p.line}" stroke-width="2"/>
      ${text(199, 751, "Review before execution", { size: 27, font: "Verdana, Tahoma, sans-serif" })}
      <g fill="${p.accent}" opacity=".65"><rect x="974" y="733" width="8" height="18"/><rect x="989" y="727" width="8" height="24"/><rect x="1004" y="721" width="8" height="30"/></g>`
  };
}

function architecture(p, { text, path, heading }) {
  return {
    title: "Follow one request",
    description: "The browser sends a request to BooksController. The controller uses its injected ApplicationDbContext for data access to BookCatalogModernizedLab, and data returns to the context. The controller selects a Razor view. The view renders HTML back to the browser; the view does not query the database directly. Solid arrows show requests or data access, and dashed arrows show the response or returned data.",
    art: `${heading("Follow one request", "The controller coordinates the page and its data.", { size: 53 })}
      <ellipse cx="572" cy="731" rx="229" ry="22" fill="${p.ink}" opacity=".08"/>
      <ellipse cx="952" cy="629" rx="117" ry="17" fill="${p.ink}" opacity=".09"/>
      <rect x="376" y="235" width="423" height="481" rx="8" fill="${p.soft}" stroke="${p.line}" stroke-width="2"/>
      ${text(588, 209, "Application", { size: 28, weight: 700, anchor: "middle" })}
      <g transform="translate(46 305)">
        <rect width="247" height="231" rx="6" fill="${p.surface}" stroke="${p.accent}" stroke-width="2"/>
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
        <path d="M0 34V166C0 210 182 210 182 166V34" fill="${p.a}" stroke="${p.accent}" stroke-width="3"/>
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

function azure(p, { text, path, heading, key }) {
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
        <rect x="379" y="312" width="266" height="198" rx="9" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
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
        <rect x="-65" y="-58" width="109" height="145" rx="12" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
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
        <path d="M0 25V102C0 141 168 141 168 102V25" fill="${p.surface}" stroke="${p.line}" stroke-width="2"/>
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
