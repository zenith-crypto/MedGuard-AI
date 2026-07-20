import pandas as pd

print("=" * 60)
print("Creating Training Dataset")
print("=" * 60)

# ==========================================================
# LOAD DATASETS
# ==========================================================

ddinter = pd.read_csv(
    "backend/datasets/processed/ddinter_combined.csv",
    low_memory=False
)

pubchem = pd.read_csv(
    "backend/datasets/processed/pubchem_data.csv",
    low_memory=False
)

openfda = pd.read_csv(
    "backend/datasets/processed/openfda_data.csv",
    low_memory=False
)

print("DDInter :", ddinter.shape)
print("PubChem :", pubchem.shape)
print("OpenFDA :", openfda.shape)

# ==========================================================
# CLEAN COLUMN NAMES
# ==========================================================

ddinter.columns = ddinter.columns.str.strip()
pubchem.columns = pubchem.columns.str.strip()
openfda.columns = openfda.columns.str.strip()

# ==========================================================
# STANDARDIZE DRUG NAMES
# ==========================================================

ddinter["Drug_A"] = (
    ddinter["Drug_A"]
    .astype(str)
    .str.lower()
    .str.strip()
)

ddinter["Drug_B"] = (
    ddinter["Drug_B"]
    .astype(str)
    .str.lower()
    .str.strip()
)

pubchem["Drug_Name"] = (
    pubchem["Drug_Name"]
    .astype(str)
    .str.lower()
    .str.strip()
)

openfda["Drug_Name"] = (
    openfda["Drug_Name"]
    .astype(str)
    .str.lower()
    .str.strip()
)

# ==========================================================
# REMOVE UNKNOWN LABELS
# ==========================================================

ddinter = ddinter[
    ddinter["Level"].isin(["Major", "Moderate", "Minor"])
]

# ==========================================================
# REMOVE DUPLICATE PAIRS
# ==========================================================

ddinter["Pair"] = ddinter.apply(
    lambda x: "__".join(
        sorted([x["Drug_A"], x["Drug_B"]])
    ),
    axis=1
)

ddinter = ddinter.drop_duplicates("Pair")

print("\nAfter removing duplicate pairs:")
print(ddinter.shape)

# ==========================================================
# MERGE PUBCHEM FOR DRUG A
# ==========================================================

training_df = ddinter.merge(
    pubchem,
    left_on="Drug_A",
    right_on="Drug_Name",
    how="left"
)

training_df.rename(

    columns={

        "MolecularFormula": "Formula_A",
        "MolecularWeight": "Weight_A",
        "SMILES": "SMILES_A",

        "XLogP": "XLogP_A",
        "TPSA": "TPSA_A",
        "Complexity": "Complexity_A",
        "HBondDonorCount": "HDonor_A",
        "HBondAcceptorCount": "HAcceptor_A",
        "RotatableBondCount": "Rotatable_A",
        "HeavyAtomCount": "HeavyAtoms_A",
        "Charge": "Charge_A",
        "ExactMass": "ExactMass_A",

        "RDKit_MolWt": "RDKit_MolWt_A",
        "RDKit_LogP": "RDKit_LogP_A",
        "RDKit_TPSA": "RDKit_TPSA_A",
        "RDKit_HDonor": "RDKit_HDonor_A",
        "RDKit_HAcceptor": "RDKit_HAcceptor_A",
        "RDKit_Rotatable": "RDKit_Rotatable_A",
        "RDKit_RingCount": "RDKit_RingCount_A",
        "RDKit_AromaticRings": "RDKit_AromaticRings_A"

    },

    inplace=True

)
# Rename Morgan Fingerprints for Drug A
training_df.rename(
    columns={
        f"FP_{i}": f"FP_{i}_A"
        for i in range(128)
    },
    inplace=True
)
# ==========================================================
# MERGE OPENFDA FOR DRUG A
# ==========================================================

training_df = training_df.merge(

    openfda,

    left_on="Drug_A",

    right_on="Drug_Name",

    how="left"

)

training_df.rename(

    columns={

        "Purpose": "Purpose_A",

        "Indications": "Indications_A",

        "Warnings": "Warnings_A"

    },

    inplace=True

)

training_df.drop(

    columns=["Drug_Name"],

    inplace=True,

    errors="ignore"

)

# ==========================================================
# MERGE PUBCHEM FOR DRUG B
# ==========================================================

training_df = training_df.merge(

    pubchem,

    left_on="Drug_B",

    right_on="Drug_Name",

    how="left",

    suffixes=("", "_B")

)

training_df.rename(

    columns={

        "MolecularFormula": "Formula_B",
        "MolecularWeight": "Weight_B",
        "SMILES": "SMILES_B",

        "XLogP": "XLogP_B",
        "TPSA": "TPSA_B",
        "Complexity": "Complexity_B",
        "HBondDonorCount": "HDonor_B",
        "HBondAcceptorCount": "HAcceptor_B",
        "RotatableBondCount": "Rotatable_B",
        "HeavyAtomCount": "HeavyAtoms_B",
        "Charge": "Charge_B",
        "ExactMass": "ExactMass_B",

        "RDKit_MolWt": "RDKit_MolWt_B",
        "RDKit_LogP": "RDKit_LogP_B",
        "RDKit_TPSA": "RDKit_TPSA_B",
        "RDKit_HDonor": "RDKit_HDonor_B",
        "RDKit_HAcceptor": "RDKit_HAcceptor_B",
        "RDKit_Rotatable": "RDKit_Rotatable_B",
        "RDKit_RingCount": "RDKit_RingCount_B",
        "RDKit_AromaticRings": "RDKit_AromaticRings_B"

    },

    inplace=True

)
# Rename Morgan Fingerprints for Drug B
training_df.rename(
    columns={
        f"FP_{i}": f"FP_{i}_B"
        for i in range(128)
    },
    inplace=True
)
training_df.drop(

    columns=["Drug_Name"],

    inplace=True,

    errors="ignore"

)

# ==========================================================
# MERGE OPENFDA FOR DRUG B
# ==========================================================

training_df = training_df.merge(

    openfda,

    left_on="Drug_B",

    right_on="Drug_Name",

    how="left",

    suffixes=("", "_B")

)

training_df.rename(

    columns={

        "Purpose": "Purpose_B",

        "Indications": "Indications_B",

        "Warnings": "Warnings_B"

    },

    inplace=True

)

training_df.drop(

    columns=["Drug_Name"],

    inplace=True,

    errors="ignore"

)

# ==========================================================
# FILL MISSING VALUES
# ==========================================================

text_columns = [

    "Formula_A",
    "Formula_B",

    "Purpose_A",
    "Purpose_B",

    "Indications_A",
    "Indications_B",

    "Warnings_A",
    "Warnings_B"

]

for col in text_columns:
    training_df[col] = training_df[col].fillna("Unknown")

training_df["Weight_A"] = training_df["Weight_A"].fillna(0)
training_df["Weight_B"] = training_df["Weight_B"].fillna(0)

numeric_cols = [

    "XLogP_A","XLogP_B",
    "TPSA_A","TPSA_B",
    "Complexity_A","Complexity_B",
    "HDonor_A","HDonor_B",
    "HAcceptor_A","HAcceptor_B",
    "Rotatable_A","Rotatable_B",
    "HeavyAtoms_A","HeavyAtoms_B",
    "Charge_A","Charge_B",
    "ExactMass_A","ExactMass_B",

    "RDKit_MolWt_A","RDKit_MolWt_B",
    "RDKit_LogP_A","RDKit_LogP_B",
    "RDKit_TPSA_A","RDKit_TPSA_B",
    "RDKit_HDonor_A","RDKit_HDonor_B",
    "RDKit_HAcceptor_A","RDKit_HAcceptor_B",
    "RDKit_Rotatable_A","RDKit_Rotatable_B",
    "RDKit_RingCount_A","RDKit_RingCount_B",
    "RDKit_AromaticRings_A","RDKit_AromaticRings_B"

]
numeric_cols += [
    f"FP_{i}_A"
    for i in range(128)
]

numeric_cols += [
    f"FP_{i}_B"
    for i in range(128)
]
for col in numeric_cols:
    training_df[col] = training_df[col].fillna(0)

# ==========================================================
# FEATURE ENGINEERING
# ==========================================================

# -------------------------
# Molecular Weight Features
# -------------------------

training_df["Weight_Difference"] = (
    training_df["Weight_A"] - training_df["Weight_B"]
).abs()

training_df["Weight_Ratio"] = (
    training_df["Weight_A"] /
    training_df["Weight_B"].replace(0, 1)
)

training_df["Total_Weight"] = (
    training_df["Weight_A"] +
    training_df["Weight_B"]
)

training_df["Average_Weight"] = (
    training_df["Weight_A"] +
    training_df["Weight_B"]
) / 2

training_df["Max_Weight"] = training_df[
    ["Weight_A", "Weight_B"]
].max(axis=1)

training_df["Min_Weight"] = training_df[
    ["Weight_A", "Weight_B"]
].min(axis=1)

# -------------------------
# Formula Features
# -------------------------

training_df["Formula_Length_A"] = (
    training_df["Formula_A"].astype(str).str.len()
)

training_df["Formula_Length_B"] = (
    training_df["Formula_B"].astype(str).str.len()
)

training_df["Formula_Length_Diff"] = (
    training_df["Formula_Length_A"] -
    training_df["Formula_Length_B"]
).abs()

training_df["Same_Formula"] = (
    training_df["Formula_A"] ==
    training_df["Formula_B"]
).astype(int)

# -------------------------
# Purpose Features
# -------------------------

training_df["Purpose_Length_A"] = (
    training_df["Purpose_A"].astype(str).str.len()
)

training_df["Purpose_Length_B"] = (
    training_df["Purpose_B"].astype(str).str.len()
)

training_df["Purpose_Length_Diff"] = (
    training_df["Purpose_Length_A"] -
    training_df["Purpose_Length_B"]
).abs()

# -------------------------
# Indication Features
# -------------------------

training_df["Indication_Length_A"] = (
    training_df["Indications_A"].astype(str).str.len()
)

training_df["Indication_Length_B"] = (
    training_df["Indications_B"].astype(str).str.len()
)

training_df["Indication_Length_Diff"] = (
    training_df["Indication_Length_A"] -
    training_df["Indication_Length_B"]
).abs()

# -------------------------
# Warning Features
# -------------------------

training_df["Warning_Length_A"] = (
    training_df["Warnings_A"].astype(str).str.len()
)

training_df["Warning_Length_B"] = (
    training_df["Warnings_B"].astype(str).str.len()
)

training_df["Warning_Length_Diff"] = (
    training_df["Warning_Length_A"] -
    training_df["Warning_Length_B"]
).abs()

# -------------------------
# Missing Information Flags
# -------------------------

training_df["Missing_Purpose_A"] = (
    training_df["Purpose_A"] == "Unknown"
).astype(int)

training_df["Missing_Purpose_B"] = (
    training_df["Purpose_B"] == "Unknown"
).astype(int)

training_df["Missing_Indications_A"] = (
    training_df["Indications_A"] == "Unknown"
).astype(int)

training_df["Missing_Indications_B"] = (
    training_df["Indications_B"] == "Unknown"
).astype(int)

training_df["Missing_Warnings_A"] = (
    training_df["Warnings_A"] == "Unknown"
).astype(int)

training_df["Missing_Warnings_B"] = (
    training_df["Warnings_B"] == "Unknown"
).astype(int)

# -------------------------
# Drug Pair
# -------------------------

training_df["DrugPair"] = training_df.apply(
    lambda x: "__".join(
        sorted([
            str(x["Drug_A"]),
            str(x["Drug_B"])
        ])
    ),
    axis=1
)

training_df = training_df.sort_values(
    ["Drug_A", "Drug_B"]
).reset_index(drop=True)

# ------------------------------------------------
# PubChem Descriptor Features
# ------------------------------------------------

training_df["XLogP_Diff"] = (
    training_df["XLogP_A"] -
    training_df["XLogP_B"]
).abs()

training_df["TPSA_Diff"] = (
    training_df["TPSA_A"] -
    training_df["TPSA_B"]
).abs()

training_df["Complexity_Diff"] = (
    training_df["Complexity_A"] -
    training_df["Complexity_B"]
).abs()

training_df["ExactMass_Diff"] = (
    training_df["ExactMass_A"] -
    training_df["ExactMass_B"]
).abs()

training_df["HeavyAtom_Diff"] = (
    training_df["HeavyAtoms_A"] -
    training_df["HeavyAtoms_B"]
).abs()

training_df["Rotatable_Diff"] = (
    training_df["Rotatable_A"] -
    training_df["Rotatable_B"]
).abs()

training_df["HBondDonor_Diff"] = (
    training_df["HDonor_A"] -
    training_df["HDonor_B"]
).abs()

training_df["HBondAcceptor_Diff"] = (
    training_df["HAcceptor_A"] -
    training_df["HAcceptor_B"]
).abs()

training_df["Same_Charge"] = (
    training_df["Charge_A"] ==
    training_df["Charge_B"]
).astype(int)

# -------------------------
# RDKit Difference Features
# -------------------------

training_df["RDKit_MolWt_Diff"] = (
    training_df["RDKit_MolWt_A"] -
    training_df["RDKit_MolWt_B"]
).abs()

training_df["RDKit_LogP_Diff"] = (
    training_df["RDKit_LogP_A"] -
    training_df["RDKit_LogP_B"]
).abs()

training_df["RDKit_TPSA_Diff"] = (
    training_df["RDKit_TPSA_A"] -
    training_df["RDKit_TPSA_B"]
).abs()

training_df["RDKit_HDonor_Diff"] = (
    training_df["RDKit_HDonor_A"] -
    training_df["RDKit_HDonor_B"]
).abs()

training_df["RDKit_HAcceptor_Diff"] = (
    training_df["RDKit_HAcceptor_A"] -
    training_df["RDKit_HAcceptor_B"]
).abs()

training_df["RDKit_Rotatable_Diff"] = (
    training_df["RDKit_Rotatable_A"] -
    training_df["RDKit_Rotatable_B"]
).abs()

training_df["RDKit_RingCount_Diff"] = (
    training_df["RDKit_RingCount_A"] -
    training_df["RDKit_RingCount_B"]
).abs()

training_df["RDKit_AromaticRing_Diff"] = (
    training_df["RDKit_AromaticRings_A"] -
    training_df["RDKit_AromaticRings_B"]
).abs()
# ==========================================================
# KEEP REQUIRED COLUMNS
# ==========================================================

training_df = training_df[

    [

        
        "Drug_A",

       

        "Drug_B",

        "Level",

        "Formula_A",

        "Weight_A",

        "Purpose_A",

        "Indications_A",

        "Warnings_A",

        "Formula_B",

        "Weight_B",
        "SMILES_A",
"SMILES_B",

"XLogP_A",
"XLogP_B",

"TPSA_A",
"TPSA_B",

"Complexity_A",
"Complexity_B",

"HDonor_A",
"HDonor_B",

"HAcceptor_A",
"HAcceptor_B",

"Rotatable_A",
"Rotatable_B",

"HeavyAtoms_A",
"HeavyAtoms_B",

"Charge_A",
"Charge_B",

"ExactMass_A",
"ExactMass_B",
        "Purpose_B",

        "Indications_B",

        "Warnings_B",

        "Weight_Difference",

        "Weight_Ratio",

        "Total_Weight",
        "Average_Weight",
"Max_Weight",
"Min_Weight",
"Formula_Length_Diff",
"Purpose_Length_Diff",
"Indication_Length_Diff",
"Warning_Length_Diff",
"Missing_Purpose_A",
"Missing_Purpose_B",
"Missing_Indications_A",
"Missing_Indications_B",
"Missing_Warnings_A",
"Missing_Warnings_B",
        "Formula_Length_A",
        "Formula_Length_B",
        "Same_Formula",

        "Purpose_Length_A",

        "Purpose_Length_B",

        "Indication_Length_A",

        "Indication_Length_B",

        "Warning_Length_A",

        "Warning_Length_B",
"XLogP_Diff",
"TPSA_Diff",
"Complexity_Diff",
"ExactMass_Diff",
"HeavyAtom_Diff",
"Rotatable_Diff",
"HBondDonor_Diff",
"HBondAcceptor_Diff",
"Same_Charge",
        "DrugPair",
"RDKit_MolWt_A",
"RDKit_MolWt_B",
"RDKit_LogP_A",
"RDKit_LogP_B",
"RDKit_TPSA_A",
"RDKit_TPSA_B",
"RDKit_HDonor_A",
"RDKit_HDonor_B",
"RDKit_HAcceptor_A",
"RDKit_HAcceptor_B",
"RDKit_Rotatable_A",
"RDKit_Rotatable_B",
"RDKit_RingCount_A",
"RDKit_RingCount_B",
"RDKit_AromaticRings_A",
"RDKit_AromaticRings_B",
"RDKit_MolWt_Diff",
"RDKit_LogP_Diff",
"RDKit_TPSA_Diff",
"RDKit_HDonor_Diff",
"RDKit_HAcceptor_Diff",
"RDKit_Rotatable_Diff",
"RDKit_RingCount_Diff",
"RDKit_AromaticRing_Diff",
 *[f"FP_{i}_A" for i in range(128)],
*[f"FP_{i}_B" for i in range(128)]   ]


]

# ==========================================================
# FINAL CLEANUP
# ==========================================================

training_df = training_df.drop_duplicates(subset=["DrugPair"])

print("\nFinal Shape:")
print(training_df.shape)

print("\nInteraction Distribution:")

print(training_df["Level"].value_counts())

print("\nMissing Values:")

print(training_df.isnull().sum())

# ==========================================================
# SAVE
# ==========================================================
training_df.drop(columns=[
    "Pair",
    "Drug_Name",
    "Drug_Name_B",
],
inplace=True,
errors="ignore"
)

output_path = (
    "backend/datasets/processed/training_dataset_v2.csv"
)

training_df.to_csv(

    output_path,

    index=False

)

print("\nSaved Successfully")

print(output_path)

print("\nPreview")

print(training_df.head())