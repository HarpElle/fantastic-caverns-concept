# Fantastic Caverns Concept Prototype

Independent redesign concept for Fantastic Caverns in Springfield, Missouri.

This is not the official Fantastic Caverns site. It is a pitch prototype built from publicly available visitor-facing information and links.

## Prototype Goals

- Put mobile trip-planning essentials above the fold: hours, last departure, tickets, directions, call, accessibility, and tour format.
- Lead with the clearest differentiator: America's ride-through cave.
- Make rates, hours, phone, address, and review links easy to update in `data/site.json`.
- Make tour departure cadence visible with computed next departures.
- Connect discovery and reputation channels: Google Maps, Tripadvisor, Yelp search, Roadtrippers, and Cave Science.
- Make the school/group education story easier to pitch.

## Content Sources Checked

- Official site: `https://www.missouriscave.com/`
- Cave Science Program: `https://cavescience.org/`
- Tripadvisor listing: `https://www.tripadvisor.com/Attraction_Review-g44926-d258059-Reviews-Fantastic_Caverns-Springfield_Missouri.html`
- Google Maps search link for Fantastic Caverns in Springfield, MO
- Roadtrippers attraction listing

## Update-Sensitive Content

The site reads current rates, hours, contact details, and outbound links from:

```text
data/site.json
```

Update that file first when hours, seasonal last-tour times, admission rates, review links, or phone details change.

The current departure cadence is modeled as:

```text
Today observed: every 30 minutes
First tour: 8:00 a.m.
Last tour: 8:00 p.m.
```

The official site currently publishes the daily open/close window and last departure, but not whether every-half-hour departures apply every day. Confirm that before making it permanent production copy.

## Local Preview

Use any static server from this directory:

```bash
npx serve .
```

Or deploy as a static site to GitHub Pages, Vercel, Netlify, or Cloudflare Pages.
