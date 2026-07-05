# Deployment Plan: Free Production Hosting + CI/CD

## Architecture

GitHub Pages only serves static files — it cannot run the .NET backend or MongoDB. The stack splits across three free-tier services:

```
GitHub Pages          Fly.io                  MongoDB Atlas
─────────────         ──────────────────       ──────────────
SvelteKit static  →   .NET Web API (Docker)   Free M0 cluster
(client-side SPA)     auto-stop/start          512MB forever free
free, no limits       3 shared VMs free
```

CI/CD via GitHub Actions: push to `main` → build static site → deploy to Pages + deploy Docker image to Fly.io.

**Key insight**: The SvelteKit app has zero server-side routes — every page is a pure client component. Switching `adapter-node` → `adapter-static` gives a true SPA, deployable to GitHub Pages.

---

## Step 1: MongoDB Atlas (free M0)

1. Create account at cloud.mongodb.com
2. Create a free **M0** cluster (any region)
3. Create database user: username `ifs`, set a strong password
4. Add Network Access: `0.0.0.0/0` (allow all — Fly.io uses dynamic IPs)
5. Get connection string:
   ```
   mongodb+srv://ifs:<password>@cluster0.xxxxx.mongodb.net/my_ifs?retryWrites=true&w=majority
   ```

## Step 2: Fly.io (free .NET backend)

1. Install flyctl: `brew install flyctl`
2. `fly auth login`
3. From the `backend/` directory: `fly launch --no-deploy`
   - App name: e.g. `my-ifs-api` → URL will be `https://my-ifs-api.fly.dev`
   - Region: pick closest to you
   - Say NO to adding a database
4. Set secrets:
   ```bash
   fly secrets set \
     ConnectionStrings__MongoDB="<atlas connection string>" \
     Jwt__Secret="$(openssl rand -base64 32)" \
     Cors__AllowedOrigins="https://<your-github-username>.github.io"
   ```
5. Get deploy token for GitHub Actions:
   ```bash
   fly tokens create deploy -x 999999h
   ```
   Save the output — you'll add it as a GitHub secret named `FLY_API_TOKEN`.

6. Edit the generated `backend/fly.toml` to ensure:
   ```toml
   [env]
     ASPNETCORE_HTTP_PORTS = "5000"

   [http_service]
     internal_port = 5000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
   ```

## Step 3: GitHub Repository

1. Create repo at github.com (e.g. `my-ifs`)
2. Push local code:
   ```bash
   git init
   git remote add origin <url>
   git push -u origin main
   ```
3. Repo Settings → Pages → Source: **GitHub Actions**
4. Repo Settings → Secrets → Actions → add:
   - `FLY_API_TOKEN` — from Fly.io step above
   - `PUBLIC_API_BASE` — `https://my-ifs-api.fly.dev/api`

---

## Code Changes (implement after setup above)

### 1. `frontend/package.json` — swap adapter
Remove `@sveltejs/adapter-node`, add `@sveltejs/adapter-static`:
```json
"@sveltejs/adapter-static": "^3.0.0"
```

### 2. `frontend/vite.config.ts` — use static adapter + base path
```ts
import adapter from '@sveltejs/adapter-static';

// in sveltekit() options:
adapter: adapter({ fallback: '404.html' }),
paths: {
  base: process.env.NODE_ENV === 'production' ? '/my-ifs' : ''
}
```
Replace `my-ifs` with the actual GitHub repo name.

### 3. `frontend/src/routes/+layout.ts` — NEW FILE
```ts
export const prerender = true;
export const ssr = false;
```

### 4. `frontend/src/lib/api/client.ts` — configurable API URL
Replace `const BASE = 'http://localhost:5050/api'` with:
```ts
import { PUBLIC_API_BASE } from '$env/static/public';
const BASE = PUBLIC_API_BASE;
```

### 5. `frontend/src/lib/api/auth.ts` — same change
Replace `const BASE = 'http://localhost:5050/api'` with:
```ts
import { PUBLIC_API_BASE } from '$env/static/public';
const BASE = PUBLIC_API_BASE;
```

### 6. `frontend/.env` — local dev (create this file, add to .gitignore)
```
PUBLIC_API_BASE=http://localhost:5050/api
```

### 7. `.github/workflows/deploy.yml` — NEW FILE
```yaml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: deploy
  cancel-in-progress: true

jobs:
  deploy-frontend:
    name: Build & Deploy Frontend
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - name: Install dependencies
        run: npm install
        working-directory: frontend
      - name: Build static site
        run: npm run build
        working-directory: frontend
        env:
          PUBLIC_API_BASE: ${{ secrets.PUBLIC_API_BASE }}
          NODE_ENV: production
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/build
      - name: Deploy to GitHub Pages
        id: deploy
        uses: actions/deploy-pages@v4

  deploy-backend:
    name: Build & Deploy Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only
        working-directory: backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

---

## Notes

- **Cold starts**: Fly.io free tier stops VMs after inactivity. First request after idle takes ~1-2s extra. Fine for personal use.
- **CORS**: `Cors__AllowedOrigins` should be `https://<username>.github.io` — no trailing slash, no repo path.
- **`docker compose up`** still works unchanged for local dev.
- **Base path**: `paths.base` in vite.config.ts must exactly match the GitHub repo name.

---

## Verification (after deploying)

1. Push to `main` → GitHub Actions tab → both jobs green
2. Frontend: `https://<username>.github.io/<repo-name>/`
3. Backend health: `https://my-ifs-api.fly.dev/api/auth/register` → returns JSON
4. Register → log in → create a part → verify it saves
5. Reload → auth persists (localStorage)
6. Navigate directly to `/parts/some-id` → does NOT 404 (SPA routing via 404.html)
