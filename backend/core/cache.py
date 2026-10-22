import pandas as pd

DATA_PATH = "data/processed/model_training/"

df_data = pd.read_csv(DATA_PATH + "model_v5_predictions.csv")

A_df = pd.read_csv(
    DATA_PATH + "system_matrix_v4.csv",
    index_col=0
)

A = A_df.values
A_df = A_df