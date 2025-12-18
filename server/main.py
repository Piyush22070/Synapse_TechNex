from fastapi import FastAPI
from app.router.chatbot_router import router as chatbot_router
import uvicorn
import os

app = FastAPI(title="Secure Modular Chatbot")
app.include_router(chatbot_router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)