#!/usr/bin/env python3
"""
Test script to validate ML service setup and dependencies
"""

import sys
import os
import subprocess
import json

def check_dependencies():
    """Check if required Python packages are installed"""
    print("🔍 Checking Python dependencies...")
    
    required_packages = [
        'flask', 'flask_cors', 'pandas', 'numpy', 'scikit-learn', 
        'xgboost', 'pickle', 'joblib'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} - OK")
        except ImportError:
            missing.append(package)
            print(f"❌ {package} - MISSING")
    
    # Check for imblearn specifically
    try:
        import imblearn
        print("✅ imblearn - OK (Model loading should work)")
        return missing, True
    except ImportError:
        print("⚠️ imblearn - MISSING (Will use mock model)")
        return missing, False

def check_model_file():
    """Check if the trained model file exists"""
    print("\n🔍 Checking model files...")
    
    model_path = "Travel AI Model/travel_destination_model.pkl"
    if os.path.exists(model_path):
        size = os.path.getsize(model_path)
        print(f"✅ Model file found: {model_path} (size: {size:,} bytes)")
        return True
    else:
        print(f"❌ Model file not found: {model_path}")
        return False

def test_model_loading():
    """Test if the model can be loaded"""
    print("\n🧪 Testing model loading...")
    
    try:
        # Try to load the ML service
        sys.path.append('.')
        from ml_service import load_model
        
        success = load_model()
        if success:
            print("✅ Model loading test passed")
            return True
        else:
            print("❌ Model loading test failed")
            return False
    except Exception as e:
        print(f"❌ Model loading test failed with error: {e}")
        return False

def test_service_endpoints():
    """Test if the ML service can start and respond"""
    print("\n🌐 Testing service endpoints...")
    
    try:
        import requests
        import time
        from threading import Thread
        
        # Start the ML service in a separate thread
        def start_service():
            os.system("python ml_service.py &")
        
        # Give it time to start
        time.sleep(3)
        
        # Test health endpoint
        try:
            response = requests.get("http://localhost:5001/health", timeout=5)
            if response.status_code == 200:
                print("✅ Health endpoint working")
                
                # Test prediction endpoint
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
                
                pred_response = requests.post(
                    "http://localhost:5001/predict", 
                    json=test_data,
                    timeout=10
                )
                
                if pred_response.status_code == 200:
                    print("✅ Prediction endpoint working")
                    data = pred_response.json()
                    print(f"  - Returned {len(data.get('predictions', []))} predictions")
                    return True
                else:
                    print(f"❌ Prediction endpoint failed: {pred_response.status_code}")
                    return False
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print("❌ Cannot connect to ML service (not running)")
            return False
        except Exception as e:
            print(f"❌ Service test error: {e}")
            return False
            
    except ImportError:
        print("⚠️ requests library not available, skipping service tests")
        return True

def main():
    """Main test execution"""
    print("🚀 ML Service Setup Validation")
    print("=" * 50)
    
    # Check dependencies
    missing_deps, has_imblearn = check_dependencies()
    
    # Check model file
    has_model = check_model_file()
    
    # Test model loading
    model_loads = test_model_loading()
    
    # Summary
    print("\n📋 Summary:")
    print("=" * 50)
    
    if missing_deps:
        print(f"❌ Missing dependencies: {', '.join(missing_deps)}")
        print("   Run: pip install flask flask-cors pandas numpy scikit-learn xgboost")
        if not has_imblearn:
            print("   For full model: pip install imbalanced-learn")
    else:
        print("✅ All dependencies satisfied")
    
    if has_model:
        print("✅ Model file present")
    else:
        print("⚠️ Model file missing (will use mock model)")
    
    if model_loads:
        print("✅ Model loading works")
    else:
        print("❌ Model loading failed")
    
    if not has_imblearn:
        print("⚠️ Will use mock model for predictions")
    
    print("\n🎯 Recommendations:")
    if missing_deps:
        print("1. Install missing Python packages")
    if not has_imblearn:
        print("2. Install imbalanced-learn for full model functionality")
    if not has_model:
        print("3. Ensure travel_destination_model.pkl is in Travel AI Model/ directory")
    
    print("\n✅ Setup validation complete!")

if __name__ == "__main__":
    main()