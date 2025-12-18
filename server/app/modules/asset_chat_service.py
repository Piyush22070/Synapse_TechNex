import json
from app.configs.asset_ai_config import ASSET_AI_MODEL, AssetChatConfig
from app.configs.asset_db_config import AssetMessage
from sqlalchemy.orm import Session

class AssetChatService:
    def __init__(self):
        self.memory_store = {}

    def _get_local_history(self, session_id: str):
        if session_id not in self.memory_store:
            self.memory_store[session_id] = []
        return self.memory_store[session_id]

    async def run_chat(self, db: Session, session_id: str, user_text: str, fund_context: dict = None) -> str:
        try:
            history = self._get_local_history(session_id)
            
            # Inject Context if session is new
            if fund_context and not history:
                ctx_msg = f"CONTEXT DATA: {json.dumps(fund_context)}"
                history.append({"role": "user", "parts": [f"System context for this session: {ctx_msg}"]})

            # Save User message to DB and Memory
            history.append({"role": "user", "parts": [user_text]})
            db.add(AssetMessage(session_id=session_id, role="user", content=user_text))

            # SLIDING WINDOW: Remove oldest message from DB if over limit
            count = db.query(AssetMessage).filter(AssetMessage.session_id == session_id).count()
            if count >= AssetChatConfig.MAX_HISTORY:
                oldest = db.query(AssetMessage).filter(AssetMessage.session_id == session_id).order_by(AssetMessage.id.asc()).first()
                db.delete(oldest)

            # AI Logic
            chat = ASSET_AI_MODEL.start_chat(history=history[:-1])
            response = chat.send_message(user_text)
            bot_reply = response.text

            # Save Bot reply to DB and Memory
            history.append({"role": "model", "parts": [bot_reply]})
            db.add(AssetMessage(session_id=session_id, role="model", content=bot_reply))
            
            # Keep memory clean
            if len(history) > AssetChatConfig.MAX_HISTORY:
                history.pop(0)

            db.commit()
            return bot_reply

        except Exception as e:
            db.rollback()
            return f"Error: {str(e)}"

asset_chat_service = AssetChatService()