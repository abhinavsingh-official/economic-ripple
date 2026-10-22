import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
inflation = pd.read_csv("data/raw/inflation.csv")

# -----------------------------
# STANDARDIZE COLUMN NAME
# -----------------------------
inflation = inflation.rename(columns={
    "Country": "region"
})

# -----------------------------
# WIDE → LONG TRANSFORMATION
# -----------------------------
inflation_long = inflation.melt(
    id_vars=["region"],
    var_name="year",
    value_name="inflation"
)

# -----------------------------
# TYPE CONVERSION
# -----------------------------
inflation_long["year"] = pd.to_numeric(inflation_long["year"], errors="coerce")
inflation_long["inflation"] = pd.to_numeric(inflation_long["inflation"], errors="coerce")

# Remove invalid year rows
inflation_long = inflation_long.dropna(subset=["year"])

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
inflation_long = inflation_long[
    ~inflation_long["region"].str.contains(
        r"World|income|Africa|Asia|Europe|\(|\)",
        case=False,
        regex=True
    )
]

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
inflation_long = inflation_long.dropna()

# Convert year to int
inflation_long["year"] = inflation_long["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

inflation_long["region"] = inflation_long["region"].replace(country_map)

# -----------------------------
# FILTER YEAR RANGE
# -----------------------------
inflation_long = inflation_long[
    (inflation_long["year"] >= 1991) &
    (inflation_long["year"] <= 2024)
]

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(inflation_long.head())

print("\nShape:", inflation_long.shape)

print("\nUnique countries:", inflation_long["region"].nunique())

print("\nYear range:", inflation_long["year"].min(), "-", inflation_long["year"].max())

print("\nColumns:", inflation_long.columns.tolist())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
inflation_long.to_csv("data/processed/inflation_clean.csv", index=False)

print("\nSaved to: data/processed/inflation_clean.csv")