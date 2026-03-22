import pandas as pd
import os

files = [
    r"C:\Users\krish\Downloads\hospital_pharmacy_ml_dataset.xlsx",
    r"C:\Users\krish\Downloads\auto_order_system.xlsx"
]

for f in files:
    print(f"\n--- FILE: {os.path.basename(f)} ---")
    try:
        df = pd.read_excel(f)
        print("Columns:", df.columns.tolist())
        print("\nFirst 5 rows:")
        print(df.head(5).to_string())
        print("\nData Types:")
        print(df.dtypes)
    except Exception as e:
        print(f"Error reading {f}: {e}")
