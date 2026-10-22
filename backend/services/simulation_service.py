from simulator.scenario_runner import ScenarioRunner
from backend.core.constants import DEFAULT_DAMPING, DEFAULT_NOISE


def run_simulation(config, A, initial_states, variables):
    """
    Core simulation service.
    Handles execution of system dynamics + scenario injection.
    """

    runner = ScenarioRunner(
        system_matrix=A,
        country_list=config["targets"],
        initial_states=initial_states,
        variables=variables,
        damping=config.get("damping", DEFAULT_DAMPING),
        noise_level=config.get("noise_level", DEFAULT_NOISE)
    )

    result = runner.run(config)

    # supports both return formats safely
    if isinstance(result, tuple):
        _, df = result
        return df

    return result