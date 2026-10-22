import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import simulations, scenarios, insights

app = FastAPI(title="Economic Ripple API")

_default_origins = ["http://localhost:3000"]
_extra_origins = os.environ.get("CORS_ALLOW_ORIGINS", "")
allow_origins = _default_origins + [o.strip() for o in _extra_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(simulations.router, prefix="/api")
app.include_router(scenarios.router, prefix="/api/scenarios")
app.include_router(insights.router, prefix="/api/insights")


@app.get("/")
def root():
    return {"message": "Economic Ripple Backend Running"}