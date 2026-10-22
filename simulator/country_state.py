import numpy as np
from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class CountryState:
    """
    Represents economic state of a country at a timestep.
    Vector-based internal representation with safe validation.
    """

    region: str
    vector: np.ndarray
    variables: List[str] = field(default_factory=lambda: [
        "depression_prev",
        "gdp_growth",
        "inflation",
        "unemployment_rate",
        "poverty_rate",
        "urbanization",
        "homicide_rate"
    ])

    def __post_init__(self):
        self.vector = np.asarray(self.vector, dtype=float)
        self._validate()

    def _validate(self):
        if len(self.vector) != len(self.variables):
            raise ValueError(
                f"Vector size mismatch: expected {len(self.variables)}, got {len(self.vector)}"
            )

        if not np.all(np.isfinite(self.vector)):
            raise ValueError("State vector contains NaN or infinite values")

    def as_dict(self) -> Dict[str, float]:
        return {
            self.variables[i]: float(self.vector[i])
            for i in range(len(self.vector))
        }

    def copy(self):
        return CountryState(
            region=self.region,
            vector=self.vector.copy(),
            variables=self.variables.copy()
        )

    def update(self, new_vector: np.ndarray):
        new_vector = np.asarray(new_vector, dtype=float)

        if len(new_vector) != len(self.variables):
            raise ValueError("Update vector has incorrect dimension")

        if not np.all(np.isfinite(new_vector)):
            raise ValueError("Invalid values in update vector")

        self.vector = new_vector