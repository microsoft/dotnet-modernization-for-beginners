import { renderIllustration as renderBase } from "../../tools/illustration-art.mjs";
import season from "./season.js";

// The lawn ornaments occupy empty space on each sheet, not a step or a connector.
const ornaments = {
  journey: `<g transform="translate(814 70) rotate(-8)">
    <path d="M-16 13v30m18-30 6 16-9 13" fill="none" stroke="#92583d" stroke-width="3"/>
    <path d="M-49-5q26 3 33-1c23 7 28-5 24-19-3-15 2-23 13-21 7 1 11 7 10 14l-10 1c1-5-3-6-4-3-3 8 8 22-1 35C0 24-28 24-49-5Z" fill="#ed8398" stroke="#723851" stroke-width="2.8"/>
    <path d="m25-39 16 6-12 9-6-7Z" fill="#273447"/><circle cx="23" cy="-41" r="2" fill="#273447"/>
    <path d="m7-16 14-1 3 6-6 2 7 16-7 3-9-18-4-1Z" fill="#127652"/>
  </g>`,
  workflow: `<g transform="translate(920 78)" stroke="#214838" stroke-width="3">
    <path d="M-72-7h70q20 13 0 29h-70Z" fill="#c94444"/><path d="M-54-7l19 28m0-28 19 28" stroke="#fff0d6" stroke-width="9"/>
    <path d="M-62-8v-19h-7v-8h24v8h-6v19m53 30v-49h40v49Z" fill="#388362"/>
    <path d="M10-20h19v16H10Z" fill="#ffdd9e"/><path d="M-77 24H46" stroke="#293b39" stroke-width="6"/>
    <g fill="#e9b65a"><circle cx="-52" cy="30" r="9"/><circle cx="-25" cy="30" r="9"/><circle cx="22" cy="30" r="9"/></g>
  </g>`,
  soundcheck: `<g transform="translate(718 132)" fill="none" stroke-linecap="round">
    <path d="M-65 27c-21-46 93-72 91-25-3 36-104 9-85-23 21-35 104 8 75 40-28 27-66-36-38-48 24-12 61 46 78 28l9-10" stroke="#497964" stroke-width="4"/>
    <g fill="#f3bd46" stroke="#704639" stroke-width="2"><ellipse cx="-46" cy="19" rx="6" ry="10"/><ellipse cx="22" cy="20" rx="6" ry="10"/></g>
    <g fill="#e55d60" stroke="#743e49" stroke-width="2"><ellipse cx="-17" cy="-24" rx="6" ry="10"/><ellipse cx="54" cy="4" rx="6" ry="10"/></g>
  </g>`,
  investigation: `<g transform="translate(973 103)">
    <path d="m-31 6-23-15m78 13 19-16" fill="none" stroke="#74513d" stroke-width="5" stroke-linecap="round"/>
    <ellipse cy="15" rx="34" ry="28" fill="#fff5d8" stroke="#487267" stroke-width="3"/>
    <circle cy="-20" r="24" fill="#fff9e6" stroke="#487267" stroke-width="3"/>
    <g transform="rotate(-8 0 -41)"><path d="M-17-40v-24h32v24Z" fill="#1e3c36"/><path d="M-17-46h32v6h-32Z" fill="#d64c4c"/><path d="M-24-39h47" stroke="#1e3c36" stroke-width="6" stroke-linecap="round"/></g>
    <path d="M-23-7q19 8 42-1l4 9-11 3 9 23-10 4L0 5q-14 1-24-5Z" fill="#ba3344"/>
    <path d="m-3-20-20 6 20 1Z" fill="#ef9445"/>
    <g fill="#243e36"><circle cx="-8" cy="-25" r="2.8"/><circle cx="5" cy="-24" r="2.8"/><circle cy="12" r="3"/><circle cy="25" r="3"/></g>
  </g>`,
  plan: `<g transform="translate(967 91)" fill="none" stroke-linejoin="round" stroke-linecap="round">
    <path d="m-49 14 8-20 47-3 10-19 20 1 10 10-18 6-13 22-5 25m-3-24-8 22m-25-23-9 24m-2-26 4 25M18-28l-8-20-10-4m13 12 4-12m9 24 6-22 8-6m-9 11-7-8" stroke="#547c99" stroke-width="4"/>
    <path d="M-52 8q18 14 40-2t35-31q15-26 14-12t22 32" stroke="#76a8c8" stroke-width="2.5"/>
    <g fill="#fffbe7" stroke="#6086a0" stroke-width="1.5"><circle cx="-41" cy="12" r="4"/><circle cx="-19" cy="10" r="4"/><circle cx="1" cy="-5" r="4"/><circle cx="19" cy="-22" r="4"/><circle cx="45" cy="-20" r="4"/></g>
  </g>`,
  architecture: `<g transform="translate(970 89)">
    <path d="M-24-16q-27 21-22 36 7 7 18-7m50-26q28 25 21 34-7 5-18-10" fill="#263e4d"/>
    <ellipse rx="32" ry="46" fill="#243b48"/><ellipse cy="12" rx="22" ry="30" fill="#fff8e4"/>
    <path d="m-9-11 11 7 10-8Z" fill="#f4ab48"/><g fill="#fff6da"><circle cx="-9" cy="-18" r="3"/><circle cx="9" cy="-18" r="3"/></g>
    <path d="M-28-28q4-30 27-28 23 1 29 28Z" fill="#337c59"/><path d="M-28-31h56v8h-56Z" fill="#cb4656"/><circle cy="-57" r="7" fill="#fff1cd"/>
    <path d="M-28-5q27 10 56-2v9l-12 3 6 15-9 4-8-17q-18 2-33-4Z" fill="#c73b4c"/>
    <g fill="#efa14b"><ellipse cx="-15" cy="44" rx="13" ry="5"/><ellipse cx="15" cy="44" rx="13" ry="5"/></g>
  </g>`,
  azure: `<g transform="translate(966 98)" stroke-linejoin="round">
    <path d="M-73 8q21 15 31 1c15-23 32-19 47-15 10 1 8-13 9-31 0-13 7-22 22-19 18 2 24 16 14 23l-15 2 1 36q1 14-11 18v12H12V21H-8v15h-13l-1-15q-22 2-51-13Z" fill="#76ae77" stroke="#315f50" stroke-width="3"/>
    <circle cx="41" cy="-45" r="2.5" fill="#193c37"/><path d="M16-38q-8-30 18-29 17 1 17 18" fill="none" stroke="#c34a51" stroke-width="5"/>
    <ellipse cx="17" cy="-41" rx="8" ry="11" fill="#df6170"/><path d="m-16-9 13 6 12-9v17l-12-5-12 8Z" fill="#c9434f"/>
  </g>`
};

function lights(p) {
  const colors = [p.b, p.c, p.a];
  return Array.from({ length: 11 }, (_, i) => `<g transform="translate(${i * 100} 0)">
    <path d="M0 4Q50 25 100 4" fill="none" stroke="${p.muted}" stroke-width="2.5"/>
    <g transform="translate(50 14) rotate(${i % 2 ? -9 : 9})">
      <path d="M-5 3q-5 11 5 19 10-8 5-19Z" fill="${colors[i % 3]}" stroke="${p.muted}" stroke-width="1.6"/>
      <path d="M-4 0h8v5h-8Z" fill="${p.muted}"/><path d="M-2 8v5" stroke="#fff6d8" stroke-width="2" stroke-linecap="round"/>
    </g></g>`).join("");
}

export const renderIllustration = (id, mode) =>
  renderBase(id, mode, season, (key, p) => lights(p) + ornaments[key]);
