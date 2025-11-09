# PDF Annotation — Frontend

This README describes how to run and understand the frontend application for the PDF Annotation project.

## Project summary

The frontend is a React single-page application that provides a PDF viewer with annotation tools, user authentication, document listing and upload UI. It consumes the backend API (see `../backend`).

## Project setup and run instructions

Prerequisites:

- Node.js (16+ recommended)

Steps:

1. Install dependencies

```bash
npm install
```

2. Run the app

This project currently contains `react-scripts` in `package.json` and a `vite.config.js`. By default the `package.json` `start` script uses `react-scripts`:

```bash
npm start
```

If you prefer to run via Vite (faster dev server) you can update `package.json` scripts to use `vite` and install the Vite dev tooling:

```bash
npm install -D vite @vitejs/plugin-react
# then in package.json change scripts:
# "dev": "vite", "build": "vite build", "preview": "vite preview"
npm run dev
```

3. Tailwind CSS

This project uses Tailwind CSS but there are a few common integration points to verify if you don't see Tailwind styles:

- Ensure your imported app stylesheet contains the Tailwind directives `@tailwind base; @tailwind components; @tailwind utilities;`. The app imports `src/styles/index.css` from `src/index.jsx`.
- Make sure `tailwind.config.js` `content` array includes the paths your app uses (for example `./index.html`, `./public/index.html`, and `./src/**/*.{js,jsx,ts,tsx}`).
- Ensure PostCSS is configured and dependencies installed (`postcss`, `autoprefixer`, `tailwindcss`) or use Tailwind CLI. The repository contains `postcss.config.js` optionally — install the peer packages if missing:

```bash
npm install -D postcss autoprefixer tailwindcss
```

4. Environment variables

If the frontend needs to call the backend at a different URL, create a `.env` in the `frontend` folder. For example:

```
VITE_API_BASE_URL=/api
```

Note: Vite uses `VITE_` prefix for env variables; CRA uses `REACT_APP_` prefix.

## Folder structure

Important files and folders:

- `src/` — React source
  - `components/` — UI components (Navbar, PDF viewer, Upload modal, etc.)
  - `pages/` — route pages (Landing, Dashboard, Viewer, Login/Register)
  - `context/` — React context for auth
  - `services/api.js` — axios wrapper for backend calls
  - `styles/` — CSS files (index.css, components.css, etc.)
- `public/index.html` — base HTML
- `tailwind.config.js` — Tailwind configuration

Example tree (trimmed):

```
frontend/
├─ public/
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ services/
│  └─ styles/
├─ tailwind.config.js
└─ vite.config.js
```

## Technology stack used

- React (v18)
- React Router DOM
- Axios for API calls
- Tailwind CSS for utilities
- pdfjs / react-pdf for PDF rendering
- Vite (config present) or Create React App (scripts present)

## Key frontend-backend integration

- The frontend calls the backend API endpoints under `/api/*` (for example `/api/auth`, `/api/documents`, `/api/annotations`). See the backend README for the full API specification.
- The frontend `services/api.js` contains an Axios instance — update the base URL to match your backend (via `.env`).

## Annotation logic (frontend perspective)

- When a user creates an annotation, the UI gathers the following data and POSTs to `POST /api/annotations`:

  - `document` (document id)
  - `page` (page number)
  - `type` (highlight, note, shape, etc.)
  - `content` (text for notes or associated text)
  - `color` (hex color)
  - `coordinates` (object with x/y/width/height or relative positions)

- Replies are added by POSTing `{ content }` to `/api/annotations/:id/reply`.
- The frontend expects the backend to return populated annotation objects (with `user` and `replies.user` populated) so it can render names and avatars.

## Troubleshooting & notes

- If Tailwind styles are not appearing:

  - confirm `@tailwind` directives exist in the CSS file imported by `src/index.jsx` (this project imports `src/styles/index.css`).
  - confirm PostCSS and Tailwind dependencies are installed and configured.
  - confirm `tailwind.config.js` `content` paths include `./public/index.html` and `./src/**/*`.

- If you decide to switch from CRA -> Vite, update `package.json` scripts and install Vite plugins, then test the app. Keep a backup of the old scripts.

## How to contribute

- Use the controller -> service separation for backend changes.
- Keep UI logic in components and keep API calls inside `services/api.js`.

---

If you'd like, I can:

- Apply Swagger annotations automatically to all backend route files.
- Update `package.json` to use Vite consistently and add a `dev` script.
- Add a small CONTRIBUTING.md with contribution steps.
