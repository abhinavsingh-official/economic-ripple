import pandas as pd

# -----------------------------
# LOAD DATA
# -----------------------------
urb = pd.read_csv("data/raw/urbanization.csv")

# -----------------------------
# STANDARDIZE COLUMN NAME
# -----------------------------
urb = urb.rename(columns={
    "Country": "region"
})

# -----------------------------
# WIDE → LONG TRANSFORMATION
# -----------------------------
urb_long = urb.melt(
    id_vars=["region"],
    var_name="year",
    value_name="urbanization"
)

# -----------------------------
# TYPE CONVERSION
# -----------------------------
urb_long["year"] = pd.to_numeric(urb_long["year"], errors="coerce")
urb_long["urbanization"] = pd.to_numeric(urb_long["urbanization"], errors="coerce")

# Remove invalid year rows
urb_long = urb_long.dropna(subset=["year"])

# -----------------------------
# REMOVE AGGREGATES
# -----------------------------
urb_long = urb_long[
    ~urb_long["region"].str.contains(
        r"World|income|Africa|Asia|Europe|\(|\)",
        case=False,
        regex=True
    )
]

# -----------------------------
# DROP MISSING VALUES
# -----------------------------
urb_long = urb_long.dropna()

# Convert year to int
urb_long["year"] = urb_long["year"].astype(int)

# -----------------------------
# COUNTRY NAME STANDARDIZATION
# -----------------------------
country_map = {
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Korea, Rep.": "South Korea",
    "Iran, Islamic Rep.": "Iran"
}

urb_long["region"] = urb_long["region"].replace(country_map)

# -----------------------------
# FILTER YEAR RANGE
# -----------------------------
urb_long = urb_long[
    (urb_long["year"] >= 1991) &
    (urb_long["year"] <= 2024)
]

# -----------------------------
# DEBUG / VALIDATION
# -----------------------------
print("\nSample Data:")
print(urb_long.head())

print("\nShape:", urb_long.shape)

print("\nUnique countries:", urb_long["region"].nunique())

print("\nYear range:", urb_long["year"].min(), "-", urb_long["year"].max())

print("\nColumns:", urb_long.columns.tolist())

# -----------------------------
# SAVE CLEAN DATA
# -----------------------------
urb_long.to_csv("data/processed/urbanization_clean.csv", index=False)

print("\nSaved to: data/processed/urbanization_clean.csv")