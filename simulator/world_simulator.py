# simulator/world_simulator.py

import numpy as np
import pandas as pd

from shock_engine.shock_applier import ShockApplier
from shock_engine.shock_generator import ShockGenerator
from simulator.country_state import CountryState


class WorldSimulator:

    def __init__(
        self,
        system_matrix,
        country_list,
        initial_states,
        damping=0.0,
        noise_level=0.0,
        clip_bounds=(-5, 5),
        seed=None
    ):

        self.countries = country_list

        self.state = {
            country: CountryState(
                region=country,
                vector=np.array(initial_states[country], dtype=float)
            )
            for country in country_list
        }

        self.A = np.asarray(system_matrix, dtype=float)
        self.I = np.eye(self.A.shape[0])

        self.applier = ShockApplier(system_matrix)

        self.damping = damping
        self.generator = ShockGenerator(noise_level=noise_level)

        self.clip_bounds = clip_bounds
        self.rng = np.random.default_rng(seed)

        self.history = []

        self.variables = [
            "depression_prev",
            "gdp_growth",
            "inflation",
            "unemployment_rate",
            "poverty_rate",
            "urbanization",
            "homicide_rate"
        ]

        self.n_vars = len(self.variables)

        self._last_shocks = {}
        self._last_noise = {}
        self._last_system_delta = {}
        self._last_prev_state = {}

    def step(self, shocks_by_country):

        new_state = {}

        self._last_shocks = {}
        self._last_noise = {}
        self._last_system_delta = {}
        self._last_prev_state = {}

        for country in self.countries:

            prev = self.state[country].vector.copy()

            shock = shocks_by_country.get(country, np.zeros(self.n_vars))
            shock = self._validate_shock(shock)

            noise = self._noise_vector()

            system_delta = (self.A - self.I) @ prev

            if self.damping > 0:
                system_delta = (1 - self.damping) * system_delta

            next_state = prev + system_delta + shock + noise
            next_state = self._stabilize(next_state)

            self._last_prev_state[country] = prev
            self._last_shocks[country] = shock
            self._last_noise[country] = noise
            self._last_system_delta[country] = system_delta

            new_state[country] = CountryState(
                region=country,
                vector=next_state
            )

        self.state = new_state

    def run(self, steps, shock_fn=None):

        for t in range(steps):

            shocks = {}

            for country in self.countries:
                state = self.state[country].vector

                if shock_fn:
                    shock = shock_fn(t, country, state)
                else:
                    shock = np.zeros(self.n_vars)

                shocks[country] = shock

            self.step(shocks)
            self._log(t)

        return self.to_dataframe()

    def _noise_vector(self):
        return self.rng.normal(
            0,
            self.generator.noise_level,
            self.n_vars
        )

    def _validate_shock(self, shock):
        shock = np.asarray(shock)

        if shock.shape[0] != self.n_vars:
            raise ValueError(
                f"Shock dimension mismatch: expected {self.n_vars}, got {shock.shape[0]}"
            )

        return shock

    def _stabilize(self, vector):

        vector = np.nan_to_num(vector, nan=0.0, posinf=0.0, neginf=0.0)
        low, high = self.clip_bounds
        return np.clip(vector, low, high)

    def _log(self, step):

        for country in self.countries:

            state_vec = self.state[country].vector
            prev_vec = self._last_prev_state[country]
            shock_vec = self._last_shocks[country]
            noise_vec = self._last_noise[country]
            system_vec = self._last_system_delta[country]

            row = {
                "step": step,
                "country": country
            }

            for i, var in enumerate(self.variables):
                row[var] = float(state_vec[i])

                row[f"{var}_delta"] = float(state_vec[i] - prev_vec[i])
                row[f"{var}_system_delta"] = float(system_vec[i])
                row[f"{var}_shock"] = float(shock_vec[i])
                row[f"{var}_noise"] = float(noise_vec[i])

            self.history.append(row)

    def to_dataframe(self):
        return pd.DataFrame(self.history)

    def get_country_trajectory(self, country):
        df = self.to_dataframe()
        return df[df["country"] == country]