# MoodMeal

![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)
![Oxlo API](https://img.shields.io/badge/Oxlo-LLM%20API-111111)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI%20Server-2C5E3F)

Tell us how you feel, and MoodMeal tells you what to cook.

MoodMeal is an AI-powered recipe assistant that converts emotional state, dietary preference, and available ingredients into a structured, chef-style recipe response. The app uses a React + Vite frontend and a FastAPI backend that calls Oxlo's chat-completions API.

## Key Features

- Mood-aware recipe generation with emotional context.
- Ingredient-aware suggestions using pantry constraints.
- Dietary preference support from the same input flow.
- Strict JSON response contract for frontend reliability.
- Markdown-fence cleanup and JSON parsing safeguards in backend.

## Tech Stack

- Frontend: React 18, Vite, CSS
- Backend: FastAPI, Uvicorn, Pydantic, HTTPX, python-dotenv
- AI: Oxlo API via `/chat/completions` with `llama-3.3-70b`

## Architecture Overview

- Frontend UI collects mood + pantry + dietary input.
- Frontend sends a request to `POST /api/recipe`.
- FastAPI backend builds system and user prompts.
- Backend calls Oxlo API and receives model output.
- Backend strips optional markdown code fences, parses JSON, and returns normalized data.

## Project Structure

```text
MoodMeal/
  backend/
    main.py
    requirements.txt
    test_api.py
    test_models.py
    test_models2.py
    .env.example
  frontend/
    src/
    public/
    package.json
    vite.config.js
  README.md
```

## Quick Start

## 1) Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

- Windows (PowerShell):

```bash
.\venv\Scripts\activate
```

- macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create environment file:

```bash
copy .env.example .env
```

Set required values in `.env`:

```env
OXLO_API_KEY=your_actual_key_here
OXLO_BASE_URL=https://api.oxlo.ai/v1
```

Run backend:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 2) Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.
Backend runs at `http://localhost:8000`.

## API Reference

## `POST /api/recipe`

Generate one emotion-aligned recipe.

Request body:

```json
{
  "mood": "celebratory",
  "mood_desc": "Joyful, festive, indulgent",
  "ingredients": "chicken, lemon, garlic",
  "dietary": "None"
}
```

Example response:

```json
{
  "title": "Lemon Garlic Celebration Roast",
  "cuisine": "Mediterranean",
  "time": "45 mins",
  "difficulty": "Medium",
  "why": "Bright citrus lifts the richness and mirrors your celebratory energy.",
  "ingredients": [
    "1 whole chicken (cut into pieces)",
    "2 fresh lemons",
    "6 cloves garlic, smashed"
  ],
  "steps": [
    "Preheat your oven to 400F (200C) and pat chicken dry.",
    "Rub chicken with oil, lemon zest, and garlic. Roast until golden."
  ],
  "chefNote": "Tonight's meal should feel like momentum. Let citrus brightness and roasted depth carry that joy forward."
}
```

## Scripts

- Backend: `uvicorn main:app --reload`
- Frontend dev: `npm run dev`
- Frontend build: `npm run build`
- Frontend preview: `npm run preview`

## Testing

From `backend/`, run:

```bash
pytest
```

If `pytest` is not installed in your environment, install it first:

```bash
pip install pytest
```

## Troubleshooting

- `OXLO_API_KEY is not configured`:
  - Ensure `.env` exists in `backend/` and has a valid key.
- CORS or fetch issues from frontend:
  - Confirm frontend runs on `http://localhost:5173` and backend on `http://localhost:8000`.
- Model response parsing error:
  - Backend already strips common markdown fences, but verify Oxlo response shape and key validity.
- Dependency problems:
  - Recreate virtual environment and reinstall from `requirements.txt`.

## Notes

- The backend currently uses `llama-3.3-70b` via Oxlo in `backend/main.py`.
- JSON-only output is enforced by prompt design and response parsing logic.
