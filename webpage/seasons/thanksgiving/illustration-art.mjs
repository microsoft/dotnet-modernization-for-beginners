import { renderIllustration as renderBase } from "../../tools/illustration-art.mjs";
import { lessonMargin } from "../lesson-margin.mjs";
import season from "./season.js";

const wheel = x => `<circle cx="${x}" cy="30" r="9" fill="#573e32"/><circle cx="${x}" cy="30" r="4" fill="#f3c27b"/>`;
const wagon = `<path d="M-52 15h97l-4 12h-88Zm95 2 17-11" fill="#b24733" stroke="#674431" stroke-width="3"/>${wheel(-32)}${wheel(28)}`;
const pie = `<path d="M-40 1q8-30 41-30T42 1Z" fill="#ab4730" stroke="#7e4c2b" stroke-width="3"/>
  <path d="m-31-9 13 10m-1-21L13 1M-1-27l31 23m-59 5 27-27M-8 1l27-23M15 1l16-15" fill="none" stroke="#eeb762" stroke-width="5"/>
  <path d="M-44 0H44l-9 14h-69Z" fill="#e1ae6d" stroke="#83512c" stroke-width="3"/>`;
const pumpkin = `<path d="m-3-15 2-10 6-2-2 14" fill="#546746"/><g stroke="#97512b" stroke-width="2">
  <ellipse rx="23" ry="17" fill="#e88e38"/><ellipse rx="12" ry="18" fill="#efa24b"/></g>`;
const berry = (x, y) => `<g transform="translate(${x} ${y})"><circle r="11" fill="#ae4253" stroke="#783844" stroke-width="2"/>
  <path d="m-7-5 3-2" stroke="#f3a5a1" stroke-width="2"/><g fill="#fff3dc"><ellipse cx="-1" cy="-2" rx="2.5" ry="3.5"/><ellipse cx="5" cy="-3" rx="2.5" ry="3.5"/></g>
  <path d="M0-3v1m6-2v1M-2 4q4 5 8-1" fill="none" stroke="#4d2934" stroke-width="1.8"/></g>`;
const floats = {
  journey: `<g stroke="#71432c" stroke-width="3">
    <path d="m-30-32 58 7-39 38Z" fill="#ea9845"/><path d="M-31-32q0-9 12-4 9-5 15 1 9-5 18 2 14-1 16 8l-1 3Z" fill="#efb967"/>
    <path d="M-7-17v3m10-2q3-3 6 0m-16 7q4 6 11 0" fill="none"/></g>${wagon}`,
  workflow: pie + wagon,
  soundcheck: `<g transform="translate(-22 0)">${pumpkin}</g><g transform="translate(22 3) scale(.8)">${pumpkin}</g>${wagon}`,
  investigation: `<path d="M-22 12q-19 20-10 39m43-41q17 19 10 38" fill="none" stroke="#9e7956" stroke-width="2"/>
    <g stroke="#8f492f" stroke-width="2.5">${[-65,-34,0,34,65].map((r, i) =>
      `<ellipse cy="-19" rx="13" ry="31" transform="rotate(${r})" fill="${["#b74836","#e9a443","#b75432","#e9a443","#b74836"][i]}"/>`).join("")}</g>
    <ellipse cy="10" rx="26" ry="22" fill="#945a3c" stroke="#663d32" stroke-width="3"/>
    <path d="M4 13q13-10 8-24t6-11q8-3 15 3" fill="none" stroke="#a86340" stroke-width="14"/>
    <path d="m28-27 13 6-13 3Z" fill="#f4b946"/><path d="M28-17q7 13-1 16" fill="none" stroke="#c9493f" stroke-width="5"/>
    <circle cx="25" cy="-27" r="2" fill="#392f2a"/><path d="M-18 7q8 20 24 6" fill="none" stroke="#c38b5d" stroke-width="3"/>`,
  plan: `<path d="m-12 5 58-43q7-4 11 2t-1 9L5 16" fill="#ac8355" stroke="#725841" stroke-width="3"/>
    <path d="M-58-4q39-8 78 12-15 39-66 17Z" fill="#93a5a0" stroke="#526963" stroke-width="3"/>
    ${berry(-38,-4)}${berry(-20,-14)}${berry(-2,-5)}${berry(-18,1)}
    <path d="M-57 0q34 12 74 9-27 32-64 16Z" fill="#c4c6a9" stroke="#637365" stroke-width="2"/>`,
  architecture: `<path d="M-33 10q-8-16 7-25 9-6 10-19 0-19 16-16t14 21q-2 7 11 13 19 10 14 26Z" fill="#f0bd5a" stroke="#93682e" stroke-width="3"/>
    <path d="m-3-49 4-9 7 1-4 9Z" fill="#637340"/><g fill="#493e32"><circle cx="-9" cy="-8" r="3"/><circle cx="9" cy="-8" r="3"/></g>
    <path d="M-6-1q6 8 13 0" fill="none" stroke="#75472d" stroke-width="3"/><path d="M-46 9h94l-12 17h-68Z" fill="#bec3af" stroke="#586862" stroke-width="3"/>`,
  azure: `<g stroke="#50303a" stroke-width="2.5">
    <path d="M-48-20 1-38l15 48-57 2Z" fill="#ea9845"/><path d="m-48-20 9 32h7l-6-35Z" fill="#d7a35c"/>
    <path d="M-30-29q-8-7 4-13-3-7 7-10 7-3 7-7 14 9 5 15 13 3 6 11Z" fill="#fff2cd"/>
    <ellipse cx="0" cy="-17" rx="4" ry="6" fill="#fff3dc"/><circle cx="2" cy="-17" r="1.7" fill="#50303a"/>
    <path d="M-12-5Q0 1 8-6 2 9-8 1Z" fill="#612f3b"/>
    <path d="M18 10q-2-9 4-14 3-2 2-8l13 1q-3 6-1 13l9 5" fill="#b86a43"/>
    <path d="M21-13q0-17 11-15 9 1 9 12l-12-1-2 6Z" fill="#55a6a0"/>
    <path d="m35-13 9 4-9 2" fill="#efb44b"/><path d="m-53 10 69 1q12 4 25-2 12-5 19 5l-4 9H-49Z" fill="#4a9d92"/>
    </g>${wheel(-32)}${wheel(37)}
    <path d="m-3 13-4 5h4l-1 4 7-7h-5l2-2Z" fill="#fff0a0"/>`
};

function pennants(p) {
  return Array.from({ length: 11 }, (_, i) => `<g transform="translate(${100*i})">
    <path d="M0 3q50 14 100 0" fill="none" stroke="${p.muted}" stroke-width="2"/>
    <path d="m18 7 15 2-10 14Z" fill="${p.b}"/><path d="M62 9l15-2-5 16Z" fill="${i%2 ? p.a : p.c}"/></g>`).join("");
}

export const renderIllustration = (id, mode) =>
  renderBase(id, mode, season, (key, p) => lessonMargin(key, floats[key], pennants(p)));
