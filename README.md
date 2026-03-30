# MoodMeal ✦

*Tell us how you feel. We'll tell you what to cook.*

MoodMeal is an emotional intelligence-driven culinary assistant. Built on a premium frontend architecture paired with an AI-integrated backend, the application maps your current emotional state, dietary preferences, and pantry ingredients to a uniquely tailored, chef-inspired recipe complete with poetic dish reasoning.

## What We're Solving
Often we default to eating the same monotonous meals—not because we lack ingredients, but because we lack inspiration. MoodMeal connects **psychology with gastronomy**, converting feelings ("Stressed", "Adventurous", "Cozy") into hyper-personalized, fully structured recipes delivered by an elite chef persona inside our local language model integrations.

---

## 🏗️ Architecture

- **Frontend:** React + Vite
  - Custom fluid design system (built completely from scratch in vanilla CSS variables).
  - SVG grain overlays and responsive staggered CSS animations.
  - Clean API proxying utilizing Vite's internal routing.
- **Backend:** FastAPI (Python)
  - Asynchronous HTTP routing and external API proxying via `httpx`.
  - Full integration with **Oxlo API**'s LLM routing (`llama-3.3-70b`) configured to consistently output strictly validated JSON data, preventing markdown breakage and hallucinated preamble.

---

## 🚀 Quick Setup

### 1. The Backend
To get the Python server talking to the AI models:

```bash
cd backend
python -m venv venv

# Activate your venv:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source/venv/bin/activate

pip install -r requirements.txt
```

**API Key Configuration:**
Copy `backend/.env.example` to a new file named `.env`.

```bash
cp .env.example .env
```
Inside `.env`, paste your proxy API details so Python can authenticate calls:
```env
OXLO_API_KEY=your_actual_key_here
OXLO_BASE_URL=https://api.oxlo.ai/v1
```

**Start the Server:**
```bash
uvicorn main:app --port 8000 --reload
```

### 2. The Frontend
In a new terminal window, load your frontend and its dependencies:

```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`. The Vite server will automatically proxy any frontend queries prefixed with `/api` over to the Python backend on `localhost:8000`.

---

## 📡 API Endpoints 

### `POST /api/recipe`

Accepts diner state details and interfaces with the configured Language Model to build out a structured recipe object. 

**Request Format:**
```json
{
  "mood": "celebratory",
  "mood_desc": "Joyful, festive, indulgent",
  "ingredients": "chicken, lemon, garlic",
  "dietary": "None"
}
```

**Response Format Schema (Strict JSON):**
```json
{
  "title": "Lemon Garlic Celebration Roast",
  "cuisine": "Mediterranean",
  "time": "45 mins",
  "difficulty": "Medium",
  "why": "Bright citrus cuts through the richness, embodying the bright spark of your celebratory mood.",
  "ingredients": [
    "1 whole chicken (cut into pieces)",
    "2 fresh lemons",
    "6 cloves garlic, smashed"
  ],
  "steps": [
    "Preheat your oven to 400°F (200°C) and pat the chicken completely dry.",
    "Rub the chicken with olive oil, embedding smashed garlic underneath the skin."
  ],
  "chefNote": "Cooking is an act of joyful resonance. Let the bright acidity of this dish carry the melody of your celebration."
}
```
*Note: The FastAPI endpoint natively strips Markdown code blocks (```json) returned by the raw textual models dynamically in order to protect and supply pure JSON payload structures directly into the React App state.*
