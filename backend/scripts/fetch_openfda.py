import pandas as pd
import requests
import time
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

drug_file = BASE_DIR / "datasets" / "raw" / "drug_names.tsv"

drugs = pd.read_csv(
    drug_file,
    sep="\t",
    header=None,
    names=["Drug_ID", "Drug_Name"]
)

results = []

for drug in drugs["Drug_Name"].unique():

    print("Searching:", drug)

    url = (
        "https://api.fda.gov/drug/label.json?"
        f"search=openfda.generic_name:{drug}&limit=1"
    )

    try:

        r = requests.get(url, timeout=10)

        if r.status_code == 200:

            data = r.json()["results"][0]

            results.append({

                "Drug_Name": drug,

                "Purpose": " ".join(
                    data.get("purpose", [""])
                ),

                "Indications": " ".join(
                    data.get("indications_and_usage", [""])
                ),

                "Warnings": " ".join(
                    data.get("warnings", [""])
                )

            })

    except:
        pass

    time.sleep(0.2)

df = pd.DataFrame(results)

save = BASE_DIR / "datasets" / "processed" / "openfda_data.csv"

df.to_csv(save, index=False)

print(df.head())

print("Saved:", save)