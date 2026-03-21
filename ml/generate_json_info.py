import pandas as pd
import json
import os

files = [
    r"C:\Users\krish\Downloads\hospital_pharmacy_ml_dataset.xlsx",
    r"C:\Users\krish\Downloads\auto_order_system.xlsx"
]

info = {}
for f in files:
    try:
        df = pd.read_excel(f)
        info[os.path.basename(f)] = {
            "columns": df.columns.tolist(),
            "sample": df.head(5).to_dict(orient='records')
        }
    except Exception as e:
        info[os.path.basename(f)] = {"error": str(e)}

with open(r"d:\CuraMatrix\ml\dataset_info.json", "w") as f:
    json.dump(info, f, indent=2)
