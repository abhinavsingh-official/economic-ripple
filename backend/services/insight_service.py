from simulator.insight_engine import InsightEngine
from backend.core.constants import VARIABLES

_engine = InsightEngine(VARIABLES)


def generate_insights(df, country):
    """
    Extracts structured insights from simulation output.
    """
    return _engine.analyze(df, country)