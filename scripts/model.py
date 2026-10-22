import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# =========================
# LOAD DATA
# =========================
df = pd.read_csv("data/processed/final_with_features.csv")
df = df.dropna()

df["region"] = df["region"].astype(str)
df["year"] = df["year"].astype(int)

df = df.sort_values(["region", "year"])

# =========================
# CORE VARIABLES (SYSTEM STATE)
# =========================
features = [
    "depression_prev",
    "gdp_growth",
    "inflation",
    "unemployment_rate",
    "poverty_rate",
    "urbanization",
    "homicide_rate"
]

target_system = features.copy()

# =========================
# CREATE LAG SYSTEM (STRUCTURAL DYNAMICS)
# =========================
for col in features:
    df[f"{col}_lag1"] = df.groupby("region")[col].shift(1)

df = df.dropna()

# =========================
# TIME-BASED SPLIT (IMPORTANT FIX)
# =========================
train_df = df[df["year"] <= 2012].copy()
test_df  = df[df["year"] > 2012].copy()

print("\nTrain shape:", train_df.shape)
print("Test shape:", test_df.shape)

# =========================
# STABILIZED STRUCTURAL MATRIX BUILDING
# =========================
X_cols = [f"{c}_lag1" for c in features]
Y_cols = features

X_train = train_df[X_cols].values
Y_train = train_df[Y_cols].values

X_test = test_df[X_cols].values
Y_test = test_df[Y_cols].values

# =========================
# STANDARDIZATION (FIT ONLY ON TRAIN)
# =========================
x_scaler = StandardScaler()
y_scaler = StandardScaler()

X_train_scaled = x_scaler.fit_transform(X_train)
Y_train_scaled = y_scaler.fit_transform(Y_train)

X_test_scaled = x_scaler.transform(X_test)
Y_test_scaled = y_scaler.transform(Y_test)

# =========================
# STABILIZED RIDGE SYSTEM MODEL
# =========================
alpha = 1.0  # stability strength

model = Ridge(alpha=alpha, fit_intercept=True)
model.fit(X_train_scaled, Y_train_scaled)

# =========================
# STRUCTURAL COEFFICIENT MATRIX
# =========================
A = model.coef_  # (variables x variables)

print("\n--- RAW COEFFICIENT MATRIX ---")
print(A)

# =========================
# STABILITY ENFORCEMENT (KEY STEP)
# =========================
# spectral radius control (prevents explosion)
eigvals = np.linalg.eigvals(A)
spectral_radius = max(abs(eigvals))

print("\nSpectral radius:", spectral_radius)

if spectral_radius > 1.0:
    damping = 0.95 / spectral_radius
    A = A * damping
    print("Applied damping factor:", damping)

# =========================
# PREDICTION TEST
# =========================
Y_pred = model.predict(X_test_scaled)

mse = mean_squared_error(Y_test_scaled, Y_pred)
r2 = r2_score(Y_test_scaled, Y_pred)

print("\n--- STABILIZED MODEL PERFORMANCE ---")
print("MSE:", mse)
print("R2:", r2)

# =========================
# SAVE STRUCTURAL SYSTEM
# =========================
np.save("data/processed/model_training/system_matrix_v4.npy", A)

pd.DataFrame(A, index=features, columns=features).to_csv(
    "data/processed/model_training/system_matrix_v4.csv"
)

# =========================
# SIMULATION BASE STATE EXPORT
# =========================
initial_state = df.groupby("region")[features].mean().iloc[0]

print("\n--- SYSTEM READY FOR SIMULATOR ---")
print(initial_state)

print("\nSaved system matrix and base state.")