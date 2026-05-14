# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Consultorio Odontológico AQUA — a dental clinic management desktop app. Monorepo with two independent runtimes that must run simultaneously:

- **Backend**: Spring Boot 3.4.5 (Java 17/18) — REST API on `http://localhost:8080`
- **Frontend**: React 19 + Vite — served on `http://localhost:5173` in dev
- **Desktop shell**: Electron 39 wrapping the Vite frontend

## Commands

### Backend (run from repo root)
```bash
./mvnw spring-boot:run          # start backend
./mvnw test                     # run all tests
./mvnw test -Dtest=ClassName    # run single test class
./mvnw package                  # build JAR
```

### Frontend (run from `fronendvite/consultorioOdontologicoAqua/`)
```bash
npm run dev              # Vite dev server only (browser)
npm run electron:dev     # Vite + Electron together (recommended for desktop dev)
npm run electron:build   # production build + Windows NSIS installer → release/
npm run lint             # ESLint
```

## Architecture

### Data flow (per patient)
`Paciente` is the root entity. All clinical data hangs off it:
- `HistoriaClinica` → clinical history form
- `Odontograma` → tooth-by-tooth chart
- `Periodontograma` / `Periodoncia` → periodontal data
- `Diagnostico` → diagnoses
- `Tratamiento` → treatments
- `Presupuesto` → budget (links `Tratamiento` via `TratamientoPresupuesto` join entity)
- `Cita` → appointments (also linked to `Usuario`)
- `Gasto` → clinic expenses (financial control, not per-patient)

### Backend layers
Standard Spring layering: `Controller → Service → Repository (JPA)`.  
All entity↔DTO conversions go through `service/util/DTOConverter.java` — add new conversions there, not inline in services.

### Frontend routing
Routes are defined in `src/App.jsx`. Everything under `/dashboard` is protected by `ProtectedRoute` (checks localStorage for user session). The `/register` route is intentionally disabled and redirects to `/`.

### API communication
All frontend HTTP calls use Axios via `buildApiUrl()` from `src/config.js`. That function reads `VITE_API_URL` env var or falls back to `http://localhost:8080/api`. Do not hardcode API URLs anywhere else.

### Electron entry point
`main.cjs` — detects dev vs. production via `app.isPackaged` and loads either the Vite dev server or the static `dist/index.html`. Node integration is disabled; the renderer has no direct Node access.

### Security
`SecurityConfig.java` — CSRF disabled (REST API). All `/api/**` endpoints are currently `.permitAll()`. CORS allows `localhost:5173`, `localhost:3000`, and the production Railway/Vercel domains. Auth uses BCrypt passwords; there is no JWT — login returns the full `Usuario` entity stored in localStorage.

## Database
MySQL on `localhost:3306`, database `consultorio_aqua`.  
Credentials in `application.properties` (root / aqua123!).  
`ddl-auto=update` — schema is auto-updated on startup, no migration files.

## Key constraints
- The Electron build targets Windows only (NSIS installer).
- The current branch (`appEscritorio`) is the Electron migration; `main` is the previous web-only version.
- Registration UI is disabled on the frontend — new users must be created directly in the DB or via `POST /api/auth/register`.
