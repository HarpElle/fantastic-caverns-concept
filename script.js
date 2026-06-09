const dataPath = "data/site.json";

const formatHour = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "p.m." : "a.m.";
  const hour12 = hours % 12 || 12;
  return minutes ? `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}` : `${hour12} ${suffix}`;
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
    renderRates(site);
    renderHours(site);
  })
  .catch(() => {
    document.documentElement.classList.add("data-unavailable");
  });
