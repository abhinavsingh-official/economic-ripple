import numpy as np
from typing import List
from shock_engine.shock_scenarios import ShockScenario


class ShockGenerator:
    """
    Converts structured economic scenarios into
    structured shock vectors aligned with system state.
    """

    def __init__(self, noise_level: float = 0.0, seed: int = None):

        self.noise_level = noise_level
        self.rng = np.random.default_rng(seed)

        # MUST match system model order exactly
        self.state_order = [
            "depression_prev",
            "gdp_growth",
            "inflation",
            "unemployment_rate",
            "poverty_rate",
            "urbanization",
            "homicide_rate"
        ]

    # =========================================================
    # CORE GENERATION
    # =========================================================
    def generate(self, scenario: ShockScenario) -> np.ndarray:

        if not hasattr(scenario, "shocks"):
            raise ValueError("Scenario must contain 'shocks' dictionary")

        base_shocks = scenario.shocks
        shock_vector = []

        for var in self.state_order:

            value = float(base_shocks.get(var, 0.0))

            if self.noise_level > 0:
                value += self._noise(value)

            shock_vector.append(value)

        return np.array(shock_vector, dtype=float)

    # =========================================================
    # SCALING
    # =========================================================
    def apply_scaling(self, shock_vector: np.ndarray, scale: float = 1.0):

        shock_vector = np.asarray(shock_vector, dtype=float)
        return shock_vector * scale

    # =========================================================
    # MONTE CARLO SHOCKS
    # =========================================================
    def generate_multiple(self, scenario: ShockScenario, n: int = 10):

        return [self.generate(scenario) for _ in range(n)]

    # =========================================================
    # INTERNAL NOISE MODEL
    # =========================================================
    def _noise(self, value: float):

        # additive noise (NOT multiplicative → avoids bias explosion)
        std = self.noise_level

        return self.rng.normal(0, std)