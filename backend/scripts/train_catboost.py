import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

from catboost import CatBoostClassifier

print("=" * 60)
print("MedGuard AI - CatBoost Training")
print("=" * 60)

# ==========================================================
# LOAD DATASET
# ==========================================================

DATA_PATH = "backend/datasets/processed/training_dataset_v2.csv"

df = pd.read_csv(
    DATA_PATH,
    low_memory=False
)

print("\nDataset Shape :", df.shape)

# ==========================================================
# FEATURES & TARGET
# ==========================================================

TARGET = "Level"

DROP_COLUMNS = [

    TARGET,

    # Raw text (used by predict.py, not training)
    "Purpose_A",
    "Purpose_B",
    "Indications_A",
    "Indications_B",
    "Warnings_A",
    "Warnings_B",

    # Raw chemistry strings
    "SMILES_A",
    "SMILES_B",

    # Pair identifier
    "DrugPair"

]

X = df.drop(columns=DROP_COLUMNS)

y = df[TARGET]
print("\nNumber of Features :", X.shape[1])

fp_cols = [c for c in X.columns if c.startswith("FP_")]
print("Fingerprint Features :", len(fp_cols))

# ==========================================================
# CONVERT OBJECT COLUMNS TO STRING
# ==========================================================

for col in X.columns:
    if X[col].dtype == "object":
        X[col] = X[col].fillna("Unknown").astype(str)

# ==========================================================
# CATEGORICAL FEATURES
# ==========================================================

categorical_columns = [

    "Drug_A",

    "Drug_B",

    "Formula_A",

    "Formula_B"

]
cat_features = [
    X.columns.get_loc(col)
    for col in categorical_columns
]

print("\nCategorical Features\n")

for col in categorical_columns:
    print(col)

# ==========================================================
# TRAIN / TEST SPLIT
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)

print("\nTraining Samples :", len(X_train))
print("Testing Samples  :", len(X_test))

# ==========================================================
# CATBOOST MODEL
# ==========================================================

model = CatBoostClassifier(

    iterations=6000,

    learning_rate=0.025,

    depth=8,

    loss_function="MultiClass",

    eval_metric="Accuracy",

    auto_class_weights="Balanced",

    random_seed=42,

    l2_leaf_reg=10,

    random_strength=1,

    bootstrap_type="Bayesian",

    bagging_temperature=0.5,

    grow_policy="SymmetricTree",

    border_count=254,

    od_type="Iter",

    od_wait=400,

    verbose=100

)

print("\nTraining Model...\n")

model.fit(

    X_train,

    y_train,

    cat_features=cat_features,

    eval_set=(X_test, y_test),

    use_best_model=True

)

# ==========================================================
# PREDICTIONS
# ==========================================================

pred = model.predict(X_test)
pred = pred.flatten()

prob = model.predict_proba(X_test)

# ==========================================================
# RESULTS
# ==========================================================

accuracy = accuracy_score(
    y_test,
    pred
)

print("\nAccuracy :", round(accuracy, 4))

print("\nClassification Report\n")

print(

    classification_report(

        y_test,

        pred,

        digits=4

    )

)

print("\nConfusion Matrix\n")

print(

    confusion_matrix(

        y_test,

        pred

    )

)

# ==========================================================
# CONFIDENCE
# ==========================================================

confidence = prob.max(axis=1)

print("\nPrediction Confidence")

print("--------------------------------")

print(

    "Average : {:.2f}%".format(

        confidence.mean() * 100

    )

)

print(

    "Maximum : {:.2f}%".format(

        confidence.max() * 100

    )

)

print(

    "Minimum : {:.2f}%".format(

        confidence.min() * 100

    )

)

# ==========================================================
# FEATURE IMPORTANCE
# ==========================================================

importance = pd.DataFrame({

    "Feature": X.columns,

    "Importance": model.get_feature_importance()

})

importance = importance.sort_values(

    by="Importance",

    ascending=False

)

print("\nTop 40 Important Features\n")

print(importance.head(40))

# ==========================================================
# SAVE MODEL
# ==========================================================

os.makedirs(
    "backend/models",
    exist_ok=True
)

model.save_model(
    "backend/models/catboost_model.cbm"
)

joblib.dump(

    list(X.columns),

    "backend/models/catboost_features.pkl"

)

joblib.dump(

    list(model.classes_),

    "backend/models/class_labels.pkl"

)

print("\nModel Saved Successfully!")

print("backend/models/catboost_model.cbm")

print("backend/models/catboost_features.pkl")

print("backend/models/class_labels.pkl")