# AI for Students

A small multi-page educational web app with an Express backend for OpenAI-powered chat. Intended as a student study assistant with features like a study planner, notes summarizer, and a chat-based tutor.

Contents
- index.html — Landing page
- dashboard.html — App hub (contains chat widget)
- planner.html — Study planner UI
- summarizer.html — Notes summarizer UI
- notes.html — Saved notes viewer
- login.html — Simple login mock
- server/ — Express server that proxies requests to OpenAI
  - server/index.js
  - server/package.json

Quick notes before deployment
- Do NOT commit your OpenAI API key. The backend reads OPENAI_API_KEY from environment variables (or a local `.env` file for development).
- The server accepts POST /api/chat and forwards requests to the OpenAI Chat Completions API.

Recommended deployment approaches (Vercel)

You have two straightforward options to deploy on Vercel:

Option A — Deploy frontend (static) + backend (server) as two Vercel projects (recommended)
1. Push this repository to GitHub.
2. Create a Vercel project for the frontend:
   - Import the repo.
   - Set the Root Directory to the project root.
   - Framework Preset: "Other" or Static Site (Vercel will serve the static HTML files).
   - Deploy. This serves the static pages.
3. Create a second Vercel project for the backend:
   - Import the same repo, but set Root Directory to `/server`.
   - Framework Preset: Node.js.
   - In Vercel dashboard, add an Environment Variable:
     - Key: `OPENAI_API_KEY`
     - Value: (your OpenAI key)
   - Deploy. Vercel will run `npm install` in `/server` and use `npm start` to run the Express server.
4. Update the frontend to call the backend's public URL (the API project's production URL) instead of `http://localhost:3001`.

Option B — Serve static files from the backend and deploy a single Node project
1. Move or copy the static files into `server/public` (or update Express to serve from the parent directory). The Express app must serve HTML and static assets.
2. Set the Vercel project root to `/server` and deploy as Node.js.
3. Add `OPENAI_API_KEY` in Vercel Environment Variables.

Notes on CORS and API URLs
- The frontend currently uses `http://localhost:3001/api/chat`. After deployment you must change this to the backend's Vercel URL, e.g. `https://ai-student-api.vercel.app/api/chat`.
- If you deploy frontend and backend separately, update the production `fetch` URL accordingly in `dashboard.html`, `planner.html`, and `summarizer.html`.

Local setup and test commands

1. Start backend locally (from `server`):

```powershell
cd server
npm install
# create a .env file containing: OPENAI_API_KEY=sk-... (do not commit this file)
npm start
```

2. Open `index.html` in your browser (double-click or serve the folder).
3. Use DevTools to ensure the frontend calls the backend URL.

Git instructions (local)
```powershell
# from project root
git init
git add .
git commit -m "Initial commit - AI for Students Project"
# create repo on GitHub and then
git branch -M main
git remote add origin <YOUR_GITHUB_URL>
git push -u origin main
```

Security and next steps
- Add `server/.env` to `.gitignore` (already present) and never push secrets.
- Optionally convert the backend to serverless functions (Vercel `api/` functions) to simplify hosting.
- Add a small `config` in the frontend to switch API URLs based on environment.

If you want, I can:
- Add a `README.md` (done).
- Add a tiny `config.js` to centralize the API base URL and update pages to use it.
- Help initialize git and generate the exact commands you need to run locally (I will not push to your GitHub automatically).
- Help prepare the backend for Vercel serverless functions if you'd like a single-project deploy.

Tell me which next step you'd like me to take (add config, initialize git, prepare serverless, or give step-by-step Vercel UI instructions).