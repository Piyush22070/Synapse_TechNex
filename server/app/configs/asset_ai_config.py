import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class AssetChatConfig:
    API_KEY = os.getenv("GEMINI_API_KEY")
    print(API_KEY)
    MODEL_NAME = 'gemini-2.5-flash' 
    MAX_HISTORY = 10 
    
    SYSTEM_PROMPT = """
    You are 'SAMPATTAI Sarthi', a specialized financial advisor for Indian investors.
    The user will provide specific Mutual Fund data in JSON format. 
    Use the provided metrics (Returns, Beta, Sharpe, Risk Level) to give factual, empathetic advice.
    Focus on risk-adjusted stability and explain complex terms simply.
    Always include the disclaimer: 'Mutual fund investments are subject to market risks'.

    give answer in short
    """

    @classmethod
    def setup_model(cls):
        genai.configure(api_key=cls.API_KEY)
        return genai.GenerativeModel(
            model_name=cls.MODEL_NAME,
            system_instruction=cls.SYSTEM_PROMPT
        )

ASSET_AI_MODEL = AssetChatConfig.setup_model()