# Seasonal looks

This guide is for people who work on the course website. Course authors and learners don't need it.

A season changes how the website looks for a holiday or event. It doesn't change the course.
Chapter text, code samples, chapter slugs, era IDs, and saved learner progress stay the same in every season.

The **classic** season is the permanent default. Every other season is an optional pack that sits beside it.

## How it works

```text
webpage/seasons/
├── seasons.js        The switch: which season is active, and when
├── classic/          The default look
├── halloween/        Halloween
├── thanksgiving/     US Thanksgiving
├── christmas/        Secular winter holidays
└── new-year/         New Year's celebration
```

1. `seasons.js` runs first in the page head. It picks a season and loads that pack's stylesheet and favicon before the page draws.
2. `app.js` loads the pack's `season.js` for palettes, art, and decorative copy. Then it renders the chapter.
3. If a pack fails to load, the site falls back to classic.

The page records the choice on `<html data-season="...">`. Packs with named scenes also set `data-scene`.

## Turn a season on or off

Edit `seasonConfig` at the top of `seasons.js`:

```js
const seasonConfig = {
  active: "auto",
  fallback: "classic",
  packs: ["classic", "halloween", "thanksgiving", "christmas", "new-year"],
  calendar: [
    { season: "halloween", from: "10-01", to: "11-02" },
    { season: "thanksgiving", rule: "us-thanksgiving", daysBefore: 14 },
    { season: "christmas", from: "12-11", to: "12-25" },
    { season: "new-year", from: "12-26", to: "01-01" }
  ]
};
```

| Setting | What it does |
| --- | --- |
| `active: "auto"` | Follows the `calendar`. Outside every window, the site uses `fallback`. |
| `active: "<season-id>"` | Pins one season, whatever the date. |
| `active: "classic"` | Turns every season off. |
| `calendar` | Inclusive `MM-DD` windows in the visitor's local time. A window can cross the new year, such as `12-15` to `01-05`. |

With `auto`, each season starts and ends without a deployment. Halloween runs October 1 through November 2.
Thanksgiving starts 14 days before the fourth Thursday in November and ends on that Thursday.
Christmas runs December 11 through December 25. New Year runs December 26 through January 1.
Classic returns outside these local-date windows.

To roll back a season early, set `active: "classic"` and publish. Nothing else needs to change.

## Preview a season

Add `?season=<id>` before the `#` in any page URL:

```text
http://127.0.0.1:4173/?season=halloween#/overview
http://127.0.0.1:4173/?season=thanksgiving#/overview
http://127.0.0.1:4173/?season=christmas#/overview
http://127.0.0.1:4173/?season=new-year#/overview
http://127.0.0.1:4173/?season=classic#/04-cloud
```

The preview works for any ID in `packs`, whatever the calendar says. An unknown ID is ignored.
The preview lasts only for that URL. Remove the parameter to see the scheduled season again.

## What a pack contains

| File | Responsibility |
| --- | --- |
| `season.js` | Era palettes, fonts, header art names, hero art, and seasonal copy such as the footer |
| `season.css` | The complete stylesheet for the season |
| `assets/` | Chapter header art and `favicon.svg` |
| `art.mjs` | Optional generator for the pack's SVG art |
| `illustration-art.mjs` | Optional generator for seasonal lesson illustrations |
| `illustrations/` | Optional seasonal lesson illustrations in light and dark versions |

Each winter pack covers every chapter in light and dark modes.
The header always says “A self-paced course.” The decorative artwork on the start page and chapter headers has no captions.

**Pie Parade** starts with a plywood pie slice on a 1950s wagon. Each chapter moves the parade ahead ten years. A whole pie rides on whitewall tires in the 1960s. A tractor tows pumpkins in scarves on the 1970s setup page. The parade ends in the 2010s with a turkey driving an electric pumpkin pie. Cider and copper alternate with orchard green and cranberry. Pennants hang below the header and across each lesson diagram.

**Midnight Mixtape** starts at a 1950s sock hop. Each core chapter moves the party ahead ten years, including setup. Paper crowns give way to a mod record player, a disco ball, and a karaoke boombox. The 1990s guests bring an inflatable alien. The 2000s guests hang CDs, and the 2010s guests pose with paper moustaches. Each lesson diagram borrows one party prop. Nothing flashes.

The Christmas pack, **Tinsel Lane**, follows a neighborhood lights tour. The 1950s reference shows a hand-painted plywood snowman. The course starts at a ranch house with lawn flamingos. Later yards feature a peppermint train, blow-mold snowmen, wire reindeer, and an inflatable penguin. The last house has a dinosaur in earmuffs. The lights stay steady. Only the 2050s reference takes the tour into space.

Tinsel Lane uses cranberry and evergreen for the snowman yard and snow white and blue for the icicle-light yard. Each lesson diagram uses its chapter palette and lawn ornament. Edit the decorative layer in `christmas/illustration-art.mjs`. The labels, arrows, and text descriptions come from the shared lesson artwork.

## Change a season

Edit only that season's folder. The other seasons aren't affected.

| To change | Edit |
| --- | --- |
| Colors, fonts, or the light and dark palettes | `eras` in `season.js` |
| Sidebar text, footer, or section labels | `copy` in `season.js` |
| The start page art | `hero` in `season.js` |
| Layout, borders, shapes, and decoration | `season.css` |
| Chapter header art | `art.mjs`, or replace files in `assets/` |
| Lesson illustrations | `illustration-art.mjs` |
| An illustration's title or text description | `illustrationText` in `season.js` |

Then follow these steps:

1. If you changed generated art or palettes, run `npm run illustrations` from the repository root.
2. Run `npm run preview` and open the page with `?season=<id>`.
3. Run `npm test` and `npx playwright test`.

Each `season.css` is a complete stylesheet. A layout fix that applies to every season must go into each `season.css`.

## Add a season

1. Copy an existing folder, such as `halloween/`, to a new folder named for the season, such as `winter/`.
2. In the new `season.js`, set `id` to the folder name.
3. Keep every era ID from classic. Routes and saved progress depend on them, and the tests reject a pack with a missing era.
4. Add the ID to `packs` in `seasons.js`. Add a `calendar` window if the season should start on its own.
5. Replace the palettes, art, copy, and styles. Run `npm run illustrations` if the pack has `art.mjs`.
6. Add the new ID to the season list in `tests/site/eras.spec.js`. The site tests then check every chapter in that season for contrast, art, and narrow layouts.
7. Preview with `?season=<id>` and run the checks.

Packs with `illustrations: true` must ship light and dark versions of every lesson illustration in `illustrations/`.
Without that flag, the pack uses the classic illustrations.
Repository READMEs always show the classic illustrations from `docs/illustrations/`.

## Design rules for every season

- Every stop on the journey should look different from the others and show technology becoming more modern from the start to the final chapter.
- Keep the tone friendly. Avoid jump scares, flashing, gore, and decoration behind lesson text.
- Keep body text and code in readable fonts. Save expressive lettering for headings and art.
- Meet the contrast checks in both light and dark modes.
- Holiday artwork must not add religious messaging, cultural stereotypes, or alcohol.

## Halloween

The pack is an illustrated **Halloween field guide**, not a costume over the classic eras.
Original ink-cut-style scenes use a shared arched frame, fine engraving lines, botanical silhouettes,
and small, friendly characters. The interface stays quiet: tinted navigation, restrained controls,
generous reading space, and no texture behind lesson text. Each scene has its own palette and header
material in both light and dark modes.

| Page | Setting | Visual language |
| --- | --- | --- |
| Start | Pumpkin patch | Forest green and burnt orange, a winding moonlit trail, carved pumpkins, and woodland foliage |
| Meet the app and tools | Haunted library | Moss-green shelves, warm brass, bookish type, double rules, and a lantern-lit reading room |
| Setup | Trick-or-treat porch | Mulberry and dusty rose, rounded panels, hanging porch lights, and printed setup tickets |
| Assess the app | Ghost detective bureau | Petrol blue, square case-file frames, typewriter headings, and a lamplit investigation desk |
| Choose the plan | Witch's spellbook | Aubergine and muted lilac, fine inset cover rules, celestial geometry, and open spellbook pages |
| Upgrade and check | Monster laboratory | Botanical green, precise instrument-like panels, etched glassware, and a friendly monster |
| Plan for Azure | Moonlit sky | Twilight blue, spacious open headers, a large crescent, distant hills, and fine star shapes |

References use the moonlit sky. The legacy quickstart is a pumpkin shed, and the instructor companion is a raven's lookout.
The previous sample run is a ghost story scrapbook. The completed reference is an enchanted conservatory.

`art.mjs` owns the header compositions and the shared pumpkin, ghost, and botanical motifs.
`illustration-art.mjs` uses the same palettes and characters for the technical diagrams. Keep its labels,
arrows, and access boundaries intact when restyling it. Regenerate and commit both light and dark SVGs
after changing either source. No image service, remote font, or extra runtime dependency is required.
