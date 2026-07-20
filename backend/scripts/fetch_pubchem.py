import pandas as pd
import requests
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

drug_file = BASE_DIR / "datasets" / "raw" / "drug_names.tsv"

drug_df = pd.read_csv(
    drug_file,
    sep="\t",
    header=None,
    names=["Drug_ID", "Drug_Name"]
)

results = []

for drug in drug_df["Drug_Name"].unique():

    url = (
    f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{drug}/property/"
    "MolecularFormula,"
    "MolecularWeight,"
    "ConnectivitySMILES,"
    "XLogP,"
    "TPSA,"
    "Complexity,"
    "HBondDonorCount,"
    "HBondAcceptorCount,"
    "RotatableBondCount,"
    "HeavyAtomCount,"
    "Charge,"
    "ExactMass/JSON"
     )

    try:
        r = requests.get(url, timeout=10)

        if r.status_code == 200:

            data = r.json()

            prop = data["PropertyTable"]["Properties"][0]

            results.append({
    "Drug_Name": drug,

    "MolecularFormula": prop.get("MolecularFormula"),
    "MolecularWeight": prop.get("MolecularWeight"),

    "SMILES": prop.get("ConnectivitySMILES"),

    "XLogP": prop.get("XLogP"),

    "TPSA": prop.get("TPSA"),

    "Complexity": prop.get("Complexity"),

    "HBondDonorCount": prop.get("HBondDonorCount"),

    "HBondAcceptorCount": prop.get("HBondAcceptorCount"),

    "RotatableBondCount": prop.get("RotatableBondCount"),

    "HeavyAtomCount": prop.get("HeavyAtomCount"),

    "Charge": prop.get("Charge"),

    "ExactMass": prop.get("ExactMass")
    })

        else:
            print(f"Not found: {drug}")

    except Exception:
        print(f"Error: {drug}")

    time.sleep(0.2)

pubchem_df = pd.DataFrame(results)

save_path = BASE_DIR / "datasets" / "processed" / "pubchem_data.csv"

pubchem_df.to_csv(save_path, index=False)

print("Saved to:")
print(save_path)

print(pubchem_df.head())