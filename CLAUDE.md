# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gastony is a personal expense tracking app. Users can register expenses via WhatsApp messages or image OCR, and view them through a web dashboard. The app uses a local Ollama LLM (gemma3 model) to extract structured financial data (name, date, amount, concept) from natural language text or OCR output.

## Architecture

**Monorepo with two independent applications:**

- `gastony/` — Django 6.0 backend (REST API)
- `frontend/` — React 19 + Vite frontend (TypeScript)
- `api_doc/` — Bruno API collection for manual endpoint testing

### Backend (`gastony/`)

- **Framework:** Django 6.0 + Django REST Framework
- **Database:** SQLite (default)
- **Auth:** DRF TokenAuthentication (login via `POST /login`)
- **API docs:** drf-yasg (Swagger at `/swagger/`, ReDoc at `/redoc/`)
- **Django apps:**
  - `users` — Custom User model extending AbstractUser (adds `phone` field). `AUTH_USER_MODEL = 'users.User'`
  - `accounting` — Core business logic: Transaction and Category models
- **Key flow:** `accounting/services.py` sends prompts to Ollama (`http://localhost:11434/api/generate`) to parse text into structured JSON. `accounting/utils.py` uses pytesseract for OCR.
- **Twilio integration:** WhatsApp webhook at `POST /transactions/whatsapp/` receives messages, processes them through LLM, saves transactions, and replies via Twilio.
- **Router:** DRF DefaultRouter registers `users` and `transactions` viewsets at root URL.
- **Config:** Uses `python-decouple` — expects `.env` file with `SECRET_KEY`, `DEBUG`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`.

### Frontend (`frontend/`)

- **Stack:** React 19, TypeScript, Vite 7, TailwindCSS v4, TanStack Router (file-based routing)
- **UI components:** shadcn/ui (new-york style) with Radix primitives, lucide-react icons, framer-motion animations
- **Routing:** File-based via `@tanstack/router-plugin`. Routes auto-generated in `src/routeTree.gen.ts` (do not edit manually).
- **Path alias:** `@/` maps to `./src/`
- **Auth flow:** Login stores token in `sessionStorage`, passed as `Authorization: Token <token>` header to backend API at `http://localhost:8000`
- **Linting/Formatting:** Biome (tabs, double quotes). Excludes `routeTree.gen.ts` and `styles.css`.

## Common Commands

### Backend (run from `gastony/` directory)

```bash
# Activate virtualenv
source venv/bin/activate          # mac/linux
venv/Script/activate              # windows

# Install dependencies
pip install -r requirement.txt

# Run dev server
python manage.py runserver

# Migrations
python manage.py makemigrations
python manage.py migrate

# Create new Django app
python manage.py startapp <appname>
```

### Frontend (run from `frontend/` directory)

```bash
npm install
npm run dev          # Dev server on port 3000
npm run build        # Production build (vite build && tsc)
npm run test         # Run tests (vitest)
npm run lint         # Biome linter
npm run format       # Biome formatter
npm run check        # Biome check (lint + format)
```

## External Dependencies

- **Ollama** must be running locally on port 11434 with the `gemma3` model loaded for LLM-based text extraction.
- **Tesseract OCR** must be installed for image-to-text functionality (pytesseract).
- **Twilio** account required for WhatsApp messaging features.
