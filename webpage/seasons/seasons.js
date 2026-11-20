// Seasonal look for the course site. This is the only file to edit to switch seasons.
//   active: "auto" follows the calendar, or pin a pack.
//   calendar: inclusive visitor-local month-day windows, or the US Thanksgiving rule.
// Preview any pack with ?season=<id> in the URL.
(function (global) {
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

  const monthDay = date => `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const inWindow = (day, { from, to }) => from <= to ? day >= from && day <= to : day >= from || day <= to;
  function inThanksgivingWindow(date, daysBefore) {
    const firstOfNovember = new Date(date.getFullYear(), 10, 1);
    const firstThursday = 1 + (4 - firstOfNovember.getDay() + 7) % 7;
    const thanksgivingDay = firstThursday + 21;
    const start = new Date(date.getFullYear(), 10, thanksgivingDay - daysBefore);
    const thanksgiving = new Date(date.getFullYear(), 10, thanksgivingDay);
    const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return current >= start && current <= thanksgiving;
  }
  const isInWindow = (date, window) => window.rule === "us-thanksgiving"
    ? inThanksgivingWindow(date, window.daysBefore)
    : inWindow(monthDay(date), window);

  function resolveSeason({ date = new Date(), requested = null, config = seasonConfig } = {}) {
    if (requested && config.packs.includes(requested)) return requested;
    if (config.active !== "auto") return config.packs.includes(config.active) ? config.active : config.fallback;
    const match = config.calendar.find(window => config.packs.includes(window.season) && isInWindow(date, window));
    return match ? match.season : config.fallback;
  }

  global.courseSeasons = { seasonConfig, resolveSeason };

  if (typeof document === "undefined") return;
  const requested = new URLSearchParams(location.search).get("season");
  const season = resolveSeason({ requested });
  const root = document.documentElement;
  root.dataset.season = season;
  document.getElementById("season-stylesheet")?.setAttribute("href", `seasons/${season}/season.css`);
  document.querySelector('link[rel="icon"]')?.setAttribute("href", `seasons/${season}/assets/favicon.svg`);
})(globalThis);
