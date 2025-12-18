from fastapi import APIRouter, FastAPI
from app.router.chatbot_router import router as chatbot_router
from app.router.mutualfund_list_router import router as get_top_schemes
from app.router.asset_chat_router import asset_router as asset_chat_endpoint
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os


app = FastAPI(title="Secure Modular Sarthi")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# chatbot Route
app.include_router(chatbot_router)

# mutual Funds list
app.include_router(get_top_schemes)


app.include_router(asset_chat_endpoint)



if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)