import pandas as pd
import os

files = [
    r"C:\Users\krish\Downloads\hospital_pharmacy_ml_dataset.xlsx",
    r"C:\Users\krish\Downloads\auto_order_system.xlsx"
]

for f in files:
    print(f"\n{'='*20}")
    print(f"FILE: {os.path.basename(f)}")
    print(f"{'='*20}")
    try:
        df = pd.read_excel(f)
        print("\nCOLUMNS:")
        for col in df.columns:
            print(f" - {col}")
        
        print("\nSAMPLE DATA (First 3 rows):")
        print(df.head(3).to_markdown())
    except Exception as e:
        print(f"Error reading {f}: {e}")
