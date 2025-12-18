from app.configs.llmapi_config import AI_MODEL, ChatConfig
from app.modules.module.messages_module import MessageModel
from sqlalchemy.orm import Session

class ChatService:
    def __init__(self):
        self.active_memory = {}

    def _get_history(self, session_id: str):
        if session_id not in self.active_memory:
            self.active_memory[session_id] = []
        return self.active_memory[session_id]

    async def process_message(self, db: Session, session_id: str, text: str) -> str:
        try:
            history = self._get_history(session_id)
            
            # Save User Input
            history.append({"role": "user", "parts": [text]})
            db.add(MessageModel(session_id=session_id, role="user", content=text))
            db.commit()

            # Maintain Sliding Window
            if len(history) > ChatConfig.MAX_HISTORY:
                history.pop(0)

            # AI Call with Error Handling
            chat_session = AI_MODEL.start_chat(history=history[:-1])
            response = chat_session.send_message(text)
            bot_text = response.text

            # Save Bot Response
            history.append({"role": "model", "parts": [bot_text]})
            db.add(MessageModel(session_id=session_id, role="model", content=bot_text))
            db.commit()

            print("Sucess with ChatBot module")

            return bot_text

        except Exception as e:
            db.rollback()
            return f"Service Error: {str(e)}"

chat_service = ChatService()