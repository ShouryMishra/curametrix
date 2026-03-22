import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime
import json
import os

# ==========================================
# 1. LOAD REAL DATA
# ==========================================
MAIN_DATASET = r"C:\Users\krish\Downloads\hospital_pharmacy_ml_dataset.xlsx"
SEASONAL_DATA = r"C:\Users\krish\Downloads\auto_order_system.xlsx"

def load_and_preprocess():
    print("Loading datasets...")
    df = pd.read_excel(MAIN_DATASET)
    
    # Process sale_date
    df['sale_date'] = pd.to_datetime(df['sale_date'])
    df['month'] = df['sale_date'].dt.month
    df['year'] = df['sale_date'].dt.year
    
    # Load seasonal multipliers
    df_seasonal = pd.read_excel(SEASONAL_DATA, skiprows=2) # Skip headers
    # Mapping months to columns 6-17 (Jan-Dec)
    monthly_cols = df_seasonal.columns[6:18]
    
    return df, df_seasonal

# ==========================================
# 2. TRAINING MODEL ON REAL COLS
# ==========================================
def train_real_model(df):
    print("Training model on real-world columns...")
    # Features: month, price, pharmacy_type
    # We need to encode categorical data
    df_encoded = pd.get_dummies(df, columns=['drug_category', 'pharmacy_type'])
    
    features = ['month', 'price_per_unit_inr'] + [c for c in df_encoded.columns if c.startswith('drug_category_') or c.startswith('pharmacy_type_')]
    
    X = df_encoded[features]
    y = df_encoded['units_sold']
    
    model = RandomForestRegressor(n_estimators=100)
    model.fit(X, y)
    
    return model, features

# ==========================================
# 3. REORDERING LOGIC (30-DAY RULE)
# ==========================================
def predict_reorders(model, features, current_inventory, month):
    # This would simulate predictions for all drugs in inventory
    # For now, let's show the logic
    print(f"\nAnalyzing inventory for Month {month}...")
    
    # Logic: 
    # if remaining_stock < reorder_level: TRIGGER
    # Amount = predicted_demand_next_30_days - current_stock
    
    reorders = []
    # (In a real scenario, we loop through all unique drugs)
    # ...
    
    return reorders

import joblib

# ==========================================
# MAIN
# ==========================================
try:
    df, df_seasonal = load_and_preprocess()
    model, features = train_real_model(df)
    
    print("\nSUCCESS: Model trained on real datasets.")
    print(f"Columns used: {df.columns.tolist()[:10]}...")
    
    # Save the trained model and features
    joblib.dump(model, 'ml/trained_prediction_model.joblib')
    joblib.dump(features, 'ml/model_features.joblib')
    print("✅ SUCCESS: Live Model and Features exported to the /ml folder!")
    
    # Example notification trigger
    critical_drugs = df[df['reorder_flag'] == 'YES']['drug_name'].unique()
    print(f"\nALERT: {len(critical_drugs)} drugs flagged for reorder by the system.")
    for drug in critical_drugs[:5]:
        print(f" - {drug}: Reorder Flag active in dataset.")

except Exception as e:
    print(f"Error during training: {e}")
