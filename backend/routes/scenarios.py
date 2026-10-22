from fastapi import APIRouter
from backend.services.scenario_service import get_scenarios

router = APIRouter()


@router.get("/")
def scenarios():
    return get_scenarios()