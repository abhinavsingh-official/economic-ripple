from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import simulations, scenarios, insights

app = FastAPI(title="Economic Ripple API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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