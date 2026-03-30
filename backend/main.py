import os
import json
import httpx
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecipeRequest(BaseModel):
    mood: str
    mood_desc: str
    ingredients: str = "None specified"
    dietary: str = "None"

OXLO_API_KEY = os.getenv("OXLO_API_KEY")
OXLO_BASE_URL = os.getenv("OXLO_BASE_URL", "https://api.oxlo.ai/v1")

@app.post("/api/recipe")
async def get_recipe(request: RecipeRequest):
    if not OXLO_API_KEY:
        raise HTTPException(status_code=500, detail="OXLO_API_KEY is not configured.")

    system_prompt = (
        "You are an elite private chef with a deep understanding of psychology and the emotional power of food. "
        "Always respond ONLY with a valid JSON object — no markdown, no preamble, no extra text."
    )
    
    user_prompt = (
        f"A diner is feeling: {request.mood} ({request.mood_desc}).\n"
        f"Ingredients available: {request.ingredients or 'None specified'}.\n"
        f"Dietary preference: {request.dietary}.\n\n"
        "Create one perfect recipe for this emotional state.\n\n"
        "Return this exact JSON:\n"
        "{\n"
        "  \"title\": \"Recipe name\",\n"
        "  \"cuisine\": \"e.g. Italian\",\n"
        "  \"time\": \"e.g. 25 mins\",\n"
        "  \"difficulty\": \"Easy / Medium / Challenging\",\n"
        "  \"why\": \"One emotionally resonant sentence explaining why this dish suits the mood. Strictly under 20 words, no exceptions\",\n"
        "  \"ingredients\": [\"comprehensive ingredient list with quantity\", ...],\n"
        "  \"steps\": [\"Step 1...\", \"Step 2...\", ...],\n"
        "  \"chefNote\": \"2-3 sentence intimate poetic chef note about this dish and mood\"\n"
        "}"
    )

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{OXLO_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {OXLO_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.3-70b",  # Using a model available on Oxlo
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            
            # Strip markdown fences if present
            if content.startswith("```json"):
                content = content[len("```json"):].strip()
            if content.endswith("```"):
                content = content[:-3].strip()
            
            recipe_data = json.loads(content)
            return recipe_data
            
        except httpx.HTTPStatusError as e:
            print(f"Oxlo API Error: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail="Error from recipe generator API")
        except json.JSONDecodeError:
            print(f"Failed to parse JSON: {content}")
            raise HTTPException(status_code=500, detail="Invalid response format from Chef AI")
        except Exception as e:
            print(f"Unexpected Error: {str(e)}")
            raise HTTPException(status_code=500, detail="An unexpected error occurred")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
