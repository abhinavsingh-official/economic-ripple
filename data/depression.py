import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
depression = pd.read_csv("data/raw/depression.csv")

# -----------------------------
# STANDARDIZE COLUMN NAMES
# -----------------------------
depression = depression.rename(columns={
    "Country": "region",
    "Year": "year",
    "Depressive disorders (share of population) - Sex: Both - Age: Age-standardized": "depression_prev"
})

# Keep only required columns
depression = depression[["region", "year", "depression_prev"]]

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
depression = depression[
    ~depression["region"].str.contains(
        r"World|income|Africa|Asia|Europe|\(|\)",
        case=False,
        regex=True
    )
]

# -----------------------------
# TYPE CONVERSION
# -----------------------------
depression["depression_prev"] = pd.to_numeric(
    depression["depression_prev"], errors="coerce"
)

depression["year"] = pd.to_numeric(
    depression["year"], errors="coerce"
)

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
depression = depression.dropna()

# Convert year to int
depression["year"] = depression["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

depression["region"] = depression["region"].replace(country_map)

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(depression.head())

print("\nShape:", depression.shape)

print("\nUnique countries:", depression["region"].nunique())

print("\nYear range:", depression["year"].min(), "-", depression["year"].max())

print("\nColumns:", depression.columns.tolist())

print("\nCountries list:")
print(depression["region"].unique())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
depression.to_csv("data/processed/depression_clean.csv", index=False)

print("\nSaved to: data/processed/depression_clean.csv")