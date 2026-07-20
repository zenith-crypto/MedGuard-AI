import pandas as pd
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import Descriptors
from rdkit.Chem import rdMolDescriptors

BASE_DIR = Path(__file__).resolve().parent.parent

pubchem_path = BASE_DIR / "datasets" / "processed" / "pubchem_data.csv"

pubchem = pd.read_csv(pubchem_path)

# --------------------------------------------------
# Calculate RDKit descriptors
# --------------------------------------------------

mol_weight = []
logp = []
tpsa = []
h_donor = []
h_acceptor = []
rotatable = []
rings = []
aromatic = []

# Morgan Fingerprints (128 bits)

fingerprints = {
    f"FP_{i}": []
    for i in range(128)
}


for smiles in pubchem["SMILES"]:

    if pd.isna(smiles):

        mol_weight.append(0)
        logp.append(0)
        tpsa.append(0)
        h_donor.append(0)
        h_acceptor.append(0)
        rotatable.append(0)
        rings.append(0)
        aromatic.append(0)

        for i in range(128):
            fingerprints[f"FP_{i}"].append(0)

        continue

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:

        mol_weight.append(0)
        logp.append(0)
        tpsa.append(0)
        h_donor.append(0)
        h_acceptor.append(0)
        rotatable.append(0)
        rings.append(0)
        aromatic.append(0)

        for i in range(128):
            fingerprints[f"FP_{i}"].append(0)

        continue

    mol_weight.append(Descriptors.MolWt(mol))
    logp.append(Descriptors.MolLogP(mol))
    tpsa.append(Descriptors.TPSA(mol))
    h_donor.append(Descriptors.NumHDonors(mol))
    h_acceptor.append(Descriptors.NumHAcceptors(mol))
    rotatable.append(Descriptors.NumRotatableBonds(mol))
    rings.append(Descriptors.RingCount(mol))
    aromatic.append(Descriptors.NumAromaticRings(mol))

    fp = rdMolDescriptors.GetMorganFingerprintAsBitVect(
        mol,
        radius=2,
        nBits=128
    )

    for i, bit in enumerate(fp):
        fingerprints[f"FP_{i}"].append(bit)

for col, values in fingerprints.items():
    pubchem[col] = values

pubchem["RDKit_MolWt"] = mol_weight
pubchem["RDKit_LogP"] = logp
pubchem["RDKit_TPSA"] = tpsa
pubchem["RDKit_HDonor"] = h_donor
pubchem["RDKit_HAcceptor"] = h_acceptor
pubchem["RDKit_Rotatable"] = rotatable
pubchem["RDKit_RingCount"] = rings
pubchem["RDKit_AromaticRings"] = aromatic
for i in range(128):
    pubchem[f"FP_{i}"] = fingerprints[f"FP_{i}"]
pubchem.to_csv(pubchem_path, index=False)

print("=" * 60)
print("RDKit Features Added Successfully")
print("=" * 60)

print(pubchem.head())

print("\nColumns:")
print(pubchem.columns.tolist())