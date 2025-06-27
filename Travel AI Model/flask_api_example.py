#!/usr/bin/env python3
"""
Flask API for Travel Destination Predictions
Uses your AIModel-v13.py and travel_destination_model.pkl
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from travel_predictor_service import get_predictor_service

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

@app.route('/recommendations', methods=['POST'])
def get_travel_recommendations():
    """
    Get travel destination recommendations using your trained model
    
    Expected JSON payload (your exact format):
    {
        "Traveler DOB": "10/08/1996",
        "Season": "Summer",
        "Duration (days)": 7,
        "Traveler gender": "Female",
        "Traveler nationality": "American",
        "Accommodation type": "Hotel",
        "Accommodation cost": 1200,
        "Transportation type": "Flight",
        "Transportation cost": 800
    }
    """
    try:
        # Get user data from request
        user_data = request.get_json()
        
        # Validate request
        if not user_data:
            return jsonify({
                "error": "No user data provided",
                "status": "error"
            }), 400
        
        # Get number of recommendations (default 5)
        top_k = request.args.get('top_k', 5, type=int)
        
        # Get predictor service (uses your model)
        service = get_predictor_service()
        
        # Make prediction using your AIModel-v13.py
        result = service.get_recommendations(user_data, top_k=top_k)
        
        if result["status"] == "success":
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/recommendations/simple', methods=['POST'])
def get_simple_recommendations():
    """
    Get simplified recommendations (just destinations and scores)
    """
    try:
        user_data = request.get_json()
        top_k = request.args.get('top_k', 5, type=int)
        
        service = get_predictor_service()
        result = service.get_recommendations(user_data, top_k=top_k)
        
        if result["status"] == "success":
            # Return simplified format
            simple_result = {
                "status": "success",
                "destinations": [
                    {
                        "destination": rec["destination"],
                        "confidence": rec["confidence_score"],
                        "rank": rec["rank"]
                    }
                    for rec in result["recommendations"]
                ]
            }
            return jsonify(simple_result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Check API health and model status"""
    try:
        service = get_predictor_service()
        health = service.health_check()
        status_code = 200 if health["status"] == "healthy" else 503
        return jsonify(health), status_code
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about your trained model"""
    try:
        service = get_predictor_service()
        if service.is_loaded:
            return jsonify({
                "status": "success",
                "model_loaded": True,
                "model_source": "AIModel-v13.py",
                "model_file": "travel_destination_model.pkl",
                "supported_fields": [
                    "Traveler DOB",
                    "Season",
                    "Duration (days)",
                    "Traveler gender", 
                    "Traveler nationality",
                    "Accommodation type",
                    "Accommodation cost",
                    "Transportation type",
                    "Transportation cost"
                ],
                "data_format_example": {
                    "Traveler DOB": "10/08/1996",
                    "Season": "Summer",
                    "Duration (days)": 7,
                    "Traveler gender": "Female",
                    "Traveler nationality": "American",
                    "Accommodation type": "Hotel",
                    "Accommodation cost": 1200,
                    "Transportation type": "Flight",
                    "Transportation cost": 800
                }
            })
        else:
            return jsonify({
                "status": "not_ready",
                "model_loaded": False
            }), 503
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recommendations/batch', methods=['POST'])
def get_batch_recommendations():
    """
    Get recommendations for multiple users
    
    Expected payload:
    {
        "users": [
            {"Traveler DOB": "10/08/1996", "Season": "Summer", ...},
            {"Traveler DOB": "15/03/1988", "Season": "Winter", ...}
        ]
    }
    """
    try:
        data = request.get_json()
        users = data.get('users', [])
        top_k = request.args.get('top_k', 5, type=int)
        
        if not users:
            return jsonify({"error": "No users provided"}), 400
        
        service = get_predictor_service()
        results = []
        
        for i, user_data in enumerate(users):
            result = service.get_recommendations(user_data, top_k=top_k)
            results.append({
                "user_index": i,
                "result": result
            })
        
        return jsonify({
            "status": "success",
            "batch_results": results
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Travel Destination Prediction API")
    print("=" * 50)
    print("Model Source: AIModel-v13.py")
    print("Model File: travel_destination_model.pkl")
    print("Available endpoints:")
    print("• POST /recommendations - Get travel recommendations")
    print("• POST /recommendations/simple - Get simplified recommendations")
    print("• POST /recommendations/batch - Batch predictions")
    print("• GET /health - Health check")
    print("• GET /model/info - Model information")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5002)