# simulator/explanation_pipeline.py

import numpy as np
import pandas as pd

from simulator.explanation_builder import ExplanationBuilder


class ExplanationPipeline:
    """
    Generates causal explanations using simulator output.

    Requires dataframe columns:
        <var>, <var>_system_delta, <var>_shock, <var>_noise
    """

    def __init__(self, system_matrix, variables):
        self.variables = variables
        self.builder = ExplanationBuilder(system_matrix, variables)

    def generate(self, df: pd.DataFrame, country: str):

        if "country" not in df.columns:
            raise ValueError("DataFrame must contain 'country' column")

        df_country = df[df["country"] == country].sort_values("step")

        if df_country.empty:
            raise ValueError(f"No data found for country: {country}")

        self._validate_columns(df_country)

        explanations = []

        for t in range(1, len(df_country)):

            prev_row = df_country.iloc[t - 1]
            curr_row = df_country.iloc[t]

            prev_state = self._extract_vector(prev_row, self.variables)
            curr_state = self._extract_vector(curr_row, self.variables)

            system = self._extract_vector(
                curr_row, [f"{v}_system_delta" for v in self.variables]
            )
            shock = self._extract_vector(
                curr_row, [f"{v}_shock" for v in self.variables]
            )
            noise = self._extract_vector(
                curr_row, [f"{v}_noise" for v in self.variables]
            )

            total_change = curr_state - prev_state

            self._validate_causality(
                total_change, system, shock, noise, step=int(curr_row["step"])
            )

            text = self.builder.explain_transition(
                prev_state=prev_state,
                curr_state=curr_state,
                system_change=system,
                shock=shock,
                noise=noise,
                total_change=total_change
            )

            explanations.append({
                "step": int(curr_row["step"]),
                "country": country,
                "text": text
            })

        return explanations

    def _extract_vector(self, row, cols):
        return np.array([row[c] for c in cols], dtype=float)

    def _validate_columns(self, df):
        required = []

        for v in self.variables:
            required.extend([
                v,
                f"{v}_system_delta",
                f"{v}_shock",
                f"{v}_noise"
            ])

        missing = [c for c in required if c not in df.columns]

        if missing:
            raise ValueError(f"Missing required columns: {missing[:10]}")

    def _validate_causality(self, delta, system, shock, noise, step):

        reconstructed = system + shock + noise
        error = np.linalg.norm(delta - reconstructed)

        if error > 1e-6:
            print(f"\n[WARNING] Causal mismatch at step {step}")
            print(f"Error magnitude: {error:.6f}")