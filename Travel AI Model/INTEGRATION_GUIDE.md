
# 📋 Travel AI Model Integration Guide
*For Developers with No AI Experience*

## 🎯 What You're Getting
A **trained AI model** that predicts travel destinations based on user preferences. The model is already trained and ready to use - you just need to integrate it into your system.

---

## 📦 Files You'll Receive

### **Core Files (Don't Modify These):**
- `AIModel-v13.py` - The AI model code
- `travel_destination_model.pkl` - The trained model (500MB file)
- `extended_travel_trips.csv` - Training data
- `requirements.txt` - Python dependencies

### **Integration Files (You Can Modify These):**
- `flask_api_example.py` - Sample API server
- `travel_predictor_service.py` - Model wrapper service
- `test_api.py` - Test script to verify it works
- `README_API_INTEGRATION.md` - Full documentation

---

## 🚀 Quick Setup Instructions

### **Step 1: Install Dependencies**
```bash
cd path/to/travel-ai-folder
pip install -r requirements.txt
```

### **Step 2: Test the Model Works**
```bash
python flask_api_example.py
# Keep this running, open new terminal:
python test_api.py
```
✅ **Expected**: See travel recommendations like "New York, USA - 31.4%"

---

## 🔧 Integration Options

### **Option A: Use as External API (Easiest)**
Keep the Flask API running and call it from your system:

```javascript
// Your frontend code
const userData = {
    "Traveler DOB": "10/08/1996",
    "Season": "Summer",
    "Duration (days)": 7,
    "Traveler gender": "Female",
    "Traveler nationality": "American",
    "Accommodation type": "Hotel",
    "Accommodation cost": 1200,
    "Transportation type": "Flight",
    "Transportation cost": 800
};

fetch('http://localhost:5002/recommendations/simple', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
    // data.destinations = array of recommendations
    console.log(data.destinations);
});
```

### **Option B: Integrate into Your Backend**
Import the service directly into your existing backend:

```python
# In your existing backend code
from travel_predictor_service import get_predictor_service

def get_travel_recommendations(user_data):
    service = get_predictor_service()
    return service.get_recommendations(user_data)
```

---

## 🤖 Claude Terminal Prompts

Use these **exact prompts** in Claude Terminal to get help:

### **For Frontend Integration:**
```
I have a travel AI model that returns destination predictions via API. Help me integrate it into my React/Vue/Angular frontend. The API endpoint is POST /recommendations/simple and expects this JSON format: [paste the user data format]. I want to display the results in a dashboard. Show me the complete frontend code.
```

### **For Backend Integration:**
```
I need to integrate a travel prediction service into my Node.js/Django/Flask backend. I have a Python service called travel_predictor_service.py that has a get_recommendations() function. Show me how to call this from my backend and return results to my frontend API endpoints.
```

### **For Database Integration:**
```
I have a travel recommendation AI model that returns predictions. Help me store these predictions in my database and cache them. My database is [MySQL/PostgreSQL/MongoDB]. Show me the schema and code to save user requests and AI responses.
```

### **For Error Handling:**
```
My travel AI API sometimes fails or returns errors. Help me add proper error handling, retry logic, and fallback responses for my production system. Show me robust error handling code.
```

### **For Performance Optimization:**
```
I'm integrating a travel AI model into my high-traffic website. The model takes 2-3 seconds to respond. Help me add caching, async processing, and loading states to make this production-ready.
```

---

## 📊 Data Format (Copy This)

### **Input Format (What to Send):**
```json
{
    "Traveler DOB": "MM/DD/YYYY",
    "Season": "Spring|Summer|Fall|Winter", 
    "Duration (days)": 7,
    "Traveler gender": "Male|Female",
    "Traveler nationality": "American|Canadian|etc",
    "Accommodation type": "Hotel|Airbnb|Resort",
    "Accommodation cost": 1200,
    "Transportation type": "Flight|Car|Train",
    "Transportation cost": 800
}
```

### **Output Format (What You Get Back):**

**For `/recommendations/simple` endpoint:**
```json
{
    "status": "success",
    "destinations": [
        {
            "destination": "New York, USA",
            "confidence": 0.3144,
            "rank": 1
        },
        {
            "destination": "Paris, France", 
            "confidence": 0.2981,
            "rank": 2
        }
    ]
}
```

**For `/recommendations` endpoint (full response from your model):**
```json
{
    "status": "success",
    "predictions": [
        {
            "rank": 1,
            "destination": "New York, USA",
            "probability": 0.3144,
            "confidence": "Low",
            "explanation": "Detailed explanation of why this destination was chosen...",
            "shap_details": {
                "feature_impacts": {...},
                "contributions": [...]
            }
        }
    ],
    "model_info": {
        "name": "XGBoost_Tuned_SMOTE",
        "test_accuracy": 0.7971183800623053
    },
    "timestamp": "2025-06-18T12:08:36.298930"
}
```

---

## ⚡ Quick Integration Steps

### **For Dashboard Integration:**

1. **Collect user inputs** in your form (DOB, Season, Duration, etc.)
2. **Format the data** exactly as shown above
3. **Call the API** endpoint `/recommendations/simple`
4. **Display results** in your dashboard UI
5. **Handle loading states** (predictions take 2-3 seconds)

### **Example Dashboard Flow:**
```
User fills form → Format data → Call AI API → Show loading → Display top 5 destinations
```

---

## 🆘 Common Issues & Solutions

### **"Model not loading"**
- Check all files are in same directory
- Run: `python test_api.py` to verify

### **"Import errors"**
- Run: `pip install -r requirements.txt`

### **"Slow responses"**
- Normal - AI takes 2-3 seconds
- Add loading spinner in your UI

### **"JSON serialization errors"**
- Make sure dates are in MM/DD/YYYY format
- Check all required fields are included

---

## 📞 Final Integration Checklist

- [ ] Model test passes (`python test_api.py`)
- [ ] Your form collects all required fields
- [ ] API calls use correct JSON format
- [ ] Loading states implemented (2-3 second wait)
- [ ] Error handling for failed predictions
- [ ] Results display properly in dashboard

**You're ready to integrate!** The AI model will provide travel destination recommendations based on user preferences.