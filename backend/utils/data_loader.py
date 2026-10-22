import numpy as np


def init_states(df, countries, variables):
    """
    Initializes starting state vectors for each country.
    Assumes df is already preloaded (from core.cache).
    """

    states = {}

    for c in countries:
        filtered = df[df["region"] == c]

        if filtered.empty:
            raise ValueError(f"No data found for country: {c}")

        row = filtered.sort_values("year").iloc[-1]

        states[c] = row[variables].values.astype(float)

    return states