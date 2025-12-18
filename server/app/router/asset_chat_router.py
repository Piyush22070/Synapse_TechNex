from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.configs.asset_db_config import asset_db_manager
from app.modules.asset_chat_service import asset_chat_service
import json

asset_router = APIRouter()

@asset_router.websocket("/asset-chat/{session_id}")
async def asset_chat_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    db = next(asset_db_manager.get_db_session())
    
    try:
        while True:
            raw_payload = await websocket.receive_text()
            payload = json.loads(raw_payload)
            
            user_msg = payload.get("text")
            context = payload.get("context")

            ai_response = await asset_chat_service.run_chat(db, session_id, user_msg, context)
            await websocket.send_text(ai_response)
            
    except WebSocketDisconnect:
        print(f"Session {session_id} disconnected")
    except Exception as e:
        await websocket.send_text(f"Router Error: {str(e)}")
    finally:
        db.close()