#!/usr/bin/env python3
"""
Test script for the Travel Prediction API
Tests your AIModel-v13.py through the API
"""

import requests
import json

def test_api():
    """Test the Travel Prediction API with your exact data format"""
    
    # API base URL
    base_url = "http://localhost:5002"
    
    print("🧪 Testing Travel Prediction API")
    print("=" * 50)
    print("Model Source: AIModel-v13.py")
    print("Model File: travel_destination_model.pkl")
    print("=" * 50)
    
    # Test data - your exact format
    test_user = {
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
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"   Status: {response.status_code}")
        result = response.json()
        print(f"   Response: {result}")
        if result.get('model_source'):
            print(f"   Model Source: {result['model_source']}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 2: Model info
    print("\n2. Testing model info...")
    try:
        response = requests.get(f"{base_url}/model/info")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            info = response.json()
            print(f"   Model loaded: {info.get('model_loaded')}")
            print(f"   Model source: {info.get('model_source')}")
            print(f"   Model file: {info.get('model_file')}")
            print(f"   Supported fields: {len(info.get('supported_fields', []))}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 3: Get recommendations with your data format
    print("\n3. Testing recommendations with your data format...")
    print(f"   Input data: {test_user}")
    try:
        response = requests.post(
            f"{base_url}/recommendations",
            json=test_user,
            params={"top_k": 3}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Got {len(result.get('recommendations', []))} recommendations from your model:")
            for rec in result.get('recommendations', []):
                print(f"     {rec['rank']}. {rec['destination']} - {rec['confidence_score']:.1%}")
                print(f"        Confidence Level: {rec['confidence_level']}")
        else:
            print(f"   Error: {response.json()}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 4: Simple recommendations
    print("\n4. Testing simple recommendations...")
    try:
        response = requests.post(
            f"{base_url}/recommendations/simple",
            json=test_user,
            params={"top_k": 3}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("   Simple format destinations:")
            for dest in result.get('destinations', []):
                print(f"     {dest['rank']}. {dest['destination']} - {dest['confidence']:.1%}")
    except Exception as e:
        print(f"   Error: {e}")
    
    # Test 5: Batch predictions
    print("\n5. Testing batch predictions...")
    try:
        batch_data = {
            "users": [
                test_user,
                {
                    "Traveler DOB": "15/03/1988",
                    "Season": "Winter",
                    "Duration (days)": 10,
                    "Traveler gender": "Male",
                    "Traveler nationality": "Canadian",
                    "Accommodation type": "Airbnb",
                    "Accommodation cost": 800,
                    "Transportation type": "Flight",
                    "Transportation cost": 600
                }
            ]
        }
        response = requests.post(
            f"{base_url}/recommendations/batch",
            json=batch_data,
            params={"top_k": 2}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Processed {len(result.get('batch_results', []))} users")
    except Exception as e:
        print(f"   Error: {e}")

def show_curl_examples():
    """Show curl examples for testing your API"""
    print("\n" + "="*50)
    print("📖 CURL EXAMPLES FOR YOUR MODEL")
    print("="*50)
    
    print("\n1. Health check:")
    print("curl -X GET http://localhost:5002/health")
    
    print("\n2. Get recommendations with your data format:")
    print('''curl -X POST http://localhost:5002/recommendations \\
  -H "Content-Type: application/json" \\
  -d '{
    "Traveler DOB": "10/08/1996",
    "Season": "Summer",
    "Duration (days)": 7,
    "Traveler gender": "Female", 
    "Traveler nationality": "American",
    "Accommodation type": "Hotel",
    "Accommodation cost": 1200,
    "Transportation type": "Flight",
    "Transportation cost": 800
  }' ''')
    
    print("\n3. Simple recommendations:")
    print('''curl -X POST "http://localhost:5002/recommendations/simple?top_k=3" \\
  -H "Content-Type: application/json" \\
  -d '{"Traveler DOB": "10/08/1996", "Season": "Summer", "Duration (days)": 7, "Traveler gender": "Female", "Traveler nationality": "American", "Accommodation type": "Hotel", "Accommodation cost": 1200, "Transportation type": "Flight", "Transportation cost": 800}' ''')

if __name__ == "__main__":
    print("This script tests your AI model through the API.")
    print("Make sure the Flask app is running first!")
    print("To start the API: python flask_api_example.py")
    print("\nYour model files:")
    print("- AIModel-v13.py (source code)")
    print("- travel_destination_model.pkl (trained model)")
    print("\nPress Enter to run tests or Ctrl+C to exit...")
    
    try:
        input()
        test_api()
        show_curl_examples()
    except KeyboardInterrupt:
        print("\nTest cancelled.")