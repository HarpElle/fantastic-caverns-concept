const dataPath = "data/site.json";

const formatHour = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "p.m." : "a.m.";
  const hour12 = hours % 12 || 12;
  return minutes ? `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}` : `${hour12} ${suffix}`;
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToLabel = (totalMinutes) => {
  const minutesInDay = 24 * 60;
  const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return formatHour(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
};

const getCentralMinutes = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
};

const bindLinks = (site) => {
  document.querySelectorAll("[data-bind-href]").forEach((node) => {
    const key = node.dataset.bindHref;
    if (site.links?.[key]) node.href = site.links[key];
  });

  const phoneLink = document.querySelector("[data-phone-link]");
  if (phoneLink && site.contact?.phoneHref) {
    phoneLink.href = site.contact.phoneHref;
    phoneLink.textContent = site.contact.phoneDisplay;
  }
};

const renderDepartures = (site) => {
  const departures = site.departures;
  if (!departures) return;

  const label = document.querySelector("[data-schedule-label]");
  const quick = document.querySelector("[data-quick-schedule]");
  const note = document.querySelector("[data-schedule-note]");
  const shortNote = document.querySelector("[data-schedule-note-short]");
  const list = document.querySelector("[data-next-departures]");

  if (label) label.textContent = departures.cadenceLabel;
  if (quick) quick.textContent = departures.quickLabel;
  if (note) note.textContent = departures.note;
  if (shortNote) shortNote.textContent = departures.shortNote;
  if (!list) return;

  const first = timeToMinutes(departures.firstTour);
  const last = timeToMinutes(departures.lastTour);
  const frequency = departures.frequencyMinutes;
  const now = getCentralMinutes();
  const allTimes = [];

  for (let time = first; time <= last; time += frequency) {
    allTimes.push(time);
  }

  let upcoming = allTimes.filter((time) => time >= now).slice(0, 4).map((time) => ({
    label: minutesToLabel(time),
    qualifier: "Today"
  }));

  if (upcoming.length < 4) {
    const tomorrow = allTimes.slice(0, 4 - upcoming.length).map((time) => ({
      label: minutesToLabel(time),
      qualifier: "Tomorrow"
    }));
    upcoming = upcoming.concat(tomorrow);
  }

  list.innerHTML = upcoming
    .map((time) => `<li><strong>${time.label}</strong><span>${time.qualifier}</span></li>`)
    .join("");
};

const renderRates = (site) => {
  const list = document.querySelector("[data-rates-list]");
  if (!list || !Array.isArray(site.rates)) return;

  list.innerHTML = site.rates
    .map((rate) => `<div><dt>${rate.label}</dt><dd>${rate.price}</dd></div>`)
    .join("");

  const note = document.querySelector("[data-rate-note]");
  if (note && site.rateNote) note.textContent = site.rateNote;
};

const renderHours = (site) => {
  const hours = site.hours;
  if (!hours) return;

  const open = formatHour(hours.open);
  const close = formatHour(hours.close);
  const last = formatHour(hours.lastTour);

  const todayHours = document.querySelector("[data-today-hours]");
  const lastTour = document.querySelector("[data-last-tour]");
  const hoursNote = document.querySelector("[data-hours-note]");

  if (todayHours) todayHours.textContent = `${open} - ${close}`;
  if (lastTour) lastTour.textContent = `Last departure ${last}`;
  if (hoursNote) hoursNote.textContent = hours.note;

  const stateNode = document.querySelector("[data-hours-state]");
  if (!stateNode) return;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMinute] = hours.open.split(":").map(Number);
  const [closeHour, closeMinute] = hours.close.split(":").map(Number);
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  stateNode.textContent = currentMinutes >= openMinutes && currentMinutes < closeMinutes
    ? "Open today"
    : "Check today's hours";
};

fetch(dataPath)
  .then((response) => response.ok ? response.json() : Promise.reject(new Error("Missing site data")))
  .then((site) => {
    bindLinks(site);
    renderDepartures(site);
    renderRates(site);
    renderHours(site);
  })
  .catch(() => {
    document.documentElement.classList.add("data-unavailable");
  });
