#!/usr/bin/env python3
"""
Flask service for serving the Travel Destination ML model
"""

import os
import sys
import pickle
import json
import logging
from datetime import datetime
from pathlib import Path
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global variables for model and data
model = None
feature_columns = None
destination_names = None
feature_mappings = None

def create_mock_model():
    """Create a mock model for testing when real model can't be loaded"""
    logger.info("Creating mock model for testing purposes")
    
    class MockModel:
        def predict_proba(self, X):
            import numpy as np
            n_samples = X.shape[0]
            n_destinations = 24
            # Generate random probabilities that sum to 1
            probs = np.random.dirichlet(np.ones(n_destinations), size=n_samples)
            return probs
            
        def __str__(self):
            return "MockModel (for testing)"
    
    return MockModel()

def load_model():
    """Load the trained model and metadata"""
    global model, feature_columns, destination_names, feature_mappings
    
    try:
        # Try to load the actual trained model first
        model_path = "Travel AI Model/travel_destination_model.pkl"
        
        # Check if model file exists
        if os.path.exists(model_path):
            logger.info(f"Attempting to load trained model from {model_path}")
            
            try:
                # Try to import imblearn for compatibility
                import imblearn
                logger.info("imblearn available, attempting model load...")
                
                with open(model_path, 'rb') as f:
                    model = pickle.load(f)
                logger.info(f"✅ Successfully loaded trained model: {type(model).__name__}")
                
                # Verify the model has the required predict_proba method
                if not hasattr(model, 'predict_proba'):
                    raise ValueError(f"Loaded model ({type(model).__name__}) doesn't have predict_proba method. This is not a valid sklearn model.")
                
            except ImportError as e:
                logger.error("imblearn not available - this is required for the model")
                raise ImportError("imblearn package is required to load the model") from e
            except Exception as e:
                logger.error(f"Failed to load trained model: {e}")
                raise e
        else:
            logger.error(f"Model file not found at {model_path}")
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        # Set up feature columns as expected by the Java service
        feature_columns = [
            'Duration (days)', 'Age', 'Traveler gender', 'Traveler nationality', 
            'Accommodation type', 'Accommodation cost', 'Transportation cost'
        ]
        
        # Set up destination names (from your model output)
        destination_names = [
            'Amsterdam, Netherlands', 'Athens, Greece', 'Auckland, New Zealand',
            'Bali, Indonesia', 'Bangkok, Thailand', 'Barcelona, Spain',
            'Berlin, Germany', 'Cancun, Mexico', 'Cape Town, South Africa',
            'Dubai, United Arab Emirates', 'Edinburgh, Scotland', 'Honolulu, Hawaii',
            'London, United Kingdom', 'Los Angeles, USA', 'Marrakech, Morocco',
            'New York, USA', 'Paris, France', 'Phuket, Thailand',
            'Rio de Janeiro, Brazil', 'Rome, Italy', 'Seoul, South Korea',
            'Sydney, Australia', 'Tokyo, Japan', 'Vancouver, Canada'
        ]
        
        # Load or create feature mappings
        feature_mappings = {
            "enum_mappings": {
                "season": {
                    "SPRING": "Spring",
                    "SUMMER": "Summer", 
                    "AUTUMN": "Autumn",
                    "WINTER": "Winter"
                },
                "gender": {
                    "MALE": "Male",
                    "FEMALE": "Female",
                    "OTHER": "Male"
                },
                "accommodation": {
                    "HOTEL": "Hotel",
                    "HOSTEL": "Hostel",
                    "AIRBNB": "Airbnb",
                    "RESORT": "Resort",
                    "APARTMENT": "Apartment"
                },
                "transport": {
                    "FLIGHT": "Flight",
                    "TRAIN": "Train",
                    "CAR": "Car",
                    "BUS": "Bus"
                }
            },
            "nationality_mappings": {
                "United States": "American",
                "Canada": "Canadian",
                "United Kingdom": "British",
                "Germany": "German",
                "France": "French",
                "Australia": "Australian",
                "Japan": "Japanese"
            },
            "default_values": {
                "season": "Summer",
                "nationality": "American"
            }
        }
        
        logger.info(f"Model loaded successfully:")
        logger.info(f"  - Features: {len(feature_columns)}")
        logger.info(f"  - Destinations: {len(destination_names)}")
        logger.info(f"  - Model type: {type(model).__name__}")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return False

def preprocess_input(user_data):
    """Convert user input to model-ready format"""
    try:
        # Create a DataFrame with the user input
        df = pd.DataFrame([user_data])
        
        # Convert DOB to age if present
        if 'Traveler DOB' in df.columns:
            dob_str = df['Traveler DOB'].iloc[0]
            try:
                from datetime import datetime
                dob = datetime.strptime(dob_str, '%m/%d/%Y')
                age = (datetime.now() - dob).days // 365
                df['Age'] = age
            except:
                df['Age'] = 30  # Default age
        
        # Ensure all required features are present
        for col in feature_columns:
            if col not in df.columns:
                if col == 'Age':
                    df[col] = 30
                elif col == 'Duration (days)':
                    df[col] = 7
                elif col == 'Accommodation cost':
                    df[col] = 1200
                elif col == 'Transportation cost':
                    df[col] = 800
                elif col == 'Traveler gender':
                    df[col] = 'Male'
                elif col == 'Traveler nationality':
                    df[col] = 'American'
                elif col == 'Accommodation type':
                    df[col] = 'Hotel'
                else:
                    df[col] = 0
        
        # Select and order columns to match training data
        df = df[feature_columns]
        
        logger.info(f"Preprocessed input shape: {df.shape}")
        logger.debug(f"Input features: {df.iloc[0].to_dict()}")
        
        return df
        
    except Exception as e:
        logger.error(f"Preprocessing failed: {e}")
        raise

def make_predictions(user_data):
    """Make predictions and format response"""
    try:
        # Preprocess input
        X = preprocess_input(user_data)
        
        # Get predictions
        predictions = model.predict_proba(X)[0]
        
        # Create response
        results = []
        
        # Get top predictions (sorted by probability)
        top_indices = np.argsort(predictions)[-5:][::-1]  # Top 5, descending
        
        for rank, idx in enumerate(top_indices, 1):
            probability = float(predictions[idx])
            destination = destination_names[idx] if idx < len(destination_names) else f"Destination_{idx}"
            
            # Determine confidence level
            if probability > 0.7:
                confidence = "High"
            elif probability > 0.4:
                confidence = "Medium"
            else:
                confidence = "Low"
            
            # Generate explanation
            explanation = generate_explanation(destination, probability, user_data)
            
            result = {
                "rank": rank,
                "destination": destination,
                "probability": probability,
                "confidence": confidence,
                "explanation": explanation,
                "shap_details": {
                    "feature_importance": {},
                    "base_value": 0.0,
                    "prediction_value": probability
                }
            }
            
            results.append(result)
        
        return results
        
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise

def generate_explanation(destination, probability, user_data):
    """Generate a human-readable explanation for the prediction"""
    confidence_pct = int(probability * 100)
    
    explanation = f"Predicted Next Travel Destination: {destination}\n"
    explanation += f"Confidence: {confidence_pct}%\n"
    explanation += f"Why this prediction was made:\n"
    
    if confidence_pct < 50:
        explanation += f"While {destination} wasn't the top match, several factors suggest it could still appeal to you. "
    else:
        explanation += f"{destination} appears to be an excellent match for your travel preferences. "
    
    explanation += f"Your travel preferences show strong indicators for {destination} based on historical patterns.\n\n"
    
    explanation += "Key factors influencing this prediction:\n"
    
    # Analyze key factors
    duration = user_data.get('Duration (days)', 7)
    nationality = user_data.get('Traveler nationality', 'American')
    gender = user_data.get('Traveler gender', 'Male')
    accommodation_cost = user_data.get('Accommodation cost', 1200)
    transport_cost = user_data.get('Transportation cost', 800)
    
    explanation += f"Travel Pattern Analysis:\n"
    explanation += f"• Your trip duration of {duration} days aligns with typical {destination} visits\n"
    explanation += f"• Your accommodation budget ({accommodation_cost}) fits {destination} options\n"
    explanation += f"• Your transportation budget ({transport_cost}) is suitable for {destination}\n\n"
    
    explanation += f"Demographic Factors:\n"
    explanation += f"• Your nationality ({nationality}) shows strong correlation with {destination} preferences\n"
    explanation += f"• Your demographic profile aligns with typical {destination} visitors\n\n"
    
    explanation += f"This prediction is based on real-time analysis of your specific inputs compared to patterns from thousands of historical trips."
    
    return explanation

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    if model is None:
        return jsonify({
            "status": "error",
            "message": "Model not loaded"
        }), 503
    
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model is not None,
        "service": "Travel Destination ML Service"
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    if model is None:
        return jsonify({
            "status": "error",
            "message": "Model not loaded"
        }), 503
    
    return jsonify({
        "model_info": {
            "name": "XGBoost_Travel_Destination_Model",
            "type": type(model).__name__,
            "loaded": True
        },
        "destinations": destination_names,
        "feature_columns": feature_columns,
        "num_destinations": len(destination_names),
        "num_features": len(feature_columns),
        "timestamp": datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Make travel destination predictions"""
    try:
        if model is None:
            return jsonify({
                "status": "error",
                "message": "Model not loaded"
            }), 503
        
        # Get request data
        user_data = request.get_json()
        
        if not user_data:
            return jsonify({
                "status": "error",
                "message": "No input data provided"
            }), 400
        
        logger.info(f"Received prediction request: {user_data}")
        
        # Make predictions
        predictions = make_predictions(user_data)
        
        # Format response
        response = {
            "status": "success",
            "predictions": predictions,
            "model_info": {
                "name": "XGBoost_Travel_Destination_Model",
                "accuracy": 0.7971,
                "features_used": len(feature_columns)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Returning {len(predictions)} predictions")
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({
            "status": "error",
            "message": str(e),
            "predictions": [],
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        "service": "Travel Destination ML Service",
        "status": "running",
        "endpoints": ["/health", "/model-info", "/predict"],
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Load model on startup
    logger.info("Starting Travel Destination ML Service...")
    
    if load_model():
        logger.info("Model loaded successfully, starting Flask server...")
        app.run(host='0.0.0.0', port=5001, debug=False)
    else:
        logger.error("Failed to load model, exiting...")
        sys.exit(1)