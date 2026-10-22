import pandas as pd
from functools import reduce
from sklearn.preprocessing import StandardScaler

# =========================
# LOAD DATA
# =========================
gdp = pd.read_csv("data/processed/gdp_clean.csv")
inflation = pd.read_csv("data/processed/inflation_clean.csv")
unemployment = pd.read_csv("data/processed/unemployment_clean.csv")
population = pd.read_csv("data/processed/population_clean.csv")
urbanization = pd.read_csv("data/processed/urbanization_clean.csv")
poverty = pd.read_csv("data/processed/poverty_clean.csv")
depression = pd.read_csv("data/processed/depression_clean.csv")
homicide = pd.read_csv("data/processed/homicide_clean.csv")

datasets = {
    "gdp": gdp,
    "inflation": inflation,
    "unemployment": unemployment,
    "population": population,
    "urbanization": urbanization,
    "poverty": poverty,
    "depression": depression,
    "homicide": homicide
}

# =========================
# COVERAGE CHECK
# =========================
print("\n--- Dataset Coverage ---")
for name, df in datasets.items():
    print(f"{name}: {df['region'].nunique()} countries")

# =========================
# MERGE
# =========================
panel = reduce(
    lambda left, right: pd.merge(left, right, on=["region", "year"], how="outer"),
    datasets.values()
)

# =========================
# CLEAN TYPES
# =========================
panel["region"] = panel["region"].astype(str)
panel["year"] = panel["year"].astype(int)

numeric_cols = [
    "gdp_growth", "inflation", "unemployment_rate",
    "population", "urbanization", "poverty_rate",
    "depression_prev", "homicide_rate"
]

for col in numeric_cols:
    panel[col] = pd.to_numeric(panel[col], errors="coerce")

panel = panel.sort_values(["region", "year"]).reset_index(drop=True)

# =========================
# REMOVE AGGREGATES
# =========================
invalid_keywords = [
    "World", "income", "Africa", "Asia", "Europe",
    "OECD", "Arab", "Union", "Euro"
]

panel = panel[~panel["region"].str.contains("|".join(invalid_keywords), na=False)]

# =========================
# COUNTRY FILTER (TOP ~50)
# =========================
completeness = panel.groupby("region")[numeric_cols].agg(
    lambda x: x.notnull().mean()
).mean(axis=1)

top_countries = completeness.sort_values(ascending=False).head(50).index
panel = panel[panel["region"].isin(top_countries)]

# =========================
# HANDLE MISSING VALUES
# =========================
panel[numeric_cols] = panel.groupby("region")[numeric_cols].transform(
    lambda x: x.interpolate(method="linear", limit_direction="both")
)

panel[numeric_cols] = panel.groupby("region")[numeric_cols].transform(
    lambda x: x.ffill().bfill()
)

panel = panel.dropna(subset=["depression_prev"])

# =========================
# OUTLIER HANDLING (CLIPPING INSTEAD OF DROPPING)
# =========================
def clip_outliers(df, cols):
    for col in cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1

        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR

        df[col] = df[col].clip(lower, upper)
    return df

panel = clip_outliers(panel, [
    "gdp_growth",
    "inflation",
    "unemployment_rate",
    "poverty_rate"
])

# =========================
# DELTA FEATURES
# =========================
panel = panel.sort_values(["region", "year"])

panel["gdp_growth_delta"] = panel.groupby("region")["gdp_growth"].diff()
panel["unemployment_rate_delta"] = panel.groupby("region")["unemployment_rate"].diff()
panel["inflation_delta"] = panel.groupby("region")["inflation"].diff()
panel["poverty_rate_delta"] = panel.groupby("region")["poverty_rate"].diff()

# =========================
# ADVANCED FEATURES
# =========================

# Lag features
panel["gdp_lag1"] = panel.groupby("region")["gdp_growth"].shift(1)
panel["unemployment_lag1"] = panel.groupby("region")["unemployment_rate"].shift(1)
panel["inflation_lag1"] = panel.groupby("region")["inflation"].shift(1)

# Rolling features
panel["gdp_rolling_avg"] = panel.groupby("region")["gdp_growth"].transform(lambda x: x.rolling(3).mean())
panel["inflation_rolling_avg"] = panel.groupby("region")["inflation"].transform(lambda x: x.rolling(3).mean())

# Shock indicator
panel["gdp_shock"] = (panel["gdp_growth_delta"].abs() > 1).astype(int)

# Drop NaNs created by lag/rolling
panel = panel.dropna()

# =========================
# SCALE FEATURES (AFTER ENGINEERING)
# =========================
scale_cols = [
    "gdp_growth", "inflation", "unemployment_rate",
    "population", "urbanization", "poverty_rate"
]

scaler = StandardScaler()
panel[scale_cols] = scaler.fit_transform(panel[scale_cols])

# =========================
# FINAL CHECKS
# =========================
print("\n--- FINAL DATA ---\n")

print("Sample:")
print(panel.head())

print("\nShape:", panel.shape)
print("Unique countries:", panel["region"].nunique())
print("Year range:", panel["year"].min(), "-", panel["year"].max())
print("Columns:", panel.columns.tolist())

print("\nMissing values:")
print(panel.isnull().mean())

print("\nDuplicates:", panel.duplicated().sum())

# =========================
# SAVE
# =========================
panel.to_csv("data/processed/final_with_features.csv", index=False)

print("\nSaved to: data/processed/final_with_features.csv")