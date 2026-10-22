import matplotlib.pyplot as plt
import pandas as pd


class PlotEngine:

    def __init__(self, variables):
        self.variables = variables

    # =========================================================
    # 1. TRAJECTORY PLOT
    # =========================================================
    def plot_variable(self, df: pd.DataFrame, country: str, variable: str):

        df = df[df["country"] == country]

        plt.figure()
        plt.plot(df["step"], df[variable])

        plt.title(f"{variable} over time ({country})")
        plt.xlabel("Step")
        plt.ylabel(variable)

        plt.grid()
        plt.show()

    # =========================================================
    # 2. MULTI-VARIABLE PLOT
    # =========================================================
    def plot_multiple(self, df, country, vars_list):

        df = df[df["country"] == country]

        plt.figure()

        for v in vars_list:
            plt.plot(df["step"], df[v], label=v)

        plt.legend()
        plt.title(f"Multi-variable trends ({country})")
        plt.xlabel("Step")
        plt.ylabel("Value")

        plt.grid()
        plt.show()

    # =========================================================
    # 3. SHOCK DECOMPOSITION
    # =========================================================
    def plot_decomposition(self, df, country, variable):

        df = df[df["country"] == country]

        plt.figure()

        plt.plot(df["step"], df[f"{variable}_system_delta"], label="system")
        plt.plot(df["step"], df[f"{variable}_shock"], label="shock")
        plt.plot(df["step"], df[f"{variable}_noise"], label="noise")

        plt.legend()
        plt.title(f"{variable} decomposition ({country})")
        plt.xlabel("Step")

        plt.grid()
        plt.show()

    # =========================================================
    # 4. COUNTRY COMPARISON
    # =========================================================
    def compare_countries(self, df, variable):

        plt.figure()

        for country in df["country"].unique():
            subset = df[df["country"] == country]
            plt.plot(subset["step"], subset[variable], label=country)

        plt.legend()
        plt.title(f"{variable} comparison across countries")
        plt.xlabel("Step")

        plt.grid()
        plt.show()