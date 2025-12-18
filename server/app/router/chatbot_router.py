from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.db import db_manager
from app.modules.module.messages_module import MessageModel
from app.modules.chatbot_module import chat_service

router = APIRouter()

class ChatRouter:
    @staticmethod
    @router.websocket("/chat/{session_id}")
    async def websocket_endpoint(websocket: WebSocket, session_id: str):
        await websocket.accept()
        
        db = next(db_manager.get_session())

        print("chat route hitted and db establised")
        try:
            while True:
                data = await websocket.receive_text()
                response = await chat_service.process_message(db, session_id, data)
                await websocket.send_text(response)
        except WebSocketDisconnect:
            print(f"Client {session_id} disconnected")
        except Exception as e:
            await websocket.send_text(f"Connection Error: {str(e)}")
        finally:
            db.close()

    @staticmethod
    @router.get("/message-list/{session_id}")
    async def get_messages(session_id: str, db: Session = Depends(db_manager.get_session)):
        try:
            return db.query(MessageModel).filter(MessageModel.session_id == session_id).all()
        except Exception as e:
            return {"error": str(e)}