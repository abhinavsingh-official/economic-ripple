from fastapi import APIRouter
from backend.services.insight_service import generate_insights
from backend.models.response_models import InsightResponse

router = APIRouter()


@router.post("/", response_model=InsightResponse)
def insights(data: dict):
    return generate_insights(data)