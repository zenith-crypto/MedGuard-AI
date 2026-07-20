# ==========================================================
# MedGuard AI - Drug Interaction Predictor
# Part 1 : Imports, Model Loading, Dataset Loading,
#          Fuzzy Drug Search & Drug Information Loading
# ==========================================================

import warnings
import joblib
import pandas as pd
import numpy as np
from rdkit import RDLogger
RDLogger.DisableLog("rdApp.*")
from difflib import get_close_matches
from catboost import CatBoostClassifier

warnings.filterwarnings("ignore")

print("=" * 70)
print("            MEDGUARD AI - DRUG INTERACTION PREDICTOR")
print("=" * 70)

# ==========================================================
# LOAD CATBOOST MODEL
# ==========================================================



MODEL_PATH = "backend/models/catboost_model.cbm"
FEATURES_PATH = "backend/models/catboost_features.pkl"
LABELS_PATH = "backend/models/class_labels.pkl"

model = CatBoostClassifier()
model.load_model(MODEL_PATH)

feature_columns = joblib.load(FEATURES_PATH)
class_labels = joblib.load(LABELS_PATH)



# ==========================================================
# LOAD DATASETS
# ==========================================================

print("\nLoading datasets...")

training_df = pd.read_csv(
    "backend/datasets/processed/training_dataset_v2.csv",
    low_memory=False
)

pubchem_df = pd.read_csv(
    "backend/datasets/processed/pubchem_data.csv",
    low_memory=False
)


openfda_df = pd.read_csv(
    "backend/datasets/processed/openfda_data.csv",
    low_memory=False
)



# ==========================================================
# CLEAN COLUMN NAMES
# ==========================================================

training_df.columns = training_df.columns.str.strip()
pubchem_df.columns = pubchem_df.columns.str.strip()
openfda_df.columns = openfda_df.columns.str.strip()

# ==========================================================
# STANDARDIZE DRUG NAMES
# ==========================================================

for df in [training_df]:

    df["Drug_A"] = (
        df["Drug_A"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    df["Drug_B"] = (
        df["Drug_B"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

pubchem_df["Drug_Name"] = (
    pubchem_df["Drug_Name"]
    .astype(str)
    .str.lower()
    .str.strip()
)

openfda_df["Drug_Name"] = (
    openfda_df["Drug_Name"]
    .astype(str)
    .str.lower()
    .str.strip()
)

# ==========================================================
# CREATE MASTER DRUG LIST
# ==========================================================

all_drugs = sorted(
    set(training_df["Drug_A"])
    |
    set(training_df["Drug_B"])
    |
    set(pubchem_df["Drug_Name"])
    |
    set(openfda_df["Drug_Name"])
)

drug_aliases = {
    "paracetamol": "acetaminophen",
    "crocin": "acetaminophen",
    "calpol": "acetaminophen",
    "dolo": "acetaminophen",
    "tylenol": "acetaminophen",
    "asprin": "aspirin",
    "warferin": "warfarin",
    "cetrizine": "cetirizine"
}

# ==========================================================
# FUZZY DRUG SEARCH
# ==========================================================

def match_drug(name):

    name = str(name).lower().strip()
    if name in drug_aliases:
     name = drug_aliases[name]
    # Exact match
    if name in all_drugs:
        return name

    # Exact match inside PubChem
    pubchem_match = pubchem_df[
        pubchem_df["Drug_Name"] == name
    ]

    if not pubchem_match.empty:
        return pubchem_match.iloc[0]["Drug_Name"]

    # Starts with
    starts = [d for d in all_drugs if d.startswith(name)]

    if starts:
        return starts[0]

    # Contains
    contains = [d for d in all_drugs if name in d]

    if contains:
        return contains[0]

    # Typo matching
    close = get_close_matches(
        name,
        all_drugs,
        n=1,
        cutoff=0.75
    )

    if close:
        return close[0]

    return None

# ==========================================================
# USER INPUT
# ==========================================================

print("\nEnter Drug Names\n")

drug1_input = input("Drug 1 : ")
drug2_input = input("Drug 2 : ")

drug1 = match_drug(drug1_input)
drug2 = match_drug(drug2_input)

if drug1 is None:
    print(f"\n❌ '{drug1_input}' not found.")
    exit()

if drug2 is None:
    print(f"\n❌ '{drug2_input}' not found.")
    exit()

print("\nMatched Drugs")
print("------------------------")
print("Drug A :", drug1.title())
print("Drug B :", drug2.title())

# ==========================================================
# LOAD TRAINING RECORD
# ==========================================================

pair = training_df[
    (
        (training_df["Drug_A"] == drug1) &
        (training_df["Drug_B"] == drug2)
    )
    |
    (
        (training_df["Drug_A"] == drug2) &
        (training_df["Drug_B"] == drug1)
    )
]

pair_exists = not pair.empty

if pair_exists:
    pair = pair.iloc[0]
    print("✓ Existing interaction record found.")
else:
    pair = None
    print(" Drug pair not present in training dataset.")
    print("  Prediction will use molecular features only.")

# ==========================================================
# LOAD PUBCHEM RECORDS
# ==========================================================

def get_pubchem(drug):

    row = pubchem_df[
        pubchem_df["Drug_Name"] == drug
    ]

    if len(row):
        return row.iloc[0]

    return pd.Series(dtype="object")

drugA_pubchem = get_pubchem(drug1)
drugB_pubchem = get_pubchem(drug2)



# ==========================================================
# LOAD OPENFDA RECORDS
# ==========================================================

def get_fda(drug):

    drug = drug.lower().strip()

    # Exact match
    row = openfda_df[
        openfda_df["Drug_Name"] == drug
    ]

    if not row.empty:
        return row.iloc[0]

    # Partial match
    row = openfda_df[
        openfda_df["Drug_Name"].str.contains(
            drug,
            case=False,
            na=False
        )
    ]

    if not row.empty:
        return row.iloc[0]

    return pd.Series(dtype="object")

drugA_fda = get_fda(drug1)
drugB_fda = get_fda(drug2)



# ==========================================================
# HELPER FUNCTION
# ==========================================================

def safe_get(series, column, default="Unknown"):

    if column not in series.index:
        return default

    value = series[column]

    if pd.isna(value):
        return default

    return value

def clean_text(text):

    if pd.isna(text):
        return ""

    text = str(text)

    remove_words = [
        "Purpose",
        "Warnings",
        "Uses",
        "INDICATIONS AND USAGE",
        "Indications and Usage"
    ]

    for word in remove_words:
        text = text.replace(word, "")

    return text.strip()


def print_points(text):

    text = clean_text(text)

    if text == "":
        print("Not Available")
        return

    text = text.replace(";", ".")
    text = text.replace("•", ".")

    points = [
        p.strip()
        for p in text.split(".")
        if len(p.strip()) > 8
    ]

    for point in points[:6]:
        print(f"• {point}")


# ==========================================================
# Part 2 : Build Complete 338-Feature Vector
# ==========================================================

from rdkit import Chem
from rdkit.Chem import Descriptors, rdMolDescriptors, AllChem



# ==========================================================
# SAFE VALUE FUNCTIONS
# ==========================================================

def num(series, column, default=0.0):
    value = safe_get(series, column, default)
    try:
        return float(value)
    except:
        return default


def text(series, column):
    value = safe_get(series, column, "")
    return "" if pd.isna(value) else str(value)


# ==========================================================
# RDKIT FEATURES
# ==========================================================

def rdkit_features(smiles):

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:

        return {

            "MolWt":0,
            "LogP":0,
            "TPSA":0,
            "HDonor":0,
            "HAcceptor":0,
            "Rotatable":0,
            "RingCount":0,
            "AromaticRings":0,
            "Fingerprint":[0]*128

        }

    fp = AllChem.GetMorganFingerprintAsBitVect(
        mol,
        radius=2,
        nBits=128
    )

    return {

        "MolWt":Descriptors.MolWt(mol),

        "LogP":Descriptors.MolLogP(mol),

        "TPSA":rdMolDescriptors.CalcTPSA(mol),

        "HDonor":rdMolDescriptors.CalcNumHBD(mol),

        "HAcceptor":rdMolDescriptors.CalcNumHBA(mol),

        "Rotatable":rdMolDescriptors.CalcNumRotatableBonds(mol),

        "RingCount":rdMolDescriptors.CalcNumRings(mol),

        "AromaticRings":rdMolDescriptors.CalcNumAromaticRings(mol),

        "Fingerprint":list(fp)

    }


# ==========================================================
# GET SMILES
# ==========================================================
features = {}
smiles_A = text(drugA_pubchem, "SMILES")
smiles_B = text(drugB_pubchem, "SMILES")

features["SMILES_A"] = smiles_A
features["SMILES_B"] = smiles_B

rdA = rdkit_features(smiles_A)
rdB = rdkit_features(smiles_B)




# ==========================================================
# BASIC FEATURES
# ==========================================================

features["Drug_A"] = drug1
features["Drug_B"] = drug2

features["Formula_A"] = text(drugA_pubchem, "Formula")
features["Formula_B"] = text(drugB_pubchem, "Formula")

features["Weight_A"] = num(drugA_pubchem, "Weight")
features["Weight_B"] = num(drugB_pubchem, "Weight")

features["XLogP_A"] = num(drugA_pubchem, "XLogP")
features["XLogP_B"] = num(drugB_pubchem, "XLogP")

features["TPSA_A"] = num(drugA_pubchem, "TPSA")
features["TPSA_B"] = num(drugB_pubchem, "TPSA")

features["Complexity_A"] = num(drugA_pubchem, "Complexity")
features["Complexity_B"] = num(drugB_pubchem, "Complexity")

features["HDonor_A"] = num(drugA_pubchem, "HDonor")
features["HDonor_B"] = num(drugB_pubchem, "HDonor")

features["HAcceptor_A"] = num(drugA_pubchem, "HAcceptor")
features["HAcceptor_B"] = num(drugB_pubchem, "HAcceptor")

features["Rotatable_A"] = num(drugA_pubchem, "Rotatable")
features["Rotatable_B"] = num(drugB_pubchem, "Rotatable")

features["HeavyAtoms_A"] = num(drugA_pubchem, "HeavyAtoms")
features["HeavyAtoms_B"] = num(drugB_pubchem, "HeavyAtoms")

features["Charge_A"] = num(drugA_pubchem, "Charge")
features["Charge_B"] = num(drugB_pubchem, "Charge")

features["ExactMass_A"] = num(drugA_pubchem, "ExactMass")
features["ExactMass_B"] = num(drugB_pubchem, "ExactMass")

# ==========================================================
# ENGINEERED FEATURES
# ==========================================================

features["Weight_Difference"] = abs(features["Weight_A"] - features["Weight_B"])

features["Weight_Ratio"] = (
    features["Weight_A"] / (features["Weight_B"] + 1e-6)
)

features["Total_Weight"] = (
    features["Weight_A"] +
    features["Weight_B"]
)

features["Average_Weight"] = (
    features["Total_Weight"] / 2
)

features["Max_Weight"] = max(
    features["Weight_A"],
    features["Weight_B"]
)

features["Min_Weight"] = min(
    features["Weight_A"],
    features["Weight_B"]
)

formulaA = features["Formula_A"]
formulaB = features["Formula_B"]

purposeA = text(drugA_fda, "Purpose")
purposeB = text(drugB_fda, "Purpose")

indA = text(drugA_fda, "Indications")
indB = text(drugB_fda, "Indications")

warnA = text(drugA_fda, "Warnings")
warnB = text(drugB_fda, "Warnings")
features["Purpose_A"] = purposeA
features["Purpose_B"] = purposeB

features["Indications_A"] = indA
features["Indications_B"] = indB

features["Warnings_A"] = warnA
features["Warnings_B"] = warnB

features["Formula_Length_Diff"] = abs(len(formulaA)-len(formulaB))
features["Purpose_Length_Diff"] = abs(len(purposeA)-len(purposeB))
features["Indication_Length_Diff"] = abs(len(indA)-len(indB))
features["Warning_Length_Diff"] = abs(len(warnA)-len(warnB))

features["Missing_Purpose_A"] = int(len(purposeA)==0)
features["Missing_Purpose_B"] = int(len(purposeB)==0)

features["Missing_Indications_A"] = int(len(indA)==0)
features["Missing_Indications_B"] = int(len(indB)==0)

features["Missing_Warnings_A"] = int(len(warnA)==0)
features["Missing_Warnings_B"] = int(len(warnB)==0)

features["Formula_Length_A"] = len(formulaA)
features["Formula_Length_B"] = len(formulaB)

features["Same_Formula"] = int(formulaA == formulaB)

features["Purpose_Length_A"] = len(purposeA)
features["Purpose_Length_B"] = len(purposeB)

features["Indication_Length_A"] = len(indA)
features["Indication_Length_B"] = len(indB)

features["Warning_Length_A"] = len(warnA)
features["Warning_Length_B"] = len(warnB)

features["XLogP_Diff"] = abs(features["XLogP_A"]-features["XLogP_B"])
features["TPSA_Diff"] = abs(features["TPSA_A"]-features["TPSA_B"])
features["Complexity_Diff"] = abs(features["Complexity_A"]-features["Complexity_B"])
features["ExactMass_Diff"] = abs(features["ExactMass_A"]-features["ExactMass_B"])
features["HeavyAtom_Diff"] = abs(features["HeavyAtoms_A"]-features["HeavyAtoms_B"])
features["Rotatable_Diff"] = abs(features["Rotatable_A"]-features["Rotatable_B"])
features["HBondDonor_Diff"] = abs(features["HDonor_A"]-features["HDonor_B"])
features["HBondAcceptor_Diff"] = abs(features["HAcceptor_A"]-features["HAcceptor_B"])

features["Same_Charge"] = int(
    features["Charge_A"] == features["Charge_B"]
)



# ==========================================================
# Part 2B : Generate RDKit Molecular Descriptors
# ==========================================================

from rdkit import Chem
from rdkit.Chem import Descriptors, rdMolDescriptors, Crippen



# ==========================================================
# RDKit FEATURE FUNCTION
# ==========================================================

def get_rdkit_features(smiles):

    result = {

        "MolWt": 0,
        "LogP": 0,
        "TPSA": 0,
        "HDonor": 0,
        "HAcceptor": 0,
        "Rotatable": 0,
        "RingCount": 0,
        "AromaticRings": 0,
        "Fingerprint": [0] * 128

    }

    if pd.isna(smiles) or str(smiles).strip() == "":
        return result

    try:

        mol = Chem.MolFromSmiles(str(smiles))

        if mol is None:
            return result

        result["MolWt"] = Descriptors.MolWt(mol)
        result["LogP"] = Crippen.MolLogP(mol)
        result["TPSA"] = rdMolDescriptors.CalcTPSA(mol)
        result["HDonor"] = rdMolDescriptors.CalcNumHBD(mol)
        result["HAcceptor"] = rdMolDescriptors.CalcNumHBA(mol)
        result["Rotatable"] = rdMolDescriptors.CalcNumRotatableBonds(mol)
        result["RingCount"] = rdMolDescriptors.CalcNumRings(mol)
        result["AromaticRings"] = rdMolDescriptors.CalcNumAromaticRings(mol)

        fp = rdMolDescriptors.GetMorganFingerprintAsBitVect(
            mol,
            radius=2,
            nBits=128
        )

        result["Fingerprint"] = list(fp)

    except Exception:
        pass

    return result

# ==========================================================
# GET SMILES
# ==========================================================

smiles_A = features.get("SMILES_A", "")
smiles_B = features.get("SMILES_B", "")

# ==========================================================
# COMPUTE RDKIT FEATURES
# ==========================================================




# ==========================================================
# Part 3 : RDKit Difference Features + Morgan Fingerprints
#            + Arrange Features for CatBoost
# ==========================================================



# ==========================================================
# RDKIT DESCRIPTORS
# ==========================================================

features["RDKit_MolWt_A"] = rdA["MolWt"]
features["RDKit_MolWt_B"] = rdB["MolWt"]

features["RDKit_LogP_A"] = rdA["LogP"]
features["RDKit_LogP_B"] = rdB["LogP"]

features["RDKit_TPSA_A"] = rdA["TPSA"]
features["RDKit_TPSA_B"] = rdB["TPSA"]

features["RDKit_HDonor_A"] = rdA["HDonor"]
features["RDKit_HDonor_B"] = rdB["HDonor"]

features["RDKit_HAcceptor_A"] = rdA["HAcceptor"]
features["RDKit_HAcceptor_B"] = rdB["HAcceptor"]

features["RDKit_Rotatable_A"] = rdA["Rotatable"]
features["RDKit_Rotatable_B"] = rdB["Rotatable"]

features["RDKit_RingCount_A"] = rdA["RingCount"]
features["RDKit_RingCount_B"] = rdB["RingCount"]

features["RDKit_AromaticRings_A"] = rdA["AromaticRings"]
features["RDKit_AromaticRings_B"] = rdB["AromaticRings"]

# ==========================================================
# RDKIT DIFFERENCE FEATURES
# ==========================================================

features["RDKit_MolWt_Diff"] = abs(
    rdA["MolWt"] - rdB["MolWt"]
)

features["RDKit_LogP_Diff"] = abs(
    rdA["LogP"] - rdB["LogP"]
)

features["RDKit_TPSA_Diff"] = abs(
    rdA["TPSA"] - rdB["TPSA"]
)

features["RDKit_HDonor_Diff"] = abs(
    rdA["HDonor"] - rdB["HDonor"]
)

features["RDKit_HAcceptor_Diff"] = abs(
    rdA["HAcceptor"] - rdB["HAcceptor"]
)

features["RDKit_Rotatable_Diff"] = abs(
    rdA["Rotatable"] - rdB["Rotatable"]
)

features["RDKit_RingCount_Diff"] = abs(
    rdA["RingCount"] - rdB["RingCount"]
)

features["RDKit_AromaticRing_Diff"] = abs(
    rdA["AromaticRings"] - rdB["AromaticRings"]
)

# ==========================================================
# MORGAN FINGERPRINTS (128 + 128)
# ==========================================================

for i in range(128):
    features[f"FP_{i}_A"] = rdA["Fingerprint"][i]

for i in range(128):
    features[f"FP_{i}_B"] = rdB["Fingerprint"][i]



# ==========================================================
# CREATE DATAFRAME
# ==========================================================

feature_df = pd.DataFrame([features])



# ==========================================================
# LOAD EXPECTED FEATURE ORDER
# ==========================================================

expected_features = feature_columns

# ==========================================================
# ADD ANY MISSING FEATURES
# ==========================================================

for col in expected_features:

    if col not in feature_df.columns:

        feature_df[col] = 0

# ==========================================================
# REMOVE EXTRA COLUMNS
# ==========================================================

feature_df = feature_df[expected_features]



assert feature_df.shape[1] == len(expected_features)



# ==========================================================
# HANDLE CATEGORICAL FEATURES
# ==========================================================

categorical_columns = [
    "Drug_A",
    "Drug_B",
    "Formula_A",
    "Formula_B"
]

for col in categorical_columns:

    feature_df[col] = (
        feature_df[col]
        .fillna("Unknown")
        .astype(str)
    )



# ==========================================================
# Part 4 : Load CatBoost Model & Predict Interaction
# ==========================================================


from catboost import CatBoostClassifier



# ==========================================================
# MAKE PREDICTION
# ==========================================================



prediction = model.predict(feature_df)
probabilities = model.predict_proba(feature_df)

# ==========================================================
# EXTRACT RESULTS
# ==========================================================

predicted_level = prediction[0][0]

confidence = float(np.max(probabilities)) * 100

predicted_index = int(np.argmax(probabilities))



# ==========================================================
# SHOW ALL CLASS PROBABILITIES
# ==========================================================

# print("\nProbability Distribution")
# print("-----------------------------")

# for label, prob in zip(class_labels, probabilities[0]):
#     print(f"{label:<10} : {prob*100:.2f}%")

# # ==========================================================
# # COMPARE WITH DATASET LABEL
# # ==========================================================

# if pair_exists:
#     actual_level= pair["Level"]
# else:
#     actual_level="Unknown"


# print("\nComparison")
# print("-----------------------------")
# print("Dataset Level   :", actual_level)
# print("Predicted Level :", predicted_level)

# if str(actual_level) == str(predicted_level):
#     print("✓ Prediction matches dataset.")
# else:
#     print("⚠ Prediction differs from stored dataset label.")



# ==========================================================
# Part 5 : Display Final Interaction Report
# ==========================================================
import re

def print_points(text, max_points=5):

    if not text or str(text).strip() == "":
        print("Not Available")
        return

    text = str(text)

    # Remove common headings
    text = re.sub(
        r'^(Purpose|Uses?|Warnings?|Indications?|Directions)\s*:?',
        '',
        text,
        flags=re.IGNORECASE
    ).strip()

    # Break before important keywords
    keywords = [
        "Do not use",
        "Ask a doctor before use",
        "Ask a doctor or pharmacist before use",
        "When using this product",
        "Stop use",
        "If pregnant",
        "Keep out of reach of children",
        "Seek medical help",
        "Allergy alert",
        "Liver warning",
        "Stomach bleeding warning",
        "Uses",
        "Temporarily relieves",
        "For the temporary relief"
    ]

    for k in keywords:
        text = re.sub(
            rf'(?i){re.escape(k)}',
            "\n" + k,
            text
        )

    parts = re.split(r'\n|[.;]', text)

    shown = set()
    count = 0

    for part in parts:

        part = part.strip(" :-")

        if len(part) < 12:
            continue

        if "INDICATIONS AND USAGE" in part.upper():
            continue

        if "Limitations of Use" in part:
            continue

        if part.lower() in shown:
            continue

        shown.add(part.lower())

        print(f"• {part}")

        count += 1

        if count >= max_points:
            break

    if count == 0:
        print("Not Available")

print("\n" + "=" * 70)
print("           MEDGUARD AI - FINAL REPORT")
print("=" * 70)

# ==========================================================
# INTERACTION SUMMARY
# ==========================================================

print(f"\nDrug 1 : {drug1.title()}")
print(f"Drug 2 : {drug2.title()}")

print("\nPredicted Interaction Level :", predicted_level)


print("\nProbability Distribution")
print("-----------------------------")

for label, prob in zip(class_labels, probabilities[0]):
    print(f"{label:<10} : {prob*100:.2f}%")
# ==========================================================
# COMPARE WITH DATASET LABEL
# ==========================================================

if pair_exists:
    actual_level= pair["Level"]
else:
    actual_level="Unknown"


print("\nComparison")
print("-----------------------------")
print("Dataset Level   :", actual_level)
print("Predicted Level :", predicted_level)

if str(actual_level) == str(predicted_level):
    print("✓ Prediction matches dataset.")
else:
    print("⚠ Prediction differs from stored dataset label.")
# ==========================================================
# SEVERITY MESSAGE
# ==========================================================

severity_messages = {

    "Major": (
        "High-risk interaction. Avoid using together unless "
        "specifically advised by a healthcare professional."
    ),

    "Moderate": (
        "Moderate interaction detected. Dose adjustment or "
        "careful monitoring may be required."
    ),

    "Minor": (
        "Minor interaction. Usually safe, but monitor for "
        "unexpected side effects."
    ),

    "None": (
        "No clinically significant interaction detected."
    )

}

print("\nSeverity")
print("-" * 40)
print(severity_messages.get(
    str(predicted_level),
    "Interaction information unavailable."
))

# ==========================================================
# PURPOSE
# ==========================================================

# print("\nPurpose")
# print("-" * 40)

# print(f"{drug1.title()} :")
purposeA = features.get("Purpose_A", "").strip()

# if purposeA:
#     print(purposeA)
# else:
#     print("Not Available")

# print()

# print(f"{drug2.title()} :")
purposeB = features.get("Purpose_B", "").strip()

# if purposeB:
#     print(purposeB)
# else:
#     print("Not Available")

print("\nPurpose")
print("-" * 40)

print(f"{drug1.title()} :")
print_points(purposeA, max_points=2)

print()

print(f"{drug2.title()} :")
print_points(purposeB, max_points=2)
# ==========================================================
# INDICATIONS
# ==========================================================

# print("\nIndications")
# print("-" * 40)

# print(f"{drug1.title()} :")
indicationA = features.get("Indications_A", "").strip()

# if indicationA:
#     print(indicationA)
# else:
#     print("Not Available")

# print()

# print(f"{drug2.title()} :")
indicationB = features.get("Indications_B", "").strip()

# if indicationB:
#     print(indicationB)
# else:
#     print("Not Available")
print("\nIndications")
print("-" * 40)

print(f"{drug1.title()} :")
print_points(indicationA, max_points=4)

print()

print(f"{drug2.title()} :")
print_points(indicationB, max_points=4)

# ==========================================================
# WARNINGS
# ==========================================================

# print("\nWarnings")
# print("-" * 40)

# print(f"{drug1.title()} :")
# print(features.get("Warnings_A", "Not Available"))

# print()

# print(f"{drug2.title()} :")
# print(features.get("Warnings_B", "Not Available"))

print("\nWarnings")
print("-" * 40)

print(f"{drug1.title()} :")
print_points(features.get("Warnings_A", ""), max_points=5)

print()

print(f"{drug2.title()} :")
print_points(features.get("Warnings_B", ""), max_points=5)



# ==========================================================
# MODEL CONFIDENCE
# ==========================================================

print("\nModel Confidence")
print("-" * 40)

if confidence >= 95:
    remark = "Excellent confidence"
elif confidence >= 85:
    remark = "High confidence"
elif confidence >= 70:
    remark = "Good confidence"
elif confidence >= 50:
    remark = "Moderate confidence"
else:
    remark = "Low confidence"

print(f"{confidence:.2f}% ({remark})")

# ==========================================================
# RECOMMENDATION
# ==========================================================

print("\nRecommendation")
print("-" * 40)

if str(predicted_level).lower() == "major":

    print("- Avoid taking these medicines together unless prescribed.")
    print("- Contact your doctor immediately if already taking both.")
    print("- Watch closely for unusual symptoms.")

elif str(predicted_level).lower() == "moderate":

    print("- Consult your physician before combining them.")
    print("- Dose adjustment may be necessary.")
    print("- Monitor for adverse reactions.")

elif str(predicted_level).lower() == "minor":

    print("- Interaction risk is low.")
    print("- Continue normal monitoring.")
    print("- Inform your doctor if symptoms appear.")

else:

    print("- No significant interaction detected.")
    print("- Continue medicines as prescribed.")
    print("- Always follow professional medical advice.")


# ==========================================================
# FINISH
# ==========================================================

print("\n" + "=" * 70)
print("Prediction Completed Successfully!")
print("=" * 70)