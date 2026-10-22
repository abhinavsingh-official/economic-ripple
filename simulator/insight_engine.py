import numpy as np
import pandas as pd


class InsightEngine:
    """
    Extracts high-level insights from simulation output.

    Outputs:
    - top impacted variables
    - dominant causes (system vs shock vs noise)
    - strongest drivers across time
    """

    def __init__(self, variables):
        self.variables = variables

    # =========================================================
    # MAIN ENTRY
    # =========================================================
    def analyze(self, df: pd.DataFrame, country: str):

        df = df[df["country"] == country].sort_values("step")

        results = {
            "top_changes": self._top_changes(df),
            "cause_breakdown": self._cause_breakdown(df),
            "dominant_drivers": self._dominant_drivers(df)
        }

        return results

    # =========================================================
    # 1. WHAT CHANGED MOST
    # =========================================================
    def _top_changes(self, df):

        change_scores = {}

        for v in self.variables:
            change_scores[v] = df[f"{v}_delta"].abs().sum()

        sorted_vars = sorted(change_scores.items(), key=lambda x: -x[1])

        return sorted_vars[:5]

    # =========================================================
    # 2. WHAT CAUSED CHANGES
    # =========================================================
    def _cause_breakdown(self, df):

        system_total = 0
        shock_total = 0
        noise_total = 0

        for v in self.variables:
            system_total += df[f"{v}_system_delta"].abs().sum()
            shock_total += df[f"{v}_shock"].abs().sum()
            noise_total += df[f"{v}_noise"].abs().sum()

        total = system_total + shock_total + noise_total + 1e-8

        return {
            "system": system_total / total,
            "shock": shock_total / total,
            "noise": noise_total / total
        }

    # =========================================================
    # 3. DOMINANT VARIABLES OVER TIME
    # =========================================================
    def _dominant_drivers(self, df):

        influence = {v: 0 for v in self.variables}

        for v in self.variables:
            influence[v] += df[f"{v}_system_delta"].abs().sum()

        sorted_inf = sorted(influence.items(), key=lambda x: -x[1])

        return sorted_inf[:5]