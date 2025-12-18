from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.modules.prediction_module import predict_service

predict_router = APIRouter()

class FundPredictRequest(BaseModel):
    scheme_name: str
    min_sip: float
    min_lumpsum: float
    expense_ratio: float
    fund_size_cr: float
    fund_age_yr: int
    fund_manager: str
    sortino: str
    alpha: str
    sd: str
    beta: str
    sharpe: str
    risk_level: int
    amc_name: str
    rating: int
    category: str
    sub_category: str
    scheme_code: int

@predict_router.post("/predict-returns")
async def predict_fund_returns(request: FundPredictRequest):
    fund_context = request.dict()
    
    result = await predict_service.get_predictions(fund_context)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result