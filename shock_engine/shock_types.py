from enum import Enum


class ShockType(Enum):
    # =========================
    # MACROECONOMIC SHOCKS
    # =========================
    GDP_POSITIVE = "gdp_positive"
    GDP_NEGATIVE = "gdp_negative"

    INFLATION_SPIKE = "inflation_spike"
    DEFLATION_SHOCK = "deflation_shock"

    UNEMPLOYMENT_SURGE = "unemployment_surge"
    LABOR_BOOM = "labor_boom"

    # =========================
    # SOCIAL SYSTEM SHOCKS
    # =========================
    POVERTY_EXPANSION = "poverty_expansion"
    POVERTY_REDUCTION = "poverty_reduction"

    HEALTH_CRISIS = "health_crisis"
    SAFETY_BREAKDOWN = "safety_breakdown"

    # =========================
    # STRUCTURAL SHOCKS
    # =========================
    URBANIZATION_BOOM = "urbanization_boom"
    URBANIZATION_COLLAPSE = "urbanization_collapse"

    # =========================
    # SYSTEMIC SHOCKS (IMPORTANT)
    # =========================
    RECESSION = "recession"
    BOOM_CYCLE = "boom_cycle"
    FINANCIAL_CRISIS = "financial_crisis"
    PANDEMIC = "pandemic"
    WAR = "war"
    SUPPLY_CHAIN_CRISIS = "supply_chain_crisis"

    # =========================
    # POLICY SHOCKS (CRITICAL FOR CONTROL)
    # =========================
    MONETARY_TIGHTENING = "monetary_tightening"
    MONETARY_EASING = "monetary_easing"
    FISCAL_STIMULUS = "fiscal_stimulus"
    TAX_INCREASE = "tax_increase"
    TAX_CUT = "tax_cut"