# My IFS

A personal practice tool for [Internal Family Systems](https://ifs-institute.com/) therapy — get to know your inner parts, track what you discover, and build relationship with your inner world over time.

**Live:** https://nateoelrich.github.io/my-ifs

---

## What it does

- **Parts journal** — document each part you meet: its name, role, body location, emotions, beliefs, triggers, protective intentions, origin story, and what it needs from Self
- **Color-coded cards** — assign a color to each part; the UI reflects it throughout
- **Wizard** — a step-by-step flow for getting to know a new part without feeling overwhelmed
- **Export / Import** — download your entire workspace as a JSON file for backup or transfer; restore it anytime

## Privacy

Everything lives in your browser's `localStorage`. No account, no server, no network requests after the initial page load. Your parts — their fears, their origin stories, their burdens — never leave your device.

Export gives you a portable `.json` file you can back up anywhere you choose.

## Tech

- [SvelteKit 5](https://svelte.dev) with Svelte 5 runes
- [Tailwind CSS v4](https://tailwindcss.com)
- `@sveltejs/adapter-static` — fully static SPA, hosted on GitHub Pages
- All data in `localStorage` as versioned `ifs-workspace` JSON — no backend

## Running locally

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deploying

Every push to `main` builds and deploys via GitHub Actions to GitHub Pages. The workflow is in `.github/workflows/deploy.yml`.

To run the production build locally:

```sh
cd frontend
npm run build
npm run preview
```
