# Mariam Fadel — Full-Stack Developer Portfolio

A modern full-stack developer portfolio built with:

- React + Vite
- Express.js
- REST API
- JSON file persistence
- Responsive UI
- Project showcase
- Contact form
- Simple admin API for project CRUD

## Run locally

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the URL shown by Vite, usually `http://localhost:5173`.

## Admin API

Set an admin key before running the backend:

Windows PowerShell:

```powershell
$env:ADMIN_KEY="change-this-key"
npm run dev
```

The default development key is `dev-admin-key` if you don't set one.

Use the header:

```text
x-admin-key: your-key
```

for protected project create/update/delete endpoints.

## Main API endpoints

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/contact`
- `GET /api/health`

## Project structure

```text
mariam-fullstack-portfolio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── backend/
│   ├── data/
│   │   ├── projects.json
│   │   └── messages.json
│   ├── src/
│   │   └── server.js
│   └── package.json
└── README.md
```
