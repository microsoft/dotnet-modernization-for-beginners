import { getEra as eraFor } from "../../scripts/eras.js";
import halloween from "./season.js";

const getEra = id => eraFor(id, halloween);

export function halloweenMotifs(p) {
  const pumpkin = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-3-35q-5-18 10-25" fill="none" stroke="${p.a}" stroke-width="7" stroke-linecap="round"/>
    <path d="M0-34c-70-24-78 74-22 76q22 7 44 0C78 40 70-58 0-34Z" fill="${p.b}"/>
    <path d="M-13-31q-35 40-8 70M10-31q31 42 10 70M0-31v69" fill="none" stroke="${p.c}" stroke-width="2" opacity=".7"/>
    <path d="m-29-2 10-12 6 12m24 0 7-12 10 12M-18 14q18 17 36 0l-8 14H-9Z" fill="${p.ink}"/>
  </g>`;
  const ghost = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-38 43q-3-27 0-56C-35-64 33-67 38-15q0 39 18 53-21 3-29-7-10 24-29 13-18 19-36-1Z" fill="#f3ecda"/>
    <path d="M-25-22q-8 29 0 43M28 3q3 16 10 25" fill="none" stroke="${p.a}" stroke-width="2" opacity=".6"/>
    <ellipse cx="-10" cy="-10" rx="3" ry="5" fill="#263b34"/><ellipse cx="12" cy="-12" rx="3" ry="5" fill="#263b34"/>
    <path d="M-3 7q6 6 12-2" fill="none" stroke="#263b34" stroke-width="2" stroke-linecap="round"/>
  </g>`;
  const star = (x, y, scale = 1) => `<path transform="translate(${x} ${y}) scale(${scale})" d="M0-14 4-4 14 0 4 4 0 14-4 4-14 0-4-4Z" fill="${p.c}"/>`;
  const moon = (x, y, r = 48) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${p.c}"/><circle cx="${x + r * .48}" cy="${y - r * .24}" r="${r * .82}" fill="${p.paper}"/>`;
  const bat = (x, y, scale = 1) => `<path transform="translate(${x} ${y}) scale(${scale})" d="M0 0-5-9-9-3Q-29-24-52-14q15 5 11 22 14-11 21 5Q-7 5 0 14 7 5 20 13q7-16 21-5-4-17 11-22Q29-24 9-3L5-9Z" fill="${p.accent}"/>`;
  const book = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-90-50Q-45-66 0-40q45-26 90-10V65Q45 49 0 76-45 49-90 65Z" fill="${p.surface}" stroke="${p.accent}" stroke-width="5"/>
    <path d="M0-40V76M-70-24l48 6m-48 16 48 6m-48 16 48 6M22-18l48-6M22 4l48-6M22 26l48-6" fill="none" stroke="${p.line}" stroke-width="3"/>
    ${star(48, 42, .6)}
  </g>`;
  return { pumpkin, ghost, star, moon, bat, book };
}

export function renderHalloweenHeader(id, mode) {
  if (!["light", "dark"].includes(mode)) throw new Error(`Unknown illustration theme: ${mode}`);
  const era = getEra(id);
  const p = era[mode];
  const night = {
    "pumpkin-patch": "#173b32", "haunted-library": "#283e31", "trick-or-treat": "#492e42",
    "ghost-bureau": "#243f4b", spellbook: "#382e4b", "monster-lab": "#293e32",
    "moonlit-sky": "#263753", "pumpkin-shed": "#413a2a", "raven-lookout": "#293d4a",
    "ghost-scrapbook": "#483333", "enchanted-garden": "#204638", "clockwork-observatory": "#293d37"
  }[era.scene];
  const art = { ...p, ink: night, surface: "#f3ecda" };
  const { pumpkin, ghost, star, bat, book } = halloweenMotifs(art);
  const line = (d, color = p.c, width = 2, opacity = 1) =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const moon = (x, y, radius = 45) =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="${p.c}"/>${line(`M${x - radius * .7} ${y + 5}q${radius * .7} ${-radius * .9} ${radius * 1.4} 0`, night, 1, .18)}`;
  const stars = (points) => points.map(([x, y, size = .4]) => star(x, y, size)).join("");
  const sprig = (x, y, scale = 1, flip = 1, color = p.a) => `<g transform="translate(${x} ${y}) scale(${scale * flip} ${scale})">
    ${line("M0 0Q-5-65 17-129", color, 2)}
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${i * 2} ${-16 - i * 22}q-38-8-27-25 21 1 27 25m${i * 2 + 2} ${-11 - i * 22}q34-9 29-28-24 4-29 28" fill="${color}"/>`).join("")}
  </g>`;
  const tree = (x, y, scale = 1, flip = 1) => `<g transform="translate(${x} ${y}) scale(${scale * flip} ${scale})">
    <path d="M-14 0 0-271 12-3Z" fill="${night}"/>
    ${line("M0-40q-18-89-75-109m72 57q40-75 91-87M-5-182q-28-48-61-53M2-217q28-47 55-55M-40-133l-6-59M41-140l5-68M-28-218l-8-55", night, 8)}
    ${line("M-1-12 5-117", p.a, 1.5, .65)}
  </g>`;
  const lantern = (x, y, size = 1) => `<g transform="translate(${x} ${y}) scale(${size})">
    ${line("M0-50v-24", p.c, 2)}<path d="m-19-30 5-14h28l5 14v49h-38Z" fill="${night}" stroke="${p.c}" stroke-width="2"/>
    <path d="M-12-27h24V12h-24Z" fill="${p.c}"/>${line("M0-27v39", night, 3)}
    <path d="m-23 20 5-8h36l5 8Z" fill="${p.c}"/>
  </g>`;
  const shelf = (y, start, count) => `<g>${Array.from({ length: count }, (_, i) => {
    const x = start + i * 31;
    const h = 54 + (i * 19 % 47);
    const color = [p.a, p.b, p.c][i % 3];
    return `<rect x="${x}" y="${y - h}" width="23" height="${h}" rx="1" fill="${color}"/>
      ${line(`M${x + 5} ${y - h + 8}v${h - 16}m-2-8h17m-17-5h17`, night, 1.5, .7)}`;
  }).join("")}<path d="M${start - 10} ${y + 4}h${count * 31 + 8}" stroke="${p.c}" stroke-width="4"/></g>`;
  const window = (x, y, w, h) => `<path d="M${x} ${y + h}v-${h - w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${h - w / 2}Z" fill="${p.c}"/>
    ${line(`M${x + w / 2} ${y}v${h}M${x} ${y + h * .5}h${w}`, night, 5)}`;
  const scenes = {
    "clockwork-observatory": () => `
      ${moon(487, 150, 67)}${stars([[180, 112], [284, 78], [575, 262], [135, 312]])}
      <path d="M117 490V292a243 216 0 0 1 486 0v198Z" fill="${p.a}" opacity=".3"/>
      ${line("M117 490V292a243 216 0 0 1 486 0v198M360 75v422M117 292h486M173 162q120 159 0 328M547 162q-120 159 0 328", p.c, 2)}
      <ellipse cx="360" cy="356" rx="181" ry="76" fill="none" stroke="${p.c}" stroke-width="3" transform="rotate(-20 360 356)"/>
      <ellipse cx="360" cy="356" rx="181" ry="76" fill="none" stroke="${p.a}" stroke-width="3" transform="rotate(32 360 356)"/>
      ${ghost(361, 272, .7)}${book(360, 420, .8)}
      <path d="M144 514h432l25 27H119Z" fill="${p.b}"/>
      <rect x="157" y="541" width="406" height="65" rx="17" fill="${night}" stroke="${p.c}" stroke-width="2"/>
      ${[218, 312, 406, 500].map((x, i) => `<circle cx="${x}" cy="573" r="18" fill="${p.a}" stroke="${p.c}" stroke-width="2"/>
        ${line(`M${x} 563v20m-10-10h20`, p.c, 2)}${i < 3 ? line(`M${x + 21} 573h49`, p.c, 2) : ""}`).join("")}
      ${pumpkin(129, 532, .65)}${sprig(609, 618, 1.05, -1)}`,
    "pumpkin-patch": () => `${moon(449, 139, 61)}
      ${stars([[193, 123], [286, 72], [529, 233], [359, 176, .6], [99, 222]])}
      <path d="M0 365Q153 245 339 340T720 311V640H0Z" fill="${p.a}" opacity=".5"/>
      <path d="M0 428Q190 327 377 407T720 362V640H0Z" fill="${p.a}"/>
      <path d="M0 531Q174 431 371 474T720 477V640H0Z" fill="${night}"/>
      <path d="M370 370q-131 49-8 102t-57 168h150q135-129-32-180t-53-90" fill="${p.c}"/>
      ${line("M376 385q-73 38 19 74t-29 155", night, 2, .5)}
      ${tree(64, 490, 1.18)}${tree(662, 487, 1.45, -1)}
      ${bat(247, 185, .48)}${ghost(360, 290, .76)}
      ${pumpkin(190, 462, 1.16)}${pumpkin(121, 527, .75)}${pumpkin(535, 523, 1.45)}${pumpkin(567, 424, .57)}
      ${sprig(71, 631, 1.3)}${sprig(633, 640, 1.2, -1)}${sprig(240, 620, .57)}
      ${line("M107 582q48-14 93-3m278-16q69-16 132 3M155 385q43-13 85-7", p.a, 2)}
      ${lantern(459, 393, .58)}`,
    "haunted-library": () => `
      <path d="M100 565V234a260 260 0 0 1 520 0v331Z" fill="${p.a}" opacity=".28"/>
      ${line("M120 568V235a240 240 0 0 1 480 0v333M360 15v552", p.c, 2, .8)}
      ${shelf(253, 145, 6)}${shelf(253, 390, 6)}${shelf(391, 145, 6)}${shelf(391, 390, 6)}
      ${line("M127 265h465M127 402h465", p.a, 9)}
      <path d="M155 555h410l-25 85H180Z" fill="${p.b}"/>
      ${book(360, 493, 1.5)}${ghost(367, 321, .69)}
      ${lantern(361, 137, .9)}${sprig(89, 606, 1.2)}${sprig(622, 612, 1.3, -1)}
      ${line("M168 579h382m-358 16h329m-300 16h269", p.c, 1, .55)}`,
    "trick-or-treat": () => `
      <path d="m84 260 276-198 276 198" fill="${p.a}"/>
      <path d="M110 264h500v376H110Z" fill="${p.a}" opacity=".5"/>
      ${line("M141 282h438m-438 34h438m-438 34h438m-438 34h438m-438 34h438m-438 34h438m-438 34h438", p.a, 1, .7)}
      <path d="M257 558V326a103 103 0 0 1 206 0v232Z" fill="${night}"/>
      ${window(295, 260, 130, 155)}${line("M280 541h160", p.c, 2)}
      <circle cx="440" cy="460" r="4" fill="${p.c}"/>
      ${lantern(193, 356, .85)}${lantern(529, 356, .85)}
      ${line("M95 257q265 132 530 0", p.c, 1.5)}
      ${[132, 205, 279, 353, 427, 501, 576].map((x, i) => `<circle cx="${x}" cy="${278 + Math.sin(i / 6 * Math.PI) * 45}" r="5" fill="${p.c}"/>`).join("")}
      <path d="M220 559h281v25H220Zm-33 26h347v24H187Zm-36 25h419v30H151Z" fill="${p.b}"/>
      ${ghost(363, 477, .6)}${pumpkin(158, 544, .83)}${pumpkin(557, 574, .9)}
      ${sprig(56, 640, 1.6)}${sprig(660, 640, 1.7, -1)}`,
    "ghost-bureau": () => `
      ${window(379, 85, 183, 276)}${line("M400 133h140m-140 39h140m-140 39h140m-140 39h140m-140 39h140", night, 3)}
      <path d="M76 462h569v19H76Zm29 19h14v159h-14Zm493 0h14v159h-14Z" fill="${p.b}"/>
      <g transform="rotate(-9 287 347)">
        <path d="M148 205h236l25 30v215H148Z" fill="${p.c}"/>
        <rect x="169" y="227" width="217" height="202" fill="${art.surface}"/>
        ${line("M194 250h93m-93 15h68m-68 122h161m-161 14h118", p.a, 3)}
        ${ghost(276, 330, .65)}
      </g>
      <circle cx="420" cy="376" r="65" fill="${p.a}" fill-opacity=".2" stroke="${p.c}" stroke-width="8"/>
      ${line("m466 423 63 65", p.c, 16)}${line("M385 346q20-27 50-12", art.surface, 2, .7)}
      <path d="M114 194h83l-26-49h-31Z" fill="${p.a}"/>
      ${line("M154 192v234m-27 4h55", p.c, 4)}
      ${line("M549 477q-7 52-83 58m-3 0h-38", p.a, 2)}
      ${sprig(84, 637, 1.15)}`,
    spellbook: () => `
      <circle cx="360" cy="295" r="211" fill="none" stroke="${p.a}" stroke-width="1"/>
      <circle cx="360" cy="295" r="188" fill="none" stroke="${p.c}" stroke-width="1"/>
      ${line("M360 68v46m0 363v46M131 295h46m366 0h46M199 134l32 32m258 258 32 32m0-322-32 32M231 424l-32 32", p.c, 2)}
      ${stars([[206, 222, .7], [492, 231, .6], [359, 154, 1], [531, 382], [183, 388]])}
      <path d="M273 292q56-77 70-127 29 73 96 126Z" fill="${p.a}"/>
      <path d="M241 300q104-61 226 0-98 32-226 0" fill="${p.b}"/>
      ${book(360, 435, 1.95)}
      ${star(286, 433, 1.1)}${line("M405 405h75m-75 18h59m-59 18h69", p.a, 2)}
      ${sprig(90, 621, 1.3)}${sprig(628, 621, 1.3, -1)}
      ${moon(359, 62, 15)}`,
    "monster-lab": () => `
      ${line("M86 206h543M124 207v-70h105v70m59 0V99h99v108m72 0v-55h123v55", p.a, 6)}
      ${line("M97 225h526M96 500h529M113 500v140m495-140v140", p.c, 5)}
      <path d="M154 321v-61h47v61l60 132q12 32-22 32h-125q-35 0-21-32Z" fill="${p.a}" fill-opacity=".4" stroke="${p.c}" stroke-width="3"/>
      <path d="m130 390-27 65q-7 20 15 20h117q22 0 14-20l-28-65Z" fill="${p.a}"/>
      ${line("M122 420h108m-113 19h119m-123 19h131", night, 1.5, .5)}
      <rect x="344" y="277" width="177" height="206" rx="58" fill="${p.a}"/>
      <path d="M344 333v-59l27 15 22-24 28 22 29-22 28 22 43-16v62Z" fill="${p.b}"/>
      ${line("M326 368h18m177 0h20", p.c, 12)}
      <ellipse cx="402" cy="365" rx="6" ry="9" fill="${night}"/><ellipse cx="461" cy="365" rx="6" ry="9" fill="${night}"/>
      ${line("M406 416q28 27 52-3m-35 15v10m15-11v9M368 308h126", night, 3)}
      ${[0, 1, 2, 3].map(i => `<circle cx="${165 + i * 13}" cy="${240 - i * 30}" r="${8 - i}" fill="none" stroke="${p.c}" stroke-width="2"/>`).join("")}
      ${sprig(63, 628, 1.1)}${sprig(652, 630, 1.5, -1)}`,
    "moonlit-sky": () => `${moon(402, 242, 135)}
      <circle cx="454" cy="199" r="123" fill="${night}"/>
      ${stars([[129, 185], [228, 105, .65], [544, 98], [597, 283], [190, 341, .55], [330, 421], [506, 391]])}
      ${bat(221, 253, .65)}${bat(528, 353, .4)}
      <path d="M0 486q74-91 161-26 100-93 189-24 100-106 196-24 105-59 174 9v219H0Z" fill="${p.a}" opacity=".48"/>
      <path d="M0 540q97-94 197-13 103-102 212-40 134-72 311 27v126H0Z" fill="${p.a}"/>
      ${line("M46 541q74-57 126-11m290-21q112-46 188 8M266 487q50-26 92-8", p.c, 1.5, .5)}
      ${tree(68, 640, .9)}${tree(653, 640, .75, -1)}${ghost(362, 550, .49)}`,
    "pumpkin-shed": () => `
      <path d="M106 263 360 84l254 179Z" fill="${p.b}"/><path d="M130 263h460v321H130Z" fill="${p.a}" opacity=".4"/>
      ${line("M160 267v310m43-310v310m43-310v310m43-310v310m43-310v310m43-310v310m43-310v310m43-310v310m43-310v310m43-310v310", p.a, 2)}
      ${line("M143 423h435M143 550h435", p.c, 8)}
      ${pumpkin(231, 381, .9)}${pumpkin(484, 510, .85)}${pumpkin(216, 514, .6)}
      ${line("M416 304v90m-15-90h30m-29 92h29m57-92v90m-12-90h24", p.c, 6)}
      ${lantern(361, 224, .75)}${sprig(74, 630, 1.15)}${sprig(639, 630, 1.15, -1)}`,
    "raven-lookout": () => `${moon(438, 212, 102)}
      <path d="M0 530 209 285l107 114 103-62 301 238v65H0Z" fill="${p.a}" opacity=".55"/>
      <path d="m0 610 230-157 183 81 154-99 153 181v24H0Z" fill="${p.a}"/>
      ${tree(102, 640, 1.8)}
      ${line("M141 414q145-8 293 40", night, 13)}
      <path d="M282 406q-50-97 11-143 33-27 61 11l49 18-42 16q-6 61-51 83l-43 70Z" fill="${night}"/>
      <circle cx="342" cy="282" r="4" fill="${p.c}"/>
      ${line("M301 307q-31 30-10 64m20-50q-19 28-9 41M304 392l-9 31m24-34-4 38", p.a, 2)}
      ${stars([[168, 173], [295, 103], [574, 312], [544, 93]])}`,
    "ghost-scrapbook": () => `
      <path d="M139 118h423v421H139Z" fill="${p.b}" transform="rotate(7 350 330)"/>
      <path d="M121 112h426v422H121Z" fill="${p.c}"/>
      ${line("M143 127v390", night, 2)}
      ${Array.from({ length: 13 }, (_, i) => `<path d="M133 ${140 + i * 28}h20" stroke="${night}" stroke-width="4"/>`).join("")}
      <g transform="rotate(-7 365 320)"><rect x="201" y="171" width="284" height="290" fill="${art.surface}"/>
      <rect x="219" y="188" width="248" height="220" fill="${p.a}"/>
      ${moon(408, 236, 30)}${tree(247, 408, .55)}${ghost(348, 312, .9)}
      ${line("M242 431h182m-149 12h120", p.b, 2)}</g>
      ${sprig(575, 602, 1.3, -1)}${pumpkin(146, 551, .8)}`,
    "enchanted-garden": () => `
      <path d="M126 566V252a234 234 0 0 1 468 0v314Z" fill="${p.a}" opacity=".25"/>
      ${line("M126 566V252a234 234 0 0 1 468 0v314M360 18v550M126 252h468M160 130q95 169 0 436M560 130q-95 169 0 436M126 407h468", p.c, 2)}
      ${sprig(173, 572, 2)}${sprig(547, 572, 2, -1)}${sprig(250, 570, .9, -1)}
      <path d="M143 559h88l-14 61h-59Zm345 0h88l-15 61h-58Z" fill="${p.b}"/>
      ${book(360, 481, 1.15)}${ghost(367, 325, .7)}
      ${stars([[295, 205, .7], [438, 175], [467, 382]])}${pumpkin(476, 587, .6)}`
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="640" viewBox="0 0 720 640" role="img" aria-labelledby="title" data-scene="${era.scene}" data-theme="${mode}">
    <title id="title">${era.label}</title>
    <defs>
      <clipPath id="scene"><path d="M24 616V287a336 263 0 0 1 672 0v329Z"/></clipPath>
      <pattern id="engraving" width="9" height="9" patternUnits="userSpaceOnUse"><path d="m0 9 9-9" stroke="${p.c}" stroke-width=".6" opacity=".11"/></pattern>
    </defs>
    <g clip-path="url(#scene)">
      <path d="M0 0h720v640H0Z" fill="${night}"/>
      ${scenes[era.scene]().trim()}
      <path d="M0 0h720v640H0Z" fill="url(#engraving)"/>
    </g>
    <path d="M35 605V287a325 252 0 0 1 650 0v318Z" fill="none" stroke="${p.c}" stroke-width="1" opacity=".6"/>
    <path d="M335 626h50m-25-5v10" stroke="${p.accent}" stroke-width="1"/>
  </svg>`;
}

export async function renderSeasonArt() {
  const { illustrations } = await import("../../scripts/illustrations.js");
  const { renderIllustration } = await import("./illustration-art.mjs");
  const outputs = illustrations.flatMap(item => ["light", "dark"].map(mode =>
    [`webpage/seasons/halloween/illustrations/${item.id}-${mode}.svg`, renderIllustration(item.id, mode)]));
  for (const [id, era] of Object.entries(halloween.eras)) {
    for (const [mode, file] of [["light", era.art], ["dark", era.artDark]]) {
      outputs.push([`webpage/seasons/halloween/assets/${file}`, renderHalloweenHeader(id, mode)]);
    }
  }
  return outputs;
}
