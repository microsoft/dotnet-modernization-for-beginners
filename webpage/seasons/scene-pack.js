import classic from "./classic/season.js";

// Keep decade-specific type and controls; each pack supplies its own scenes and colors.
export function sceneEras(pack, scenes) {
  return Object.fromEntries(Object.entries(scenes).map(([id, [scene, label, colors, artId = id]]) => {
    const { heading, interface: interfaceFont, radius, control } = classic.eras[id];
    return [id, {
      label, scene, heading, interface: interfaceFont, radius, control, ...colors,
      art: `${pack}-${artId}-light.webp`, artDark: `${pack}-${artId}-dark.webp`
    }];
  }));
}
