from shock_engine.shock_scenarios import ShockScenarios


def get_scenarios():
    return {
        "recession": ShockScenarios.recession(),
        "boom": ShockScenarios.boom(),
        "stagflation": ShockScenarios.stagflation(),
        "social_crisis": ShockScenarios.social_crisis(),
        "recovery": ShockScenarios.recovery()
    }