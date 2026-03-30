import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

OXLO_API_KEY = os.getenv("OXLO_API_KEY")
OXLO_BASE_URL = os.getenv("OXLO_BASE_URL", "https://api.oxlo.ai/v1")

async def test_models():
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{OXLO_BASE_URL}/models",
            headers={"Authorization": f"Bearer {OXLO_API_KEY}"}
        )
        data = r.json()
        models = [m["id"] for m in data.get("data", [])]
        print("MODELS:", models)

if __name__ == "__main__":
    asyncio.run(test_models())
