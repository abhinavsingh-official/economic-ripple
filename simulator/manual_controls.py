import numpy as np
from typing import Dict


class ManualControls:
    """
    User-driven control engine.

    Allows:
    - increasing/decreasing variables
    - country-specific overrides
    - step-based interventions
    """

    def __init__(self, variables):
        self.variables = variables
        self.var_index = {v: i for i, v in enumerate(variables)}

    # =========================================================
    # BUILD SHOCK VECTOR
    # =========================================================
    def build_shock(self, control_dict: Dict[str, float]) -> np.ndarray:
        """
        Example:
            {"gdp_growth": 0.5, "inflation": -0.2}
        """
        shock = np.zeros(len(self.variables))

        for var, val in control_dict.items():
            if var not in self.var_index:
                raise ValueError(f"Unknown variable: {var}")

            shock[self.var_index[var]] = val

        return shock

    # =========================================================
    # SHOCK FUNCTION GENERATOR (FOR SIMULATOR)
    # =========================================================
    def get_shock_fn(self, controls_by_step: Dict[int, Dict[str, Dict[str, float]]]):
        """
        controls_by_step format:

        {
            step: {
                country: {
                    var: value
                }
            }
        }

        Example:
        {
            5: {
                "India": {"gdp_growth": -0.5},
                "Sweden": {"inflation": 0.2}
            }
        }
        """

        def shock_fn(t, country, state):
            if t in controls_by_step and country in controls_by_step[t]:
                return self.build_shock(controls_by_step[t][country])

            return np.zeros(len(self.variables))

        return shock_fn