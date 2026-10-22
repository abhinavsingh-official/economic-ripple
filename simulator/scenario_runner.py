import numpy as np
from typing import Dict, List

from simulator.world_simulator import WorldSimulator
from simulator.results_store import ResultsStore
from simulator.manual_controls import ManualControls
from shock_engine.shock_scenarios import ShockScenarios, ShockScenario


class ScenarioRunner:
    """
    Unified runner with:
    - config-based execution
    - scenario + manual controls
    - timeline support (dynamic shocks)
    """

    def __init__(
        self,
        system_matrix: np.ndarray,
        country_list: List[str],
        initial_states: Dict[str, np.ndarray],
        variables: List[str],
        damping: float = 0.0,
        noise_level: float = 0.0
    ):

        self.variables = variables

        self.simulator = WorldSimulator(
            system_matrix=system_matrix,
            country_list=country_list,
            initial_states=initial_states,
            damping=damping,
            noise_level=noise_level
        )

        self.store = ResultsStore()
        self.manual = ManualControls(variables)

        # central scenario registry
        self.scenario_map = {
            "recession": ShockScenarios.recession(),
            "boom": ShockScenarios.boom(),
            "stagflation": ShockScenarios.stagflation(),
            "social_crisis": ShockScenarios.social_crisis(),
            "recovery": ShockScenarios.recovery()
        }

    # =========================================================
    # VALIDATION
    # =========================================================
    def _validate_config(self, config: dict):

        if "steps" not in config:
            raise ValueError("Config must include 'steps'")

        if config.get("scenario") and config["scenario"] not in self.scenario_map:
            raise ValueError(f"Invalid scenario: {config['scenario']}")

    # =========================================================
    # SCENARIO → VECTOR
    # =========================================================
    def _scenario_to_vector(self, scenario: ShockScenario, scale: float):

        vec = np.zeros(len(self.variables))

        for i, var in enumerate(self.variables):
            vec[i] = scenario.shocks.get(var, 0.0)

        return vec * scale

    # =========================================================
    # SHOCK FUNCTION (CORE ENGINE)
    # =========================================================
    def _build_shock_fn(self, config: dict):

        base_scenario_name = config.get("scenario")
        base_manual = config.get("manual", {})
        scale = config.get("scale", 1.0)
        targets = config.get("targets", None)

        # IMPORTANT FIX: must be Dict[int, List[dict]]
        timeline = config.get("timeline", {})

        base_scenario = None
        base_vec = np.zeros(len(self.variables))

        # --- base scenario ---
        if base_scenario_name:
            base_scenario = self.scenario_map[base_scenario_name]
            base_vec = self._scenario_to_vector(base_scenario, scale)

        def shock_fn(t, country, state):

            shock = np.zeros(len(self.variables))

            # =====================================================
            # BASE SCENARIO
            # =====================================================
            if base_scenario:
                if targets is None or country in targets:
                    decay = base_scenario.persistence ** t
                    shock += base_vec * decay

            # =====================================================
            # BASE MANUAL
            # =====================================================
            if base_manual:
                shock += self.manual.build_shock(base_manual)

            # =====================================================
            # TIMELINE EVENTS (FIXED STRUCTURE)
            # =====================================================
            if t in timeline:

                events = timeline[t]

                # safety: ensure list
                if isinstance(events, dict):
                    events = [events]

                for event in events:

                    event_scale = event.get("scale", 1.0)
                    event_targets = event.get("targets", targets)

                    # --- scenario event ---
                    if "scenario" in event:
                        sc_name = event["scenario"]

                        if sc_name not in self.scenario_map:
                            raise ValueError(
                                f"Unknown scenario in timeline: {sc_name}"
                            )

                        sc = self.scenario_map[sc_name]
                        vec = self._scenario_to_vector(sc, event_scale)

                        if event_targets is None or country in event_targets:
                            shock += vec

                    # --- manual event ---
                    if "manual" in event:
                        shock += self.manual.build_shock(event["manual"])

            return shock

        return shock_fn

    # =========================================================
    # MAIN RUN (ONLY ENTRYPOINT)
    # =========================================================
    def run(self, config: dict):

        self._validate_config(config)

        steps = config.get("steps", 10)
        run_name = config.get("run_name", "run")
        metadata = config.get("metadata", {})

        shock_fn = self._build_shock_fn(config)

        df = self.simulator.run(steps, shock_fn=shock_fn)

        # enrich metadata automatically
        metadata.update({
            "scenario": config.get("scenario"),
            "has_manual": bool(config.get("manual")),
            "has_timeline": bool(config.get("timeline"))
        })

        path = self.store.save_run(
            run_name=run_name,
            df=df,
            metadata=metadata
        )

        return path, df

    # =========================================================
    # CLEAN HELPERS (UI FRIENDLY)
    # =========================================================
    def run_scenario(self, scenario_name: str, steps: int = 10):

        return self.run({
            "scenario": scenario_name,
            "steps": steps,
            "run_name": f"{scenario_name}_run"
        })

    def run_manual(self, manual_config: dict, steps: int = 10):

        return self.run({
            "manual": manual_config,
            "steps": steps,
            "run_name": "manual_run"
        })