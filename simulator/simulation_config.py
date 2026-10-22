from dataclasses import dataclass, field
from typing import List, Dict, Any, Tuple


@dataclass
class SimulationConfig:
    """
    Central configuration for full EconomicRipple simulation system.
    Single source of truth for variables + simulation behavior.
    """

    # =========================================================
    # CORE SIMULATION SETTINGS
    # =========================================================
    steps: int = 10
    damping: float = 0.0
    noise_level: float = 0.0

    # =========================================================
    # VARIABLE SYSTEM (SINGLE SOURCE OF TRUTH)
    # =========================================================
    variables: List[str] = field(default_factory=lambda: [
        "depression_prev",
        "gdp_growth",
        "inflation",
        "unemployment_rate",
        "poverty_rate",
        "urbanization",
        "homicide_rate"
    ])

    # =========================================================
    # STABILITY CONTROLS
    # =========================================================
    clip_values: bool = False
    clip_range: Tuple[float, float] = (-5.0, 5.0)
    normalize_state: bool = False

    # =========================================================
    # SHOCK ENGINE SETTINGS
    # =========================================================
    shock_scale: float = 1.0
    allow_multiple_shocks: bool = True

    # =========================================================
    # OUTPUT CONTROL
    # =========================================================
    store_history: bool = True
    export_format: str = "csv"

    # =========================================================
    # REPRODUCIBILITY
    # =========================================================
    random_seed: int = 42

    # =========================================================
    # META (FOR DASHBOARD + EXPLANATION LAYER)
    # =========================================================
    scenario_name: str = "default"
    description: str = "Base simulation run"

    # =========================================================
    # VALIDATION
    # =========================================================
    def validate(self):
        if self.steps <= 0:
            raise ValueError("steps must be > 0")

        if not (0.0 <= self.damping <= 1.0):
            raise ValueError("damping must be between 0 and 1")

        if self.noise_level < 0:
            raise ValueError("noise_level must be >= 0")

        if len(self.variables) == 0:
            raise ValueError("variables cannot be empty")

        if self.shock_scale <= 0:
            raise ValueError("shock_scale must be > 0")

    # =========================================================
    # SERIALIZATION
    # =========================================================
    def as_dict(self) -> Dict[str, Any]:
        return {
            "steps": self.steps,
            "damping": self.damping,
            "noise_level": self.noise_level,
            "variables": self.variables,
            "clip_values": self.clip_values,
            "clip_range": self.clip_range,
            "normalize_state": self.normalize_state,
            "shock_scale": self.shock_scale,
            "allow_multiple_shocks": self.allow_multiple_shocks,
            "store_history": self.store_history,
            "export_format": self.export_format,
            "random_seed": self.random_seed,
            "scenario_name": self.scenario_name,
            "description": self.description
        }