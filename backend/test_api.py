import httpx
import asyncio

async def main():
    try:
        r = httpx.post("http://127.0.0.1:8000/api/recipe", json={"mood": "cozy", "mood_desc": "warm", "ingredients": "none", "dietary": "none"})
        print(f"Status 127.0.0.1: {r.status_code}")
        print(r.text[:200])
    except Exception as e:
        print("127.0.0.1 Error:", e)

    try:
        r = httpx.post("http://localhost:8000/api/recipe", json={"mood": "cozy", "mood_desc": "warm", "ingredients": "none", "dietary": "none"})
        print(f"Status localhost: {r.status_code}")
        print(r.text[:200])
    except Exception as e:
        print("localhost Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
