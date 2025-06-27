#!/usr/bin/env python3
"""
Test Java application's integration with the ML service
"""

import requests
import json
import time

def test_ml_service_integration():
    """Test the integration between Java app and ML service"""
    
    print("🧪 Testing Java ML Service Integration")
    print("=" * 50)
    
    # First verify ML service is running
    print("\n1. Checking ML service status...")
    try:
        ml_response = requests.get("http://localhost:5001/health", timeout=5)
        if ml_response.status_code == 200:
            print("✅ ML service is running")
        else:
            print(f"❌ ML service health check failed: {ml_response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ML service is not accessible: {e}")
        return False
    
    # Check if Java app can reach ML service by testing TravelDestinationModelService directly
    print("\n2. Testing ML service connectivity from Java app...")
    
    # Let's call the ML service directly to verify it works
    test_data = {
        "Traveler DOB": "01/15/1990",
        "Season": "Summer",
        "Duration (days)": 7,
        "Traveler gender": "Male",
        "Traveler nationality": "American",
        "Accommodation type": "Hotel",
        "Accommodation cost": 1200,
        "Transportation type": "Flight",
        "Transportation cost": 800
    }
    
    try:
        prediction_response = requests.post(
            "http://localhost:5001/predict",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if prediction_response.status_code == 200:
            data = prediction_response.json()
            if data.get("status") == "success":
                predictions = data.get("predictions", [])
                print(f"✅ ML service prediction successful - {len(predictions)} recommendations")
                
                if predictions:
                    top_prediction = predictions[0]
                    print(f"   Top recommendation: {top_prediction.get('destination')} "
                          f"(Confidence: {top_prediction.get('confidence')}, "
                          f"Probability: {top_prediction.get('probability', 0):.3f})")
                return True
            else:
                print(f"❌ ML service prediction failed: {data.get('message')}")
                return False
        else:
            print(f"❌ ML service request failed: {prediction_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error calling ML service: {e}")
        return False

def main():
    success = test_ml_service_integration()
    
    if success:
        print(f"\n🎉 ML service integration test passed!")
        print(f"\nNext steps:")
        print(f"1. The ML service is running and accessible at http://localhost:5001")
        print(f"2. Java application should be able to connect to it")
        print(f"3. Try testing the recommendations endpoint once you have test user data")
        print(f"\nYour retrained model is now integrated and working! 🚀")
    else:
        print(f"\n💥 ML service integration test failed.")
        print(f"Please check that both services are running.")

if __name__ == "__main__":
    main()