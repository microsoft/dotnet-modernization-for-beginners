import { renderIllustration as renderBase } from "../../tools/illustration-art.mjs";
import { lessonMargin } from "../lesson-margin.mjs";
import season from "./season.js";

const props = {
  journey: `<g stroke="#594955" stroke-width="2.5">
    <path d="M-39-5q2 28 30 32v5h-10v5h39v-5H9v-5Q36 21 41-5Z" fill="#9ad7cf"/>
    <ellipse cy="-5" rx="40" ry="9" fill="#d55c72"/><path d="m-25-3 6 13 6-12m5 1L0 19 9 0m3 1 5 10 5-13" fill="none" stroke="#f4d5d3"/>
    <circle cx="19" cy="-7" r="7" fill="#ffc65d"/><path d="m-16-9-13-25h-12" fill="none" stroke="#47878c" stroke-width="5"/></g>`,
  workflow: `<g transform="rotate(-8)" stroke="#4c3956" stroke-width="2.5">
    <rect x="-45" y="-25" width="90" height="55" rx="5" fill="#ed9563"/><ellipse cx="-5" cy="1" rx="28" ry="18" fill="#342842"/>
    <ellipse cx="-5" cy="1" rx="10" ry="6" fill="#f3cb62"/><path d="M34-14v11L14 10" fill="none" stroke="#f3eedb" stroke-width="4"/>
    </g><g transform="translate(-34 -23)" fill="#fff2ce">${[0,72,144,216,288].map(r =>
      `<ellipse cy="-10" rx="5" ry="8" transform="rotate(${r})"/>`).join("")}<circle r="5" fill="#df9944"/></g>`,
  soundcheck: `<path d="M0-48v17" stroke="#6b748c" stroke-width="4"/>
    <circle r="32" fill="#aacbd4" stroke="#566f87" stroke-width="3"/>
    <g fill="none" stroke="#6588a2" stroke-width="2"><ellipse rx="17" ry="31"/><path d="M0-31v62M-31-4q32 9 62 0M-26-18q26 8 52 0M-26 16q27 10 51 0"/></g>
    <path d="m-16-29 3 8 8 3-8 4-3 8-4-8-8-4 8-3Zm60 11 2 6 6 2-6 3-2 7-3-7-6-3 6-2Z" fill="#fff1d2"/>`,
  investigation: `<g transform="rotate(-6)" stroke="#433149" stroke-width="3">
    <path d="M-27-13v-11h55v11" fill="none"/><rect x="-49" y="-15" width="98" height="51" rx="5" fill="#ec6eaa"/>
    <path d="m11-22 33-19" fill="none"/><path d="M-38-6h36" stroke="#ffdfa1"/>
    <g fill="#4a405c"><circle cx="-30" cy="14" r="13"/><circle cx="31" cy="14" r="13"/></g>
    <g fill="#62bfc6"><circle cx="-30" cy="14" r="6"/><circle cx="31" cy="14" r="6"/><rect x="-12" y="6" width="25" height="17" rx="2"/></g>
    <path d="M-6 17H7" stroke-width="2"/></g>`,
  plan: `<g transform="rotate(8)" stroke="#43553a" stroke-width="2.5">
    <path d="M-8 4q-5 5-7 18l-12-5-4 5 17 10q5 1 9-6h10q4 5 10 8l19-9-3-6-14 3-7-17Z" fill="#b5d854"/>
    <path d="M0-38c-30-5-40 20-26 35 9 9 20 17 27 16 8-1 24-16 29-29 5-13-7-22-30-22Z" fill="#bee75f"/>
    <path d="M-20-20q14 0 17 13-14-1-17-13Zm43-3Q9-22 5-9q14-3 18-14Z" fill="#463a54"/>
    <path d="M-4 2q6 4 11-2" fill="none"/></g>`,
  architecture: `<g fill="none" stroke="#bc75a7" stroke-width="3"><path d="M-49-33Q0-8 47-37M-24-24v13m34-15v23"/></g>
    ${[[-24,4],[12,16]].map(([x,y]) => `<g transform="translate(${x} ${y})">
    <circle r="19" fill="#badde3" stroke="#52617b" stroke-width="2.5"/>
    <path d="M-17 1-3-4l-3-14m12 35L3 5l15-3" fill="none" stroke="#e99ec3" stroke-width="4"/>
    <circle r="4" fill="#6c6280"/></g>`).join("")}`,
  azure: `<g transform="rotate(10)"><path d="M-23 0v41m48-36v34" fill="none" stroke="#ac8b5d" stroke-width="4"/>
    <path d="M-50-12q10 9 17-2 7-9 13-2 9-8 15 0 6 10 14 2-7 22-29 10-19 10-30-8Z" fill="#3b3046"/>
    <path d="M6 4q10-2 15-10 4-4 9 0 5-6 11-1 5 6 13 7-18 25-48 4Z" fill="#e26493" stroke="#94456b" stroke-width="2"/>
    <path d="M13 4q16 5 33-2" fill="none" stroke="#9e446b" stroke-width="2"/></g>`
};

function streamers(p) {
  return Array.from({ length: 10 }, (_, i) => `<g transform="translate(${i*110})">
    <path d="M10-2q18 5 5 12t5 13" fill="none" stroke="${i%2 ? p.b : p.a}" stroke-width="4"/>
    <path d="m36 8 7-4 3 4-8 5Zm42-4 7 4-3 5-7-4Z" fill="${p.b}"/>
    <circle cx="59" cy="15" r="3" fill="${p.c}"/></g>`).join("");
}

export const renderIllustration = (id, mode) =>
  renderBase(id, mode, season, (key, p) => lessonMargin(key, props[key], streamers(p)));
