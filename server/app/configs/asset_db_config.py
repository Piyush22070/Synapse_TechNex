from sqlalchemy import Column, Integer, String, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

AssetBase = declarative_base()

class AssetMessage(AssetBase):
    __tablename__ = "asset_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    role = Column(String)  
    content = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AssetDatabaseManager:
    def __init__(self, db_url="sqlite:///./asset_history.db"):
        self.engine = create_engine(db_url, connect_args={"check_same_thread": False})
        self.SessionLocal = sessionmaker(bind=self.engine)
        AssetBase.metadata.create_all(bind=self.engine)

    def get_db_session(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

asset_db_manager = AssetDatabaseManager()