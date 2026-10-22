import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
hom = pd.read_csv("data/raw/homicide.csv")

# -----------------------------
# STANDARDIZE COLUMNS
# -----------------------------
hom = hom.rename(columns={
    "Country": "region",
    "Year": "year",
    "Homicide rate per 100,000 population": "homicide_rate"
})

# Keep required columns
hom = hom[["region", "year", "homicide_rate"]]

# -----------------------------
# TYPE CONVERSION
# -----------------------------
hom["year"] = pd.to_numeric(hom["year"], errors="coerce")
hom["homicide_rate"] = pd.to_numeric(hom["homicide_rate"], errors="coerce")

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
hom = hom[
    ~hom["region"].str.contains(
        r"World|income|Africa|Asia|Europe|UN|\(|\)",
        case=False,
        regex=True
    )
]

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
hom = hom.dropna()

# Convert year to int
hom["year"] = hom["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

hom["region"] = hom["region"].replace(country_map)

# -----------------------------
# FILTER YEAR RANGE
# -----------------------------
hom = hom[
    (hom["year"] >= 1991) &
    (hom["year"] <= 2024)
]

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(hom.head())

print("\nShape:", hom.shape)

print("\nUnique countries:", hom["region"].nunique())

print("\nYear range:", hom["year"].min(), "-", hom["year"].max())

print("\nColumns:", hom.columns.tolist())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
hom.to_csv("data/processed/homicide_clean.csv", index=False)

print("\nSaved to: data/processed/homicide_clean.csv")