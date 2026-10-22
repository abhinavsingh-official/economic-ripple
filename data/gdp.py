import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
gdp = pd.read_csv("data/raw/gdp_growth.csv")

# -----------------------------
# STANDARDIZE COLUMN NAME
# -----------------------------
gdp = gdp.rename(columns={
    "Country Name": "region"
})

# -----------------------------
# WIDE → LONG TRANSFORMATION
# -----------------------------
gdp_long = gdp.melt(
    id_vars=["region"],
    var_name="year",
    value_name="gdp_growth"
)

# -----------------------------
# TYPE CONVERSION
# -----------------------------
gdp_long["year"] = pd.to_numeric(gdp_long["year"], errors="coerce")
gdp_long["gdp_growth"] = pd.to_numeric(gdp_long["gdp_growth"], errors="coerce")

# Remove invalid year rows (like "Code", etc.)
gdp_long = gdp_long.dropna(subset=["year"])

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
gdp_long = gdp_long[
    ~gdp_long["region"].str.contains(
        r"World|income|Africa|Asia|Europe|\(|\)",
        case=False,
        regex=True
    )
]

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
gdp_long = gdp_long.dropna()

# Convert year to int
gdp_long["year"] = gdp_long["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

gdp_long["region"] = gdp_long["region"].replace(country_map)

# -----------------------------
# FILTER YEAR RANGE (ALIGNMENT)
# -----------------------------
gdp_long = gdp_long[
    (gdp_long["year"] >= 1991) &
    (gdp_long["year"] <= 2024)
]

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(gdp_long.head())

print("\nShape:", gdp_long.shape)

print("\nUnique countries:", gdp_long["region"].nunique())

print("\nYear range:", gdp_long["year"].min(), "-", gdp_long["year"].max())

print("\nColumns:", gdp_long.columns.tolist())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
gdp_long.to_csv("data/processed/gdp_clean.csv", index=False)

print("\nSaved to: data/processed/gdp_clean.csv")