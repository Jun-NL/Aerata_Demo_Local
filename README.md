# Aerata Demo Local

A small, standalone desktop UI preview of Aerata. Designed for landscape laptop and desktop windows.

## Run locally

Use Node.js 22.13 or later.

```sh
git clone https://github.com/Jun-NL/Aerata_Demo_Local.git
cd Aerata_Demo_Local
npm ci
npm run dev
```

Open **http://127.0.0.1:4375**. No account, API keys or environment variables are required.

To review a production build:

```sh
npm run build
npm run preview
```

The generated `dist/` directory can also be served by a static web server. Hash navigation supports subdirectory hosting.

## What to review

- White desktop shell and navigation across all seven sections.
- Today: hourly calendar, Tomorrow, and separate boxes that expand in place. Dates and times come from the reviewer's device.
- Missions: fixed search and filters. Open **New mission** to review its four expandable sections, then save a local draft to see it in the register.
- Clients & Work, People & Fleet, Safety & Compliance, Commercial: fixed item-list and contents layouts, without expand/minimize controls.
- Administration: unconfigured organization and account states.

## Data and scope

**All registers start empty.** There are no seeded missions, clients, people, assets, incidents, quotes, accounts, documents or other sample records. Only text entered by the reviewer can create a local mission draft.

Drafts exist only in browser memory and are cleared on reload. Unsubmitted form edits are discarded when leaving a mission. There is no storage service, sign-in, external data request, analytics, eligibility calculation, airspace assessment or operational release capability. A draft is never represented as ready or approved.

This repository is the standalone presentation preview, not the complete operational prototype. Backend workflows, document handling and data integrations are intentionally absent. Register detail panels remain empty without connected data.

Only source files, the dependency manifest/lockfile and startup instructions are included. Build outputs, dependencies, test artifacts, fixture sources and the original repository history are excluded.
