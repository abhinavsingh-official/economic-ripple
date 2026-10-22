import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
pop = pd.read_csv("data/raw/population.csv")

# -----------------------------
# STANDARDIZE COLUMN NAME
# -----------------------------
pop = pop.rename(columns={
    "Country": "region"
})

# -----------------------------
# WIDE → LONG TRANSFORMATION
# -----------------------------
pop_long = pop.melt(
    id_vars=["region"],
    var_name="year",
    value_name="population"
)

# -----------------------------
# TYPE CONVERSION
# -----------------------------
pop_long["year"] = pd.to_numeric(pop_long["year"], errors="coerce")
pop_long["population"] = pd.to_numeric(pop_long["population"], errors="coerce")

# Remove invalid year rows
pop_long = pop_long.dropna(subset=["year"])

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
pop_long = pop_long[
    ~pop_long["region"].str.contains(
        r"World|income|Africa|Asia|Europe|\(|\)",
        case=False,
        regex=True
    )
]

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
pop_long = pop_long.dropna()

# Convert year to int
pop_long["year"] = pop_long["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

pop_long["region"] = pop_long["region"].replace(country_map)

# -----------------------------
# FILTER YEAR RANGE
# -----------------------------
pop_long = pop_long[
    (pop_long["year"] >= 1991) &
    (pop_long["year"] <= 2024)
]

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(pop_long.head())

print("\nShape:", pop_long.shape)

print("\nUnique countries:", pop_long["region"].nunique())

print("\nYear range:", pop_long["year"].min(), "-", pop_long["year"].max())

print("\nColumns:", pop_long.columns.tolist())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
pop_long.to_csv("data/processed/population_clean.csv", index=False)

print("\nSaved to: data/processed/population_clean.csv")