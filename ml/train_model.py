import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime, timedelta
import json

# ==========================================
# 1. SYNTHETIC DATA GENERATION (5 YEARS)
# ==========================================
def generate_synthetic_data(num_years=5):
    dates = pd.date_range(start='2021-01-01', periods=num_years*365, freq='D')
    medicines = ['Paracetamol', 'Amoxicillin', 'Insulin', 'Cetirizine', 'Azithromycin']
    pharmacies = [
        {'name': 'City General', 'type': 'Central', 'license': 'LIC-001'},
        {'name': 'Main Street Pharma', 'type': 'Retail', 'license': 'LIC-002'}
    ]
    
    data = []
    for date in dates:
        # Simulate Weather (Temp: 10-40C, Humidity: 20-90%)
        month = date.month
        temp = 25 + 10 * np.sin(2 * np.pi * (month-1) / 12) + np.random.normal(0, 2)
        humidity = 50 + 20 * np.cos(2 * np.pi * (month-1) / 12) + np.random.normal(0, 5)
        
        for med in medicines:
            # Base demand
            base_demand = np.random.randint(10, 50)
            
            # Seasonal/Weather adjustments
            if med == 'Paracetamol' and temp > 32: base_demand *= 1.5 # Heat related fever
            if med == 'Cetirizine' and month in [3, 4, 10]: base_demand *= 2.0 # Allergy seasons
            if med == 'Amoxicillin' and humidity > 70: base_demand *= 1.3 # Bacterial infections in monsoon
            
            for ph in pharmacies:
                data.append({
                    'date': date,
                    'medicine_name': med,
                    'pharmacy_name': ph['name'],
                    'pharmacy_type': ph['type'],
                    'pharmacy_license': ph['license'],
                    'units_sold': int(base_demand + np.random.normal(0, 5)),
                    'unit_price': 5.0 if med == 'Paracetamol' else 25.0,
                    'manufacturer': 'Aetrix Pharma',
                    'category': 'Antibiotic' if med in ['Amoxicillin', 'Azithromycin'] else 'General',
                    'temp': temp,
                    'humidity': humidity
                })
    
    return pd.DataFrame(data)

# ==========================================
# 2. FEATURE ENGINEERING & TRAINING
# ==========================================
def train_model(df):
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek
    
    # Simple model for each drug
    models = {}
    for med in df['medicine_name'].unique():
        med_df = df[df['medicine_name'] == med]
        X = med_df[['month', 'day_of_week', 'temp', 'humidity']]
        y = med_df['units_sold']
        
        model = RandomForestRegressor(n_estimators=100)
        model.fit(X, y)
        models[med] = model
        
    return models

# ==========================================
# 3. REORDERING LOGIC (30-DAY RULE)
# ==========================================
def generate_order_list(models, current_inventory, weather_forecast):
    orders = []
    
    for med, stock in current_inventory.items():
        # Predict average daily demand for next 30 days
        # (Assuming weather_forecast is avg temp/hum for next month)
        next_month = datetime.now().month
        X_pred = pd.DataFrame([{
            'month': next_month,
            'day_of_week': 3, # Avg day
            'temp': weather_forecast['temp'],
            'humidity': weather_forecast['humidity']
        }])
        
        avg_daily_pred = models[med].predict(X_pred)[0]
        needed_30_days = avg_daily_pred * 30
        
        if stock < needed_30_days:
            order_qty = int(needed_30_days * 1.2 - stock) # 20% Buffer
            unit_price = 10.0 # Placeholder
            orders.append({
                'medicine_name': med,
                'order_amount': order_qty,
                'unit_price': unit_price,
                'total_price': round(order_qty * unit_price, 2),
                'manufacturer': 'Aetrix Pharma',
                'category': 'General',
                'pharmacy_name': 'City General',
                'pharmacy_type': 'Central',
                'pharmacy_license': 'LIC-001'
            })
        elif stock > needed_30_days * 3:
            # Transfer logic
            print(f"[TRANSFER ADVISORY] {med}: Excess stock ({stock} units). Consider inter-hospital transfer.")
            
    return orders

# ==========================================
# MAIN EXECUTION (Simulation)
# ==========================================
print("Generating 5 years of historical data...")
df_history = generate_synthetic_data()

print("Training forecasting models...")
models = train_model(df_history)

# Simulated Current State
current_stock = {
    'Paracetamol': 200,   # Low
    'Amoxicillin': 1500,  # High
    'Insulin': 400,
    'Cetirizine': 50,     # Very Low
    'Azithromycin': 600
}

# Simulated Weather Forecast (Next 30 days)
weather = {'temp': 35, 'humidity': 80} # Hot and Humid

print("\nGenerating Automated Order List...")
order_list = generate_order_list(models, current_stock, weather)

print("\n--- FINAL ORDER LIST FOR ADMIN APPROVAL ---")
print(pd.DataFrame(order_list))

# Save for Colab usage
df_history.to_csv('synthetic_pharmacy_data.csv', index=False)
