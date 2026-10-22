from simulator.explanation_pipeline import ExplanationPipeline
from backend.core.cache import A_df
from backend.core.constants import VARIABLES

# cache pipeline once (important for performance)
_pipeline = ExplanationPipeline(A_df.values, VARIABLES)


def generate_explanations(df, country):
    """
    Generates step-by-step causal explanations for a given country simulation.
    """
    return _pipeline.generate(df, country)