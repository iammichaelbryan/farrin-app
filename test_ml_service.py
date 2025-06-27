#!/usr/bin/env python3
"""
Test script for the Travel Destination ML Model Service
"""

import requests
import json
import sys

def test_ml_service():
    """Test the ML service endpoints"""
    
    base_url = "http://localhost:5001"
    
    print("🧪 Testing Travel Destination ML Model Service")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Health check passed: {health_data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test 2: Model info
    print("\n2. Testing model info endpoint...")
    try:
        response = requests.get(f"{base_url}/model-info", timeout=10)
        if response.status_code == 200:
            model_info = response.json()
            print(f"✅ Model info retrieved:")
            print(f"   - Model: {model_info.get('model_info', {}).get('name', 'Unknown')}")
            print(f"   - Destinations: {len(model_info.get('destinations', []))}")
            print(f"   - Features: {len(model_info.get('feature_columns', []))}")
        else:
            print(f"❌ Model info failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Model info failed: {e}")
    
    # Test 3: Prediction request
    print("\n3. Testing prediction endpoint...")
    
    # Sample user data matching the format expected by the Java service
    test_user_data = {
        "Traveler DOB": "01/15/1990",
        "Season": "Summer",
        "Duration (days)": 10,
        "Traveler gender": "Male",
        "Traveler nationality": "American",
        "Accommodation type": "Hotel",
        "Accommodation cost": 200,
        "Transportation type": "Flight",
        "Transportation cost": 800,
        "generate_cf_for": "Paris"
    }
    
    try:
        response = requests.post(
            f"{base_url}/predict", 
            json=test_user_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            prediction_data = response.json()
            if prediction_data.get("status") == "success":
                predictions = prediction_data.get("predictions", [])
                print(f"✅ Prediction successful:")
                print(f"   - Status: {prediction_data.get('status')}")
                print(f"   - Number of predictions: {len(predictions)}")
                print(f"   - Model: {prediction_data.get('model_info', {}).get('name', 'Unknown')}")
                
                # Show top 3 predictions
                if predictions:
                    print(f"\n   Top 3 recommendations:")
                    for i, pred in enumerate(predictions[:3]):
                        print(f"     {i+1}. {pred.get('destination')} (Rank: {pred.get('rank')}, "
                              f"Probability: {pred.get('probability'):.4f}, "
                              f"Confidence: {pred.get('confidence')})")
                        if pred.get('explanation'):
                            print(f"        Explanation: {pred.get('explanation')[:100]}...")
                
                # Verify the exact format expected by Java
                print(f"\n   Verifying response format...")
                required_fields = ['rank', 'destination', 'probability', 'confidence', 'explanation', 'shap_details']
                if predictions:
                    first_pred = predictions[0]
                    missing_fields = [field for field in required_fields if field not in first_pred]
                    if not missing_fields:
                        print(f"   ✅ All required fields present in predictions")
                    else:
                        print(f"   ⚠️  Missing fields: {missing_fields}")
                
                return True
            else:
                print(f"❌ Prediction failed: {prediction_data.get('message', 'Unknown error')}")
                return False
        else:
            print(f"❌ Prediction request failed: {response.status_code}")
            if response.text:
                print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction request failed: {e}")
        return False

def main():
    success = test_ml_service()
    if success:
        print(f"\n🎉 All tests passed! ML service is working correctly.")
        sys.exit(0)
    else:
        print(f"\n💥 Some tests failed. Check the ML service setup.")
        sys.exit(1)

if __name__ == "__main__":
    main()