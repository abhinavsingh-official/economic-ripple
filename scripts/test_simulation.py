import numpy as np
import pandas as pd
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from simulator.scenario_runner import ScenarioRunner
from simulator.explanation_pipeline import ExplanationPipeline
from simulator.insight_engine import InsightEngine
from simulator.plot_engine import PlotEngine

# =========================================================
# VARIABLES
# =========================================================
variables = [
    "depression_prev",
    "gdp_growth",
    "inflation",
    "unemployment_rate",
    "poverty_rate",
    "urbanization",
    "homicide_rate"
]


# =========================================================
# LOAD DATA
# =========================================================
DATA_PATH = "data/processed/model_training/model_v5_predictions.csv"
df_data = pd.read_csv(DATA_PATH)

countries = ["India", "Sweden"]

initial_states = {}

for country in countries:
    subset = df_data[df_data["region"] == country]

    if subset.empty:
        raise ValueError(f"No data found for {country}")

    row = subset.sort_values("year").iloc[-1]
    initial_states[country] = row[variables].values.astype(float)


# =========================================================
# LOAD MATRIX
# =========================================================
MATRIX_PATH = "data/processed/model_training/system_matrix_v4.csv"

A_df = pd.read_csv(MATRIX_PATH, index_col=0)
A_df = A_df.loc[variables, variables]
A = A_df.values.astype(float)


# =========================================================
# STABILITY CHECK
# =========================================================
eigvals = np.linalg.eigvals(A)

print("\n--- MATRIX STABILITY CHECK ---")
print("Max |eigenvalue|:", np.max(np.abs(eigvals)))


# =========================================================
# CREATE RUNNER
# =========================================================
runner = ScenarioRunner(
    system_matrix=A,
    country_list=countries,
    initial_states=initial_states,
    variables=variables,
    damping=0.01,
    noise_level=0.02
)


# =========================================================
# RUN 1: SCENARIO (CONFIG BASED)
# =========================================================
print("\n--- RUN: RECESSION SCENARIO ---")

config_scenario = {
    "scenario": "recession",
    "scale": 1.0,
    "steps": 10,
    "run_name": "recession_run"
}

_, df_scenario = runner.run(config_scenario)


# =========================================================
# RUN 2: MANUAL CONTROL
# =========================================================
print("\n--- RUN: MANUAL CONTROL ---")

config_manual = {
    "manual": {
        "gdp_growth": -0.4,
        "unemployment_rate": 0.3
    },
    "steps": 10,
    "run_name": "manual_run"
}

_, df_manual = runner.run(config_manual)


# =========================================================
# RUN 3: COMBINED (SCENARIO + POLICY + TIMELINE)
# =========================================================
print("\n--- RUN: COMBINED (RECESSION + POLICY + TIMELINE) ---")

config_combined = {
    "scenario": "recession",
    "scale": 0.8,
    "targets": ["India"],

    "manual": {
        "gdp_growth": 0.3
    },

    "timeline": {
        5: {"scenario": "boom"},  # recovery event
        8: {"manual": {"unemployment_rate": -0.3}}  # policy correction
    },

    "steps": 10,
    "run_name": "combined_run"
}

_, df_combined = runner.run(config_combined)


# =========================================================
# EXPLANATIONS
# =========================================================
pipeline = ExplanationPipeline(A, variables)

explanations = pipeline.generate(df_scenario, "India")

print("\n--- SAMPLE EXPLANATIONS ---")

for step_data in explanations[:3]:
    print(f"\nStep {step_data['step']}:")
    for line in step_data["text"]:
        print("  •", line)


# =========================================================
# QUICK CHECK
# =========================================================
print("\n--- OUTPUT SAMPLE ---")
print(df_scenario.head())
print("\n--- INSIGHTS (INDIA) ---")

engine = InsightEngine(variables)

insights = engine.analyze(df_scenario, "India")

print("\nTop Changes:")
for v, val in insights["top_changes"]:
    print(f"  {v}: {val:.3f}")

print("\nCause Breakdown:")
for k, v in insights["cause_breakdown"].items():
    print(f"  {k}: {v:.2%}")

print("\nDominant Drivers:")
for v, val in insights["dominant_drivers"]:
    print(f"  {v}: {val:.3f}")

plotter = PlotEngine(variables)

print("\n--- PLOTS ---")

plotter.plot_variable(df_scenario, "India", "gdp_growth")
plotter.plot_multiple(df_scenario, "India", ["gdp_growth", "inflation", "unemployment_rate"])
plotter.plot_decomposition(df_scenario, "India", "gdp_growth")
plotter.compare_countries(df_scenario, "gdp_growth")