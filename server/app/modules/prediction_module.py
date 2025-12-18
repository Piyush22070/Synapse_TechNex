import httpx
from typing import Dict, Any

class PredictService:
    def __init__(self):
        self.api_url = "https://pred-mod-776087882401.europe-west1.run.app/predict"

    async def get_predictions(self, fund_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calls the external ML API and merges the prediction results with the original data.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, json=fund_data, timeout=30.0)
                response.raise_for_status()
                
                predictions = response.json()
                
                result = {**fund_data, **predictions}
                return result

        except httpx.HTTPStatusError as e:
            return {"error": f"ML API Error: {e.response.status_code}", "details": e.response.text}
        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}

predict_service = PredictService()