#!/usr/bin/env python3
"""
Travel Destination Predictor Service
Production-ready service for making travel destination predictions using AIModel-v13.py
"""

import os
import sys
import pickle
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Union
import warnings
import json
warnings.filterwarnings('ignore')

def convert_numpy_types(obj):
    """Convert numpy types to JSON-serializable Python types"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    else:
        return obj

class TravelPredictorService:
    """
    Production service wrapper for the trained travel destination model.
    Uses AIModel-v13.py and travel_destination_model.pkl exclusively.
    """
    
    def __init__(self, model_path: str = 'travel_destination_model.pkl'):
        """Initialize the service with trained model"""
        self.model_path = model_path
        self.predictor = None
        self.is_loaded = False
        
    def load_model(self) -> bool:
        """Load the trained model from AIModel-v13.py"""
        try:
            # Import the predictor class from AIModel-v13.py
            import importlib.util
            spec = importlib.util.spec_from_file_location("AIModel_v13", "AIModel-v13.py")
            aimodel_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(aimodel_module)
            TravelDestinationPredictor = aimodel_module.TravelDestinationPredictor
            
            # Initialize and load the saved model
            self.predictor = TravelDestinationPredictor()
            success = self.predictor.load_model(self.model_path)
            
            if success:
                self.is_loaded = True
                print(f"✅ Model loaded successfully from {self.model_path}")
                return True
            else:
                print(f"❌ Failed to load model from {self.model_path}")
                return False
                
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    def get_recommendations(self, user_profile: Dict[str, Any], top_k: int = 5) -> Dict[str, Any]:
        """
        Get travel destination recommendations for a user using your trained model
        
        Args:
            user_profile: User travel profile data with exact format:
                {
                    'Traveler DOB': '10/08/1996',
                    'Season': 'Summer',
                    'Duration (days)': 7,
                    'Traveler gender': 'Female',
                    'Traveler nationality': 'American',
                    'Accommodation type': 'Hotel',
                    'Accommodation cost': 1200,
                    'Transportation type': 'Flight',
                    'Transportation cost': 800
                }
            top_k: Number of recommendations to return
            
        Returns:
            Dictionary with recommendations and explanations from your model
        """
        if not self.is_loaded:
            return {
                "error": "Model not loaded. Please call load_model() first.",
                "status": "error"
            }
        
        try:
            # Validate required fields for your specific data format
            required_fields = [
                'Traveler DOB', 'Season', 'Traveler gender', 'Traveler nationality',
                'Duration (days)', 'Accommodation type', 'Accommodation cost',
                'Transportation type', 'Transportation cost'
            ]
            
            missing_fields = [field for field in required_fields if field not in user_profile]
            if missing_fields:
                return {
                    "error": f"Missing required fields: {missing_fields}",
                    "status": "error"
                }
            
            # Make prediction using your AIModel-v13.py
            result = self.predictor.predict_destination(user_profile, top_k=top_k)
            
            if result.get('status') == 'success':
                # Format response to ensure JSON serialization
                formatted_result = {
                    "status": "success",
                    "user_profile": user_profile,
                    "recommendations": [],
                    "model_info": result['model_info'],
                    "timestamp": result['timestamp']
                }
                
                # Format each recommendation from your model
                for pred in result['predictions']:
                    formatted_result["recommendations"].append({
                        "rank": pred['rank'],
                        "destination": pred['destination'],
                        "confidence_score": pred['probability'],
                        "confidence_level": pred['confidence'],
                        "explanation": pred['explanation'],
                        "technical_details": pred.get('shap_details', {})
                    })
                
                return convert_numpy_types(formatted_result)
            else:
                return result
                
        except Exception as e:
            return {
                "error": f"Prediction failed: {str(e)}",
                "status": "error"
            }
    
    def health_check(self) -> Dict[str, Any]:
        """Check if the service is healthy and model is loaded"""
        return {
            "status": "healthy" if self.is_loaded else "not_ready",
            "model_loaded": self.is_loaded,
            "model_path": self.model_path,
            "model_source": "AIModel-v13.py"
        }

# Global service instance
_predictor_service = None

def get_predictor_service() -> TravelPredictorService:
    """Get or create the global predictor service instance"""
    global _predictor_service
    if _predictor_service is None:
        _predictor_service = TravelPredictorService()
        _predictor_service.load_model()
    return _predictor_service

if __name__ == "__main__":
    # Test the service with your exact data format
    print("🧪 Testing Travel Predictor Service")
    print("=" * 50)
    
    # Initialize service
    service = TravelPredictorService()
    
    # Load model
    if service.load_model():
        # Test with your exact data format
        test_user = {
            'Traveler DOB': '10/08/1996',
            'Season': 'Summer',
            'Duration (days)': 7,
            'Traveler gender': 'Female',
            'Traveler nationality': 'American',
            'Accommodation type': 'Hotel',
            'Accommodation cost': 1200,
            'Transportation type': 'Flight',
            'Transportation cost': 800
        }
        
        print(f"\n📋 Test User Profile:")
        for key, value in test_user.items():
            print(f"   • {key}: {value}")
        
        print(f"\n🎯 Getting Recommendations from your model...")
        result = service.get_recommendations(test_user, top_k=3)
        
        if result["status"] == "success":
            print(f"\n✅ SUCCESS! Got {len(result['recommendations'])} recommendations:")
            for rec in result['recommendations']:
                print(f"   {rec['rank']}. {rec['destination']} - {rec['confidence_score']:.1%} ({rec['confidence_level']})")
        else:
            print(f"❌ Error: {result['error']}")
    else:
        print("❌ Could not load model")