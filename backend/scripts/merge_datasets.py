import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "..", "datasets", "processed")

print("Loading datasets...")

# -------------------------
# Load SIDER
# -------------------------
sider = pd.read_csv(
    os.path.join(DATASET_DIR, "cleaned_side_effects.csv")
)
print("SIDER:", sider.shape)

# -------------------------
# Load PubChem
# -------------------------
pubchem = pd.read_csv(
    os.path.join(DATASET_DIR, "pubchem_data.csv")
)
print("PubChem:", pubchem.shape)

# -------------------------
# Load OpenFDA
# -------------------------
openfda = pd.read_csv(
    os.path.join(DATASET_DIR, "openfda_data.csv")
)
print("OpenFDA:", openfda.shape)

# -------------------------
# Load DDInter
# -------------------------
ddinter = pd.read_csv(
    os.path.join(DATASET_DIR, "ddinter_combined.csv")
)
print("DDInter:", ddinter.shape)

print("\nMerging SIDER + PubChem...")
merged = sider.merge(
    pubchem,
    on="Drug_Name",
    how="left"
)

print("Shape:", merged.shape)

print("\nMerging OpenFDA...")
merged = merged.merge(
    openfda,
    on="Drug_Name",
    how="left"
)

print("Shape:", merged.shape)

print("\nPreparing DDInter...")

ddinter = ddinter.rename(
    columns={
        "Drug_A": "Drug_Name",
        "Drug_B": "Interacting_Drug",
        "Level": "Interaction_Level"
    }
)

ddinter = ddinter[
    ["Drug_Name", "Interacting_Drug", "Interaction_Level"]
]

print("\nMerging DDInter...")
merged = merged.merge(
    ddinter,
    on="Drug_Name",
    how="left"
)

print("Final Shape:", merged.shape)

output_path = os.path.join(DATASET_DIR, "master_dataset.csv")

merged.to_csv(
    output_path,
    index=False
)

print("\nMaster dataset saved to:")
print(output_path)

print("\nPreview:")
print(merged.head())