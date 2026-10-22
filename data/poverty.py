import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
pov = pd.read_csv("data/raw/poverty.csv")

# -----------------------------
# STANDARDIZE COLUMNS
# -----------------------------
pov = pov.rename(columns={
    "Country": "region",
    "poverty_value": "poverty_rate"
})

# Keep only required columns
pov = pov[["region", "Year", "poverty_rate"]]
pov = pov.rename(columns={"Year": "year"})

# -----------------------------
# TYPE CONVERSION
# -----------------------------
pov["year"] = pd.to_numeric(pov["year"], errors="coerce")
pov["poverty_rate"] = pd.to_numeric(pov["poverty_rate"], errors="coerce")

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
pov = pov[
    ~pov["region"].str.contains(
        r"World|income|Africa|Asia|Europe|Pacific|\(|\)|Sub-Saharan",
        case=False,
        regex=True
    )
]

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
pov = pov.dropna()

# Convert year to int
pov["year"] = pov["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

pov["region"] = pov["region"].replace(country_map)

# -----------------------------
# FILTER YEAR RANGE
# -----------------------------
pov = pov[
    (pov["year"] >= 1991) &
    (pov["year"] <= 2024)
]

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(pov.head())

print("\nShape:", pov.shape)

print("\nUnique countries:", pov["region"].nunique())

print("\nYear range:", pov["year"].min(), "-", pov["year"].max())

print("\nColumns:", pov.columns.tolist())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
pov.to_csv("data/processed/poverty_clean.csv", index=False)

print("\nSaved to: data/processed/poverty_clean.csv")