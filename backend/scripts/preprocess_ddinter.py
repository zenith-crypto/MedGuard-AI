import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

folder = BASE_DIR / "datasets" / "raw" / "ddinter"

files = list(folder.glob("*.csv"))

print("CSV Files Found:", len(files))

dfs = []

for file in files:
    print(file.name)

    df = pd.read_csv(file)

    print(df.columns.tolist())

    dfs.append(df)

combined = pd.concat(dfs, ignore_index=True)

print("\nCombined Shape:", combined.shape)

print(combined.head())

combined.to_csv(
    BASE_DIR/"datasets/processed/ddinter_combined.csv",
    index=False
)

print("Saved Successfully")