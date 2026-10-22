# backend/core/constants.py

VARIABLES = [
    "depression_prev",
    "gdp_growth",
    "inflation",
    "unemployment_rate",
    "poverty_rate",
    "urbanization",
    "homicide_rate"
]


VARIABLE_LABELS = {
    "depression_prev": "Mental Health",
    "gdp_growth": "GDP Growth",
    "inflation": "Inflation",
    "unemployment_rate": "Unemployment",
    "poverty_rate": "Poverty",
    "urbanization": "Urbanization",
    "homicide_rate": "Crime"
}


SCENARIO_INFO = {
    "recession": "Economic slowdown with unemployment rise",
    "boom": "High growth and inflation pressure",
    "stagflation": "Low growth + high inflation",
    "social_crisis": "Instability and crime increase",
    "recovery": "Post-crisis normalization"
}


# Simulation behavior defaults
DEFAULT_DAMPING = 0.01
DEFAULT_NOISE = 0.05   # slightly higher = more "simulator feel"