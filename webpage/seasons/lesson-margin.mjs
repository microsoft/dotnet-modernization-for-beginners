// Empty patches in the original lesson layouts. Keep scenery out of instructions and arrows.
const positions = {
  journey: [815, 85], workflow: [920, 85], soundcheck: [717, 133], investigation: [970, 95],
  plan: [967, 91], architecture: [970, 88], azure: [966, 93]
};

export function lessonMargin(id, ornament, trim) {
  const [x, y] = positions[id];
  return `${trim}<g transform="translate(${x} ${y})" stroke-linecap="round" stroke-linejoin="round">${ornament}</g>`;
}
