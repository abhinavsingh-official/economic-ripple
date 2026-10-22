from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class SimulationResponse(BaseModel):
    data: List[Dict[str, Any]]

    # essential frontend metadata
    run_id: str
    steps: int
    countries: List[str]
    scenario: Optional[str] = None
    timestamp: Optional[str] = None


class InsightResponse(BaseModel):
    top_changes: Dict[str, Any]
    cause_breakdown: Dict[str, Any]
    dominant_drivers: Dict[str, Any]


class ExplanationResponse(BaseModel):
    explanations: List[Dict[str, Any]]