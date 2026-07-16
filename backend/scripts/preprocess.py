from pathlib import Path
import pandas as pd

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DATA = BASE_DIR / "datasets" / "raw"
PROCESSED_DATA = BASE_DIR / "datasets" / "processed"

# Create processed folder if it doesn't exist
PROCESSED_DATA.mkdir(exist_ok=True)

# -----------------------------
# Load datasets
# -----------------------------
drug_names = pd.read_csv(
    RAW_DATA / "drug_names.tsv",
    sep="\t",
    header=None
)

meddra_all = pd.read_csv(
    RAW_DATA / "meddra_all_se.tsv",
    sep="\t",
    header=None
)

meddra_freq = pd.read_csv(
    RAW_DATA / "meddra_freq.tsv",
    sep="\t",
    header=None
)

# -----------------------------
# Rename columns
# -----------------------------

drug_names.columns = [
    "Drug_ID",
    "Drug_Name"
]

meddra_all.columns = [
    "Drug_ID",
    "UMLS_ID",
    "MedDRA_Concept_ID",
    "Term_Type",
    "SideEffect_ID",
    "SideEffect_Name"
]

meddra_freq.columns = [
    "Drug_ID",
    "UMLS_ID",
    "MedDRA_Concept_ID",
    "Placebo",
    "Frequency",
    "Lower_Bound",
    "Upper_Bound",
    "Term_Type",
    "SideEffect_ID",
    "SideEffect_Name"
]

# -----------------------------
# CLEANING
# -----------------------------

print("\nCleaning datasets...")

# Remove rows with missing SideEffect_ID or Term_Type
meddra_all = meddra_all.dropna(subset=["Term_Type", "SideEffect_ID"])

meddra_freq = meddra_freq.dropna(subset=["Term_Type", "SideEffect_ID"])

# Remove duplicate rows (extra safety)
drug_names = drug_names.drop_duplicates()
meddra_all = meddra_all.drop_duplicates()
meddra_freq = meddra_freq.drop_duplicates()

print("Cleaning complete!")

print("\nShapes after cleaning:")
print("Drug Names:", drug_names.shape)
print("Meddra All:", meddra_all.shape)
print("Meddra Frequency:", meddra_freq.shape)

# -----------------------------
# MERGE DRUG NAMES
# -----------------------------

cleaned_data = pd.merge(
    meddra_all,
    drug_names,
    on="Drug_ID",
    how="left"
)

print("\nMerged Dataset Shape:", cleaned_data.shape)

print(cleaned_data.head())

# -----------------------------
# SAVE CLEANED DATA
# -----------------------------

output_file = PROCESSED_DATA / "cleaned_side_effects.csv"

cleaned_data.to_csv(output_file, index=False)

print("\nSaved cleaned dataset to:")
print(output_file)