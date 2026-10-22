import pandas as pd
from typing import Dict, Any, Optional
import os


class ResultsStore:
    """
    Central storage layer for all simulation outputs.

    Ensures:
    - consistent schema storage
    - reproducibility
    - UI + causal compatibility
    """

    def __init__(self, base_path: str = "data/processed/simulator_outputs"):
        self.base_path = base_path
        os.makedirs(self.base_path, exist_ok=True)

        self.runs = []

    # =========================================================
    # VALIDATION
    # =========================================================
    def _validate_df(self, df: pd.DataFrame):
        required_cols = {"step", "country"}

        if not required_cols.issubset(df.columns):
            raise ValueError(f"Missing required columns: {required_cols}")

        if df.isnull().any().any():
            raise ValueError("DataFrame contains NaN values")

    # =========================================================
    # STORE RUN
    # =========================================================
    def save_run(
        self,
        run_name: str,
        df: pd.DataFrame,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self._validate_df(df)

        file_path = os.path.join(self.base_path, f"{run_name}.csv")
        df.to_csv(file_path, index=False)

        record = {
            "run_name": run_name,
            "file_path": file_path,
            "rows": len(df),
            "metadata": metadata or {}
        }

        self.runs.append(record)

        return file_path

    # =========================================================
    # LOAD RUN
    # =========================================================
    def load_run(self, run_name: str) -> pd.DataFrame:
        file_path = os.path.join(self.base_path, f"{run_name}.csv")
        return pd.read_csv(file_path)

    # =========================================================
    # COMPARE RUNS
    # =========================================================
    def compare_runs(self, run_names: list):
        dfs = []

        for name in run_names:
            df = self.load_run(name)
            df["run_name"] = name
            dfs.append(df)

        return pd.concat(dfs, ignore_index=True)

    # =========================================================
    # COUNTRY VIEW
    # =========================================================
    def get_country_series(self, run_name: str, country: str):
        df = self.load_run(run_name)
        return df[df["country"] == country]

    # =========================================================
    # SUMMARY STATS
    # =========================================================
    def summarize_run(self, run_name: str):
        df = self.load_run(run_name)

        numeric_cols = df.select_dtypes(include="number").columns

        return {
            "run_name": run_name,
            "steps": df["step"].nunique(),
            "countries": df["country"].nunique(),
            "feature_means": df[numeric_cols].mean().to_dict(),
            "feature_std": df[numeric_cols].std().to_dict()
        }

    # =========================================================
    # UI EXPORT
    # =========================================================
    def export_latest_for_ui(
        self,
        run_name: str,
        output_name: str = "latest_ui_data.csv"
    ):
        df = self.load_run(run_name)

        ui_path = os.path.join(self.base_path, output_name)
        df.to_csv(ui_path, index=False)

        return ui_path

    # =========================================================
    # INTEGRATION HOOK (IMPORTANT FOR NEXT PHASE)
    # =========================================================
    def attach_causal_metadata(self, run_name: str, causal_info: Dict[str, Any]):
        """
        Placeholder hook for causal engine integration.
        Will later store:
        - variable influence breakdown
        - shock attribution
        - explanation traces
        """
        for run in self.runs:
            if run["run_name"] == run_name:
                run["causal_metadata"] = causal_info
                break