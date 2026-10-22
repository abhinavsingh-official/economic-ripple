from pydantic import BaseModel
from typing import List, Dict, Optional


class SimulationRequest(BaseModel):
    countries: List[str]
    steps: int
    scenario: Optional[str] = None
    scale: float = 1.0

    manual: Dict[str, float] = {}

    # step -> event definition
    timeline: Optional[Dict[int, List[dict]]] = None