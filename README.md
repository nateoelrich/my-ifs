# My IFS

A personal practice companion for [Internal Family Systems](https://ifs-institute.com/) (IFS) therapy — identify your inner parts, understand what they're trying to do for you, and build relationship with your inner world over time.

**Live:** https://nateoelrich.github.io/my-ifs

---

## What is IFS?

Internal Family Systems is a therapeutic model developed by Dr. Richard Schwartz that understands the mind as made up of distinct sub-personalities or **parts** — each with its own feelings, beliefs, and protective intentions. Beneath all those parts is a **Self**: a calm, curious, compassionate core that can lead the inner system toward healing.

IFS identifies three types of parts:
- **Exiles** — carry pain, fear, or shame from past experiences; often kept locked away by the system
- **Managers** — proactive protectors (inner critic, people-pleaser, perfectionist, worrier)
- **Firefighters** — reactive protectors that activate when exile pain breaks through (numbing, rage, distraction)

The practice is about building enough trust with your parts that Self can lead. Not eliminating parts — understanding them.

---

## Features

### Parts Library
Identify and deeply document each part of your inner system. The 11-step guided wizard walks you through: name, color, body location and sensation, image, emotions, beliefs, triggers, positive intention, fears, origin story, role type (exile / manager / firefighter), what the part needs from Self, and what gifts it carries when unburdened.

Every part gets a color that cascades through the UI — cards, avatars, focus rings, and buttons all reflect the part you're working with.

### In-the-Moment Check-In (`/check-in`)
The core feature. When you're activated — before a hard conversation, after a conflict, in a spiral — open this. An 8-step guided flow helps you:
1. Ground yourself and describe what's happening
2. Notice where you feel it in your body
3. Name the emotions present
4. Identify which part might be active (match against known parts or name a new one)
5. Check your Self-energy using the 8 C's (Calm, Curious, Compassionate, Clear, Courageous, Confident, Creative, Connected)
6. Understand what positive intention this part is acting from
7. Ask what the part needs from you right now
8. Close and save

Every check-in creates a **Session** record in your Journal.

### Parts Map (`/map`)
A visual overview of your entire inner system. Self sits at the center; parts are arranged around it by role — managers to the left, firefighters to the right, exiles in the inner ring. Parts that have completed an unburdening show a ✦ indicator. If a protector guards a specific exile, a faint arc connects them.

### Journal (`/sessions`)
A chronological record of every check-in and deeper session. Filter by part. Each session links back to the part that showed up, making it easy to see patterns over time. Session detail shows all responses, emotions, Self-energy qualities, and protocol notes.

### Guided Protocols
Deeper structured work, triggered from any part's detail page:

**Meet a Protector — 6 F's** (`/sessions/new?protocol=6fs`)
The clinical framework for getting to know a manager or firefighter:
Find → Focus → Flesh Out → Feel Toward → Befriend → Fear (what would happen if it stopped?)

**Heal an Exile — Unburdening** (`/sessions/new?protocol=unburdening`)
The deep exile healing process:
Access → Witness → Validate → Do-Over → Retrieve → Unburden (light, wind, water, fire, or earth) → Gifts

Both save as Sessions and can be triggered directly from a part's detail page.

### Daily Check-In (`/check-in/daily`)
A lightweight daily practice: mood scale, Self-energy score, which parts feel present today, and a space for whatever a part wants you to know.

### IFS Reference (`/about`)
An in-app explainer covering the IFS model: what parts are, what Self is, the three roles, blending and unblending, and unburdening — so the app can be understood by someone new to the framework.

---

## Privacy

**Everything stays in your browser.** There is no account, no server, no backend, and no network requests after the initial page load. Your parts — their fears, their origin stories, their burdens — never leave your device.

Data is stored in `localStorage` under the key `ifs-workspace` as versioned JSON. The **Export** button in the nav lets you download a portable `.json` backup at any time. **Import** restores from that file.

This is a deliberate design choice. The kind of material that surfaces in IFS work is deeply personal. It should live on your device, under your control.

---

## Tech

- [SvelteKit 5](https://svelte.dev) with Svelte 5 runes (`$state`, `$derived`, `$effect`)
- [Tailwind CSS v4](https://tailwindcss.com) with `@theme` config
- `@sveltejs/adapter-static` — fully static SPA deployed to GitHub Pages
- All data in `localStorage` — no backend, no database

## Running locally

```sh
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deploying

Every push to `main` builds and deploys automatically via GitHub Actions to GitHub Pages. The workflow is in `.github/workflows/deploy.yml`.

```sh
cd frontend
npm run build
npm run preview   # preview the production build locally
```
