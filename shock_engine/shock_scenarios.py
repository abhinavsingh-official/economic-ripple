from dataclasses import dataclass
from typing import Dict, List


# =========================================================
# CORE DATA STRUCTURE (DO NOT REMOVE — used elsewhere)
# =========================================================
@dataclass
class ShockScenario:
    name: str
    description: str
    shocks: Dict[str, float]
    persistence: float = 1.0
    """
    1.0 = fully persistent shock (long crisis)
    0.0 = one-time shock
    """


# =========================================================
# SCENARIO LIBRARY
# =========================================================
class ShockScenarios:

    # -------------------------
    # ECONOMIC CORE
    # -------------------------
    @staticmethod
    def recession() -> ShockScenario:
        return ShockScenario(
            name="recession",
            description="Demand contraction, rising unemployment, falling output.",
            persistence=0.8,
            shocks={
                "gdp_growth": -0.6,
                "unemployment_rate": 0.5,
                "inflation": -0.2,
                "poverty_rate": 0.4,
                "urbanization": -0.05,
                "homicide_rate": 0.15
            }
        )

    @staticmethod
    def boom() -> ShockScenario:
        return ShockScenario(
            name="boom",
            description="High growth, tight labor markets, inflation pressure.",
            persistence=0.6,
            shocks={
                "gdp_growth": 0.7,
                "unemployment_rate": -0.4,
                "inflation": 0.3,
                "poverty_rate": -0.5,
                "urbanization": 0.1,
                "homicide_rate": -0.1
            }
        )

    @staticmethod
    def stagflation() -> ShockScenario:
        return ShockScenario(
            name="stagflation",
            description="Low growth + high inflation.",
            persistence=0.7,
            shocks={
                "gdp_growth": -0.4,
                "unemployment_rate": 0.4,
                "inflation": 0.7,
                "poverty_rate": 0.3,
                "urbanization": -0.1,
                "homicide_rate": 0.1
            }
        )

    # -------------------------
    # SOCIAL / STRUCTURAL
    # -------------------------
    @staticmethod
    def social_crisis() -> ShockScenario:
        return ShockScenario(
            name="social_crisis",
            description="Inequality + instability → crime surge.",
            persistence=0.9,
            shocks={
                "gdp_growth": -0.3,
                "unemployment_rate": 0.5,
                "inflation": 0.2,
                "poverty_rate": 0.7,
                "urbanization": -0.05,
                "homicide_rate": 0.8
            }
        )

    @staticmethod
    def recovery() -> ShockScenario:
        return ShockScenario(
            name="recovery",
            description="Post-crisis normalization.",
            persistence=0.5,
            shocks={
                "gdp_growth": 0.4,
                "unemployment_rate": -0.3,
                "inflation": 0.1,
                "poverty_rate": -0.4,
                "urbanization": 0.05,
                "homicide_rate": -0.2
            }
        )

    # -------------------------
    # NEW (EXPANSION — YOU WANTED MORE)
    # -------------------------
    @staticmethod
    def tech_boom() -> ShockScenario:
        return ShockScenario(
            name="tech_boom",
            description="Innovation-driven productivity surge.",
            persistence=0.7,
            shocks={
                "gdp_growth": 0.9,
                "unemployment_rate": -0.3,
                "inflation": 0.2,
                "poverty_rate": -0.6,
                "urbanization": 0.15,
                "homicide_rate": -0.1
            }
        )

    @staticmethod
    def financial_crash() -> ShockScenario:
        return ShockScenario(
            name="financial_crash",
            description="Market collapse → liquidity shock.",
            persistence=0.85,
            shocks={
                "gdp_growth": -0.8,
                "unemployment_rate": 0.6,
                "inflation": -0.3,
                "poverty_rate": 0.5,
                "urbanization": -0.05,
                "homicide_rate": 0.2
            }
        )

    @staticmethod
    def war() -> ShockScenario:
        return ShockScenario(
            name="war",
            description="Conflict-driven disruption.",
            persistence=0.95,
            shocks={
                "gdp_growth": -0.7,
                "unemployment_rate": 0.4,
                "inflation": 0.6,
                "poverty_rate": 0.6,
                "urbanization": -0.2,
                "homicide_rate": 1.0
            }
        )

    @staticmethod
    def policy_stimulus() -> ShockScenario:
        return ShockScenario(
            name="policy_stimulus",
            description="Government-driven economic push.",
            persistence=0.6,
            shocks={
                "gdp_growth": 0.6,
                "unemployment_rate": -0.4,
                "inflation": 0.25,
                "poverty_rate": -0.3,
                "urbanization": 0.05,
                "homicide_rate": -0.05
            }
        )

    # =========================================================
    # REGISTRY (CRITICAL FOR ScenarioRunner)
    # =========================================================
    @staticmethod
    def registry() -> Dict[str, ShockScenario]:
        scenarios = [
            ShockScenarios.recession(),
            ShockScenarios.boom(),
            ShockScenarios.stagflation(),
            ShockScenarios.social_crisis(),
            ShockScenarios.recovery(),
            ShockScenarios.tech_boom(),
            ShockScenarios.financial_crash(),
            ShockScenarios.war(),
            ShockScenarios.policy_stimulus()
        ]

        return {s.name: s for s in scenarios}

    # =========================================================
    # BACKWARD COMPATIBILITY
    # =========================================================
    @staticmethod
    def list_scenarios() -> List[ShockScenario]:
        return list(ShockScenarios.registry().values())