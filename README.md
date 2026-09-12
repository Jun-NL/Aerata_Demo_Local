# Aerata Demo Local

A desktop preview of Aerata for reviewing the layout and navigation.

## Run locally

Use Node.js 22.13 or later.

```sh
git clone https://github.com/Jun-NL/Aerata_Demo_Local.git
cd Aerata_Demo_Local
npm ci
npm run dev
```

Open [localhost:4375](http://127.0.0.1:4375). No account or API keys needed.

To preview a production build:

```sh
npm run build
npm run preview
```

Everything starts empty. Try **Missions → New mission** to explore the expandable sections and save a local draft.

There’s no backend connected. Drafts clear on reload, and unsaved edits are lost when you leave a mission.
