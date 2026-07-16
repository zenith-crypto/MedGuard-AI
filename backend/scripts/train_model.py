from pathlib import Path
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder

# ----------------------------
# Load Dataset
# ----------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

data = pd.read_csv(
    BASE_DIR / "datasets" / "processed" / "cleaned_side_effects.csv"
)

print("Dataset Loaded:", data.shape)

# ----------------------------
# Keep Required Columns
# ----------------------------

data = data[["Drug_Name", "SideEffect_Name"]]

# ----------------------------
# Encode Text to Numbers
# ----------------------------

drug_encoder = LabelEncoder()
sideeffect_encoder = LabelEncoder()

data["Drug_Label"] = drug_encoder.fit_transform(data["Drug_Name"])

data["SideEffect_Label"] = sideeffect_encoder.fit_transform(
    data["SideEffect_Name"]
)

print("\nEncoded Dataset:")
print(data.head())

print("\nTotal Drugs:", len(drug_encoder.classes_))
print("Total Side Effects:", len(sideeffect_encoder.classes_))

from sklearn.model_selection import train_test_split

X = data["Drug_Label"]
y = data["SideEffect_Label"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))

# ----------------------------
# Train Decision Tree
# ----------------------------

model = DecisionTreeClassifier(random_state=42)

model.fit(X_train.values.reshape(-1, 1), y_train)

print("Decision Tree training completed!")

# ----------------------------
# Predictions
# ----------------------------

y_pred = model.predict(X_test.values.reshape(-1, 1))

print("Prediction completed!")

accuracy = accuracy_score(y_test, y_pred)

print(f"\nAccuracy: {accuracy:.4f}")