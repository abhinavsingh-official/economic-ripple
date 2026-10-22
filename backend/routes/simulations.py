from fastapi import APIRouter
from datetime import datetime
import uuid

from backend.models.request_models import SimulationRequest
from backend.models.response_models import SimulationResponse

from backend.services.simulation_service import run_simulation
from backend.utils.data_loader import init_states
from backend.core.cache import df_data, A
from backend.core.constants import VARIABLES

router = APIRouter()


@router.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):

    run_id = str(uuid.uuid4())

    initial_states = init_states(df_data, request.countries, VARIABLES)

    # IMPORTANT: normalize timeline format
    # ensures Dict[int, List[dict]]
    raw_timeline = request.timeline or {}
    timeline = {}

    for k, v in raw_timeline.items():
        if isinstance(v, list):
            timeline[int(k)] = v
        elif isinstance(v, dict):
            timeline[int(k)] = [v]
        else:
            timeline[int(k)] = []

    config = {
        "steps": request.steps,
        "scenario": request.scenario,
        "scale": request.scale,
        "targets": request.countries,
        "manual": request.manual,
        "timeline": timeline,
        "run_id": run_id
    }

    df = run_simulation(config, A, initial_states, VARIABLES)

    return SimulationResponse(
        data=df.to_dict(orient="records"),
        countries=request.countries,
        steps=request.steps,
        run_id=run_id,
        timestamp=datetime.utcnow().isoformat(),
        scenario=request.scenario
    )