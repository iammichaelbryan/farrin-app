# Enhanced Travel Recommendation AI - Post-Training Analysis and Improvements

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import learning_curve
import warnings
warnings.filterwarnings('ignore')

def analyze_confusion_matrix_results(trained_models, model_type='hotel_country'):
    """
    Analyze the confusion matrix results and provide insights
    """
    print("="*60)
    print("CONFUSION MATRIX ANALYSIS")
    print("="*60)
    
    if model_type not in trained_models:
        print(f"Model {model_type} not found. Available models: {list(trained_models.keys())}")
        return
    
    results = trained_models[model_type]['results']
    
    print("\nModel Performance Summary:")
    print("-" * 40)
    
    for model_name, metrics in results.items():
        print(f"\n{model_name}:")
        print(f"  Training Accuracy: {metrics['train_score']:.4f}")
        print(f"  Test Accuracy: {metrics['test_score']:.4f}")
        print(f"  Cross-Val Accuracy: {metrics['cv_mean']:.4f} ± {metrics['cv_std']:.4f}")
        
        # Check for overfitting
        overfitting = metrics['train_score'] - metrics['test_score']
        if overfitting > 0.1:
            print(f"  ⚠️  Potential overfitting detected (gap: {overfitting:.3f})")
        else:
            print(f"  ✅ Good generalization (gap: {overfitting:.3f})")

def improve_model_performance(hotel_data, trips_data, trained_models):
    """
    Suggestions and code for improving model performance
    """
    print("\n" + "="*60)
    print("MODEL IMPROVEMENT STRATEGIES")
    print("="*60)
    
    improvements = {
        "1. Feature Engineering": [
            "Create more temporal features (season, holiday periods)",
            "Add geographical distance features",
            "Include user preference clustering",
            "Calculate booking patterns and seasonality"
        ],
        
        "2. Data Quality": [
            "Handle missing values more strategically",
            "Remove outliers in stay duration and costs", 
            "Balance the dataset if classes are imbalanced",
            "Add more historical data if available"
        ],
        
        "3. Model Tuning": [
            "Perform hyperparameter optimization",
            "Try ensemble methods",
            "Use stratified sampling for cross-validation",
            "Implement early stopping for gradient boosting"
        ],
        
        "4. Advanced Features": [
            "Add user similarity features",
            "Include external data (weather, events, prices)",
            "Create sequence-based features for travel patterns",
            "Add collaborative filtering features"
        ]
    }
    
    for category, suggestions in improvements.items():
        print(f"\n{category}:")
        for i, suggestion in enumerate(suggestions, 1):
            print(f"  {i}. {suggestion}")

def create_advanced_features(hotel_df, trips_df):
    """
    Create additional features to improve model performance
    """
    print("\n" + "="*60)
    print("CREATING ADVANCED FEATURES")
    print("="*60)
    
    # Hotel data enhancements
    hotel_enhanced = hotel_df.copy()
    
    if 'checkin' in hotel_enhanced.columns:
        # Add more temporal features
        hotel_enhanced['is_weekend'] = hotel_enhanced['checkin'].dt.dayofweek >= 5
        hotel_enhanced['is_holiday_season'] = hotel_enhanced['checkin'].dt.month.isin([12, 1, 6, 7, 8])
        hotel_enhanced['quarter'] = hotel_enhanced['checkin'].dt.quarter
        
        # Calculate days until checkin
        if 'created_date' in hotel_enhanced.columns:
            hotel_enhanced['booking_lead_time_category'] = pd.cut(
                hotel_enhanced['booking_lead_time'], 
                bins=[-np.inf, 7, 30, 90, np.inf], 
                labels=['Last_minute', 'Short_term', 'Medium_term', 'Long_term']
            )
    
    # User behavior clustering
    if 'user_id' in hotel_enhanced.columns:
        user_profiles = hotel_enhanced.groupby('user_id').agg({
            'stay_duration': 'mean',
            'booking_lead_time': 'mean',
            'booking_frequency': 'first',
            'countries_visited': 'first'
        })
        
        # Simple user segmentation
        user_profiles['user_type'] = 'Regular'
        user_profiles.loc[user_profiles['booking_frequency'] >= 5, 'user_type'] = 'Frequent'
        user_profiles.loc[user_profiles['countries_visited'] >= 3, 'user_type'] = 'Explorer'
        user_profiles.loc[
            (user_profiles['booking_frequency'] >= 5) & 
            (user_profiles['countries_visited'] >= 3), 'user_type'
        ] = 'Power_Traveler'
        
        # Merge back
        hotel_enhanced = hotel_enhanced.merge(
            user_profiles[['user_type']], 
            left_on='user_id', 
            right_index=True, 
            how='left'
        )
    
    # Trips data enhancements
    trips_enhanced = trips_df.copy()
    
    if 'Start date' in trips_enhanced.columns:
        trips_enhanced['is_weekend_trip'] = trips_enhanced['Start date'].dt.dayofweek >= 5
        trips_enhanced['is_long_trip'] = trips_enhanced['Duration (days)'] >= 7
        
        # Cost categories
        if 'total_cost' in trips_enhanced.columns:
            trips_enhanced['cost_category'] = pd.cut(
                trips_enhanced['total_cost'],
                bins=[0, 500, 1500, 3000, np.inf],
                labels=['Budget', 'Mid_range', 'Premium', 'Luxury']
            )
    
    print(f"✅ Enhanced hotel data: {hotel_enhanced.shape[1]} features")
    print(f"✅ Enhanced trips data: {trips_enhanced.shape[1]} features")
    
    return hotel_enhanced, trips_enhanced

def plot_learning_curves(trained_models, X_train, y_train, model_type='hotel_country'):
    """
    Plot learning curves to understand model behavior
    """
    if model_type not in trained_models:
        return
    
    model = trained_models[model_type]['model']
    
    # Calculate learning curve
    train_sizes, train_scores, val_scores = learning_curve(
        model, X_train, y_train, cv=5, n_jobs=-1,
        train_sizes=np.linspace(0.1, 1.0, 10),
        scoring='accuracy'
    )
    
    # Plot
    plt.figure(figsize=(10, 6))
    plt.plot(train_sizes, np.mean(train_scores, axis=1), 'o-', label='Training Accuracy')
    plt.plot(train_sizes, np.mean(val_scores, axis=1), 'o-', label='Validation Accuracy')
    plt.fill_between(train_sizes, 
                     np.mean(train_scores, axis=1) - np.std(train_scores, axis=1),
                     np.mean(train_scores, axis=1) + np.std(train_scores, axis=1), 
                     alpha=0.1)
    plt.fill_between(train_sizes,
                     np.mean(val_scores, axis=1) - np.std(val_scores, axis=1),
                     np.mean(val_scores, axis=1) + np.std(val_scores, axis=1), 
                     alpha=0.1)
    
    plt.xlabel('Training Set Size')
    plt.ylabel('Accuracy')
    plt.title(f'Learning Curves - {model_type}')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

def hyperparameter_tuning_recommendations():
    """
    Provide hyperparameter tuning recommendations
    """
    print("\n" + "="*60)
    print("HYPERPARAMETER TUNING RECOMMENDATIONS")
    print("="*60)
    
    tuning_params = {
        'Random Forest': {
            'n_estimators': [100, 200, 500],
            'max_depth': [10, 20, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4]
        },
        
        'Gradient Boosting': {
            'n_estimators': [100, 200, 300],
            'learning_rate': [0.01, 0.1, 0.2],
            'max_depth': [3, 5, 7],
            'subsample': [0.8, 0.9, 1.0]
        },
        
        'XGBoost': {
            'n_estimators': [100, 200, 300],
            'learning_rate': [0.01, 0.1, 0.2],
            'max_depth': [3, 5, 7],
            'subsample': [0.8, 0.9, 1.0],
            'colsample_bytree': [0.8, 0.9, 1.0]
        }
    }
    
    print("Recommended hyperparameter ranges for GridSearchCV:")
    print("-" * 50)
    
    for model_name, params in tuning_params.items():
        print(f"\n{model_name}:")
        for param, values in params.items():
            print(f"  {param}: {values}")

def create_ensemble_model(trained_models):
    """
    Create a simple ensemble of the trained models
    """
    print("\n" + "="*60)
    print("ENSEMBLE MODEL CREATION")
    print("="*60)
    
    ensemble_code = '''
# Simple Voting Ensemble Example
from sklearn.ensemble import VotingClassifier

def create_voting_ensemble(models_dict):
    """
    Create a voting ensemble from trained models
    """
    estimators = []
    
    for name, model_info in models_dict.items():
        if 'model' in model_info:
            estimators.append((name, model_info['model']))
    
    # Create voting classifier
    ensemble = VotingClassifier(
        estimators=estimators,
        voting='soft'  # Use probabilities for voting
    )
    
    return ensemble

# Usage:
# ensemble_model = create_voting_ensemble(trained_models)
# ensemble_model.fit(X_train, y_train)
'''
    
    print("Code for creating ensemble models:")
    print(ensemble_code)

def deployment_recommendations():
    """
    Provide recommendations for model deployment
    """
    print("\n" + "="*60)
    print("MODEL DEPLOYMENT RECOMMENDATIONS")
    print("="*60)
    
    recommendations = [
        "1. Save Models:",
        "   - Use joblib or pickle to save trained models",
        "   - Save preprocessing pipelines separately",
        "   - Version control your models",
        "",
        "2. API Development:",
        "   - Create REST API using Flask/FastAPI",
        "   - Implement input validation",
        "   - Add error handling and logging",
        "",
        "3. Performance Monitoring:",
        "   - Track prediction accuracy over time",
        "   - Monitor for data drift",
        "   - Set up alerts for model degradation",
        "",
        "4. Continuous Improvement:",
        "   - Retrain models with new data regularly",
        "   - A/B test new model versions",
        "   - Collect user feedback on recommendations"
    ]
    
    for rec in recommendations:
        print(rec)

def main_analysis():
    """
    Main function to run all analysis and improvements
    """
    print("🚀 TRAVEL AI MODEL ENHANCEMENT SUITE")
    print("="*60)
    
    # Note: You would call this after running your main training script
    print("To use this enhancement suite:")
    print("1. Run your main training script first")
    print("2. Then call these functions with your trained models")
    print("3. Example usage:")
    
    example_usage = '''
# After running your main script:
trained_models, hotel_data, trips_data = main()

# Run enhancements:
analyze_confusion_matrix_results(trained_models)
improve_model_performance(hotel_data, trips_data, trained_models)
hotel_enhanced, trips_enhanced = create_advanced_features(hotel_data, trips_data)
hyperparameter_tuning_recommendations()
create_ensemble_model(trained_models)
deployment_recommendations()
'''
    
    print(example_usage)

if __name__ == "__main__":
    main_analysis()