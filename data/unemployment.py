import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
unemp = pd.read_csv("data/raw/unemployment.csv")

# -----------------------------
# STANDARDIZE COLUMN NAME
# -----------------------------
unemp = unemp.rename(columns={
    "Country": "region"
})

# -----------------------------
# WIDE → LONG TRANSFORMATION
# -----------------------------
unemp_long = unemp.melt(
    id_vars=["region"],
    var_name="year",
    value_name="unemployment_rate"
)

# -----------------------------
# TYPE CONVERSION
# -----------------------------
unemp_long["year"] = pd.to_numeric(unemp_long["year"], errors="coerce")
unemp_long["unemployment_rate"] = pd.to_numeric(unemp_long["unemployment_rate"], errors="coerce")

# Remove invalid year rows
unemp_long = unemp_long.dropna(subset=["year"])

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
unemp_long = unemp_long[
    ~unemp_long["region"].str.contains(
        r"World|income|Africa|Asia|Europe|\(|\)",
        case=False,
        regex=True
    )
]

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
unemp_long = unemp_long.dropna()

# Convert year to int
unemp_long["year"] = unemp_long["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

unemp_long["region"] = unemp_long["region"].replace(country_map)

# -----------------------------
# FILTER YEAR RANGE
# -----------------------------
unemp_long = unemp_long[
    (unemp_long["year"] >= 1991) &
    (unemp_long["year"] <= 2024)
]

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(unemp_long.head())

print("\nShape:", unemp_long.shape)

print("\nUnique countries:", unemp_long["region"].nunique())

print("\nYear range:", unemp_long["year"].min(), "-", unemp_long["year"].max())

print("\nColumns:", unemp_long.columns.tolist())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
unemp_long.to_csv("data/processed/unemployment_clean.csv", index=False)

print("\nSaved to: data/processed/unemployment_clean.csv")