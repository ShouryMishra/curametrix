from http.server import BaseHTTPRequestHandler
import joblib
import json
import os
import sys

# Pre-load the model globally so warm functions respond instantly
try:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'trained_prediction_model.joblib')
    features_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'model_features.joblib')
    # fallback to absolute if running tightly
    if not os.path.exists(model_path):
        model_path = 'ml/trained_prediction_model.joblib'
        features_path = 'ml/model_features.joblib'
        
    model = joblib.load(model_path)
    features_list = joblib.load(features_path)
except Exception as e:
    model = None
    features_list = []
    print("Error loading model:", e)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
    def do_POST(self):
        try:
            # 1. Get data from the webpage
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            if not post_data:
                raise ValueError("Empty request body")
                
            data = json.loads(post_data)
            
            if model is None:
                raise Exception("Model failed to load on server")
                
            # 2. RUN PREDICTION
            # Feature array from the frontend e.g. [3, 25.5, 0, 1, 0...]
            user_features = data.get('features', [])
            
            # Pad with zeros if frontend didn't send enough features (avoids crashing)
            if len(user_features) < len(features_list):
                user_features.extend([0] * (len(features_list) - len(user_features)))
            elif len(user_features) > len(features_list):
                user_features = user_features[:len(features_list)]
                
            prediction = model.predict([user_features]) 
            
            # 3. SEND RESPONSE
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'predicted_demand': int(prediction[0]), 'features_used': len(features_list)}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
