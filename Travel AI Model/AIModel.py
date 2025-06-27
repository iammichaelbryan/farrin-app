# Travel Recommendation AI Model Training
# This notebook trains models on hotel reservation and travel trip datasets to predict user travel preferences

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Machine Learning Libraries
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# Advanced ML Libraries
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("XGBoost not available. Install with: pip install xgboost")

# Set style for plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

print("=== Travel Recommendation AI Model Training ===")
print("This notebook will train models to predict travel recommendations based on:")
print("1. Hotel reservation patterns")
print("2. Historical travel data")
print("\nRequired datasets:")
print("- hotel_reservations.csv (1M+ anonymized hotel reservations)")
print("- travel_trips.csv (historical travel trip data)")

## 1. DATA LOADING AND EXPLORATION

def load_and_explore_data():
    """Load and perform initial exploration of both datasets"""
    
    print("\n" + "="*50)
    print("STEP 1: DATA LOADING AND EXPLORATION")
    print("="*50)
    
    # Load datasets (you'll need to replace these with your actual file paths)
    print("Loading datasets...")
    
    # Hotel Reservations Dataset
    try:
        hotel_df = pd.read_csv('hotel_reservations.csv')
        print(f"✓ Hotel reservations loaded: {hotel_df.shape[0]:,} rows, {hotel_df.shape[1]} columns")
    except FileNotFoundError:
        print("⚠ hotel_reservations.csv not found. Creating sample data for demonstration...")
        hotel_df = create_sample_hotel_data()
    
    # Travel Trips Dataset
    try:
        trips_df = pd.read_csv('travel_trips.csv')
        print(f"✓ Travel trips loaded: {trips_df.shape[0]:,} rows, {trips_df.shape[1]} columns")
    except FileNotFoundError:
        print("⚠ travel_trips.csv not found. Creating sample data for demonstration...")
        trips_df = create_sample_trips_data()
    
    return hotel_df, trips_df

def create_sample_hotel_data(n_samples=10000):
    """Create sample hotel reservation data for demonstration"""
    np.random.seed(42)
    
    # Generate sample data
    user_ids = np.random.randint(1, 5000, n_samples)
    countries = ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'AU', 'CA', 'JP', 'BR']
    cities = list(range(1, 101))  # 100 different cities
    affiliates = list(range(1, 21))  # 20 different affiliates
    devices = ['desktop', 'mobile']
    
    # Create date ranges
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2024, 12, 31)
    
    data = []
    for i in range(n_samples):
        created = start_date + timedelta(days=np.random.randint(0, (end_date - start_date).days))
        checkin = created + timedelta(days=np.random.randint(1, 365))
        checkout = checkin + timedelta(days=np.random.randint(1, 14))
        
        data.append({
            'user_id': user_ids[i],
            'checkin': checkin.strftime('%Y-%m-%d'),
            'checkout': checkout.strftime('%Y-%m-%d'),
            'created_date': created.strftime('%Y-%m-%d'),
            'affiliate_id': np.random.choice(affiliates),
            'device_class': np.random.choice(devices),
            'booker_country': np.random.choice(countries),
            'hotel_country': np.random.choice(countries),
            'city_id': np.random.choice(cities),
            'utrip_id': f"trip_{i}_{np.random.randint(1, 1000)}"
        })
    
    return pd.DataFrame(data)

def create_sample_trips_data(n_samples=5000):
    """Create sample travel trips data for demonstration"""
    np.random.seed(42)
    
    destinations = ['Paris', 'London', 'Tokyo', 'New York', 'Rome', 'Barcelona', 'Sydney', 'Bangkok', 'Dubai', 'Amsterdam']
    names = [f'Traveler_{i}' for i in range(1, 1001)]
    genders = ['Male', 'Female', 'Other']
    nationalities = ['American', 'British', 'German', 'French', 'Italian', 'Spanish', 'Australian', 'Canadian', 'Japanese', 'Brazilian']
    accommodations = ['Hotel', 'Hostel', 'Airbnb', 'Resort', 'Guesthouse']
    transportation = ['Plane', 'Train', 'Car', 'Bus', 'Boat']
    
    data = []
    for i in range(n_samples):
        start_date = datetime(2020, 1, 1) + timedelta(days=np.random.randint(0, 1800))
        duration = np.random.randint(1, 21)
        end_date = start_date + timedelta(days=duration)
        
        data.append({
            'Trip ID': f'TRIP_{i+1:06d}',
            'Destination': np.random.choice(destinations),
            'Start date': start_date.strftime('%Y-%m-%d'),
            'End date': end_date.strftime('%Y-%m-%d'),
            'Duration (days)': duration,
            'Traveler name': np.random.choice(names),
            'Traveler age': np.random.randint(18, 80),
            'Traveler gender': np.random.choice(genders),
            'Traveler nationality': np.random.choice(nationalities),
            'Accommodation type': np.random.choice(accommodations),
            'Accommodation cost': np.random.randint(50, 500) * duration,
            'Transportation type': np.random.choice(transportation),
            'Transportation cost': np.random.randint(100, 2000)
        })
    
    return pd.DataFrame(data)

def explore_datasets(hotel_df, trips_df):
    """Perform exploratory data analysis"""
    
    print("\n--- HOTEL RESERVATIONS DATASET ---")
    print(f"Shape: {hotel_df.shape}")
    print("\nData types:")
    print(hotel_df.dtypes)
    print("\nFirst few rows:")
    print(hotel_df.head())
    print(f"\nMissing values:")
    print(hotel_df.isnull().sum())
    
    print("\n--- TRAVEL TRIPS DATASET ---")
    print(f"Shape: {trips_df.shape}")
    print("\nData types:")
    print(trips_df.dtypes)
    print("\nFirst few rows:")
    print(trips_df.head())
    print(f"\nMissing values:")
    print(trips_df.isnull().sum())
    
    # Basic statistics
    if 'Duration (days)' in trips_df.columns:
        print(f"\nTrip duration statistics:")
        print(trips_df['Duration (days)'].describe())

## 2. DATA PREPROCESSING AND FEATURE ENGINEERING

def preprocess_hotel_data(hotel_df):
    """Preprocess hotel reservation data"""
    
    print("\n" + "="*50)
    print("STEP 2: PREPROCESSING HOTEL RESERVATION DATA")
    print("="*50)
    
    # Make a copy to avoid modifying original data
    df = hotel_df.copy()
    
    # Convert date columns
    date_columns = ['checkin', 'checkout', 'created_date']
    for col in date_columns:
        if col in df.columns:  # Only convert if column exists
            df[col] = pd.to_datetime(df[col])
    
    # Create derived features - only if we have the required columns
    if all(col in df.columns for col in ['checkin', 'checkout']):
        df['stay_duration'] = (df['checkout'] - df['checkin']).dt.days
    
    if all(col in df.columns for col in ['checkin', 'created_date']):
        df['booking_lead_time'] = (df['checkin'] - df['created_date']).dt.days
    else:
        print("Warning: 'created_date' column not found - skipping booking_lead_time calculation")
    
    # Extract temporal features
    if 'checkin' in df.columns:
        df['checkin_month'] = df['checkin'].dt.month
        df['checkin_weekday'] = df['checkin'].dt.dayofweek
        df['checkin_season'] = df['checkin'].dt.month.apply(get_season)
    
    # Create user behavior features
    user_stats = df.groupby('user_id').agg({
        'stay_duration': ['mean', 'std', 'count'],
        'booking_lead_time': ['mean', 'std'],
        'city_id': 'nunique',
        'hotel_country': 'nunique'
    }).round(2)
    
    user_stats.columns = ['avg_stay_duration', 'std_stay_duration', 'booking_frequency',
                         'avg_lead_time', 'std_lead_time', 'cities_visited', 'countries_visited']
    
    # Handle NaN values in std columns
    user_stats['std_stay_duration'] = user_stats['std_stay_duration'].fillna(0)
    user_stats['std_lead_time'] = user_stats['std_lead_time'].fillna(0)
    
    # Merge back with original data
    df = df.merge(user_stats, left_on='user_id', right_index=True, how='left')
    
    print(f"✓ Hotel data preprocessed: {df.shape}")
    print(f"✓ Added features: stay_duration, booking_lead_time, temporal features, user behavior")
    # print(f"✓ Added features: stay_duration, temporal features, user behavior")
    
    return df

def preprocess_trips_data(trips_df):
    """Preprocess travel trips data"""
    
    print("\n" + "="*50)
    print("STEP 3: PREPROCESSING TRAVEL TRIPS DATA")
    print("="*50)
    
    # Make a copy to avoid modifying original data
    df = trips_df.copy()
    
    # Convert date columns
    date_columns = ['Start date', 'End date']
    for col in date_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col])
    
    # Create derived features
    if 'Start date' in df.columns:
        df['start_month'] = df['Start date'].dt.month
        df['start_weekday'] = df['Start date'].dt.dayofweek
        df['start_season'] = df['Start date'].dt.month.apply(get_season)
    
    # Calculate cost per day
    if 'Accommodation cost' in df.columns and 'Duration (days)' in df.columns:
        df['accommodation_cost_per_day'] = df['Accommodation cost'] / df['Duration (days)']
        df['accommodation_cost_per_day'] = df['accommodation_cost_per_day'].replace([np.inf, -np.inf], 0)
    
    if 'Transportation cost' in df.columns and 'Duration (days)' in df.columns:
        df['total_cost'] = df['Accommodation cost'] + df['Transportation cost']
        df['cost_per_day'] = df['total_cost'] / df['Duration (days)']
        df['cost_per_day'] = df['cost_per_day'].replace([np.inf, -np.inf], 0)
    
    # Create traveler behavior features
    if 'Traveler name' in df.columns:
        traveler_stats = df.groupby('Traveler name').agg({
            'Duration (days)': ['mean', 'std', 'count'],
            'total_cost': ['mean', 'std'],
            'Destination': 'nunique'
        }).round(2)
        
        traveler_stats.columns = ['avg_trip_duration', 'std_trip_duration', 'trip_frequency',
                                 'avg_trip_cost', 'std_trip_cost', 'destinations_visited']
        
        # Handle NaN values
        traveler_stats['std_trip_duration'] = traveler_stats['std_trip_duration'].fillna(0)
        traveler_stats['std_trip_cost'] = traveler_stats['std_trip_cost'].fillna(0)
        
        # Merge back
        df = df.merge(traveler_stats, left_on='Traveler name', right_index=True, how='left')
    
    print(f"✓ Trips data preprocessed: {df.shape}")
    print(f"✓ Added features: temporal features, cost calculations, traveler behavior")
    
    return df

def get_season(month):
    """Convert month to season"""
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    else:
        return 'Fall'

## 3. TARGET VARIABLE CREATION

def create_prediction_targets(hotel_df, trips_df):
    """Create target variables for prediction"""
    
    print("\n" + "="*50)
    print("STEP 4: CREATING PREDICTION TARGETS")
    print("="*50)
    
    targets = {}
    
    # Hotel-based targets
    if 'hotel_country' in hotel_df.columns:
        # Next destination country prediction
        hotel_df_sorted = hotel_df.sort_values(['user_id', 'checkin'])
        hotel_df_sorted['next_country'] = hotel_df_sorted.groupby('user_id')['hotel_country'].shift(-1)
        
        # Remove rows without next destination
        hotel_target_df = hotel_df_sorted.dropna(subset=['next_country'])
        targets['hotel_next_country'] = hotel_target_df
        print(f"✓ Hotel next country target: {len(hotel_target_df)} samples")
    
    # Trips-based targets
    if 'Destination' in trips_df.columns:
        # Next destination prediction
        trips_df_sorted = trips_df.sort_values(['Traveler name', 'Start date'])
        trips_df_sorted['next_destination'] = trips_df_sorted.groupby('Traveler name')['Destination'].shift(-1)
        
        # Remove rows without next destination
        trips_target_df = trips_df_sorted.dropna(subset=['next_destination'])
        targets['trips_next_destination'] = trips_target_df
        print(f"✓ Trips next destination target: {len(trips_target_df)} samples")
    
    # Accommodation type prediction
    if 'Accommodation type' in trips_df.columns:
        targets['accommodation_prediction'] = trips_df.dropna(subset=['Accommodation type'])
        print(f"✓ Accommodation type target: {len(targets['accommodation_prediction'])} samples")
    
    return targets

## 4. MODEL TRAINING FUNCTIONS

def prepare_features_for_training(df, target_column, feature_columns=None):
    """Prepare features and target for model training"""
    
    if feature_columns is None:
        # Automatically select numeric and categorical columns
        numeric_features = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_features = df.select_dtypes(include=['object']).columns.tolist()
        
        # Remove target and identifier columns
        exclude_cols = [target_column, 'user_id', 'Trip ID', 'Traveler name', 'utrip_id']
        if 'checkin' in df.columns:
            exclude_cols.extend(['checkin', 'checkout', 'created_date', 'Start date', 'End date'])
        
        numeric_features = [col for col in numeric_features if col not in exclude_cols]
        categorical_features = [col for col in categorical_features if col not in exclude_cols]
        
        feature_columns = numeric_features + categorical_features
    
    # Prepare features and target
    X = df[feature_columns].copy()
    y = df[target_column].copy()
    
    # Handle missing values and encode categorical variables
    numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_features = X.select_dtypes(include=['object']).columns.tolist()
    
    # Create preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', Pipeline([
                ('imputer', SimpleImputer(strategy='median')),
                ('scaler', StandardScaler())
            ]), numeric_features),
            ('cat', Pipeline([
                ('imputer', SimpleImputer(strategy='constant', fill_value='unknown')),
                ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
            ]), categorical_features)
        ]
    )
    
    return X, y, preprocessor, feature_columns

def train_models(X, y, preprocessor, model_name):
    """Train multiple models and return the best one"""
    
    print(f"\n--- Training models for {model_name} ---")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Define models
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000)
    }
    
    if XGBOOST_AVAILABLE:
        models['XGBoost'] = xgb.XGBClassifier(n_estimators=100, random_state=42, eval_metric='logloss')
    
    results = {}
    best_model = None
    best_score = 0
    
    for name, model in models.items():
        print(f"Training {name}...")
        
        # Create pipeline
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', model)
        ])
        
        # Train model
        pipeline.fit(X_train, y_train)
        
        # Evaluate
        train_score = pipeline.score(X_train, y_train)
        test_score = pipeline.score(X_test, y_test)
        
        # Cross-validation
        cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='accuracy')
        
        results[name] = {
            'pipeline': pipeline,
            'train_score': train_score,
            'test_score': test_score,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std()
        }
        
        print(f"  Train Accuracy: {train_score:.4f}")
        print(f"  Test Accuracy: {test_score:.4f}")
        print(f"  CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")
        
        if test_score > best_score:
            best_score = test_score
            best_model = pipeline
    
    return results, best_model, X_test, y_test

def evaluate_model(model, X_test, y_test, model_name):
    """Evaluate model performance"""
    
    print(f"\n--- Detailed Evaluation for {model_name} ---")
    
    # Predictions
    y_pred = model.predict(X_test)
    
    # Accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {accuracy:.4f}")
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    
    # Plot confusion matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title(f'Confusion Matrix - {model_name}')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.show()
    
    return accuracy

## 5. MAIN EXECUTION PIPELINE

def main():
    """Main execution pipeline"""
    
    print("Starting Travel Recommendation AI Model Training Pipeline...")
    
    # Step 1: Load and explore data
    hotel_df, trips_df = load_and_explore_data()
    explore_datasets(hotel_df, trips_df)
    
    # Step 2: Preprocess data
    hotel_processed = preprocess_hotel_data(hotel_df)
    trips_processed = preprocess_trips_data(trips_df)
    
    # Step 3: Create prediction targets
    targets = create_prediction_targets(hotel_processed, trips_processed)
    
    # Step 4: Train models
    trained_models = {}
    
    # Train hotel country prediction model
    if 'hotel_next_country' in targets:
        print("\n" + "="*60)
        print("TRAINING MODEL 1: NEXT HOTEL COUNTRY PREDICTION")
        print("="*60)
        
        df = targets['hotel_next_country']
        X, y, preprocessor, features = prepare_features_for_training(df, 'next_country')
        
        if len(X) > 100:  # Only train if we have enough samples
            results, best_model, X_test, y_test = train_models(X, y, preprocessor, "Hotel Country Prediction")
            trained_models['hotel_country'] = {
                'model': best_model,
                'results': results,
                'features': features
            }
            
            # Evaluate best model
            evaluate_model(best_model, X_test, y_test, "Hotel Country Prediction")
    
    # Train trips destination prediction model
    if 'trips_next_destination' in targets:
        print("\n" + "="*60)
        print("TRAINING MODEL 2: NEXT TRIP DESTINATION PREDICTION")
        print("="*60)
        
        df = targets['trips_next_destination']
        X, y, preprocessor, features = prepare_features_for_training(df, 'next_destination')
        
        if len(X) > 100:  # Only train if we have enough samples
            results, best_model, X_test, y_test = train_models(X, y, preprocessor, "Trip Destination Prediction")
            trained_models['trip_destination'] = {
                'model': best_model,
                'results': results,
                'features': features
            }
            
            # Evaluate best model
            evaluate_model(best_model, X_test, y_test, "Trip Destination Prediction")
    
    # Train accommodation type prediction model
    if 'accommodation_prediction' in targets:
        print("\n" + "="*60)
        print("TRAINING MODEL 3: ACCOMMODATION TYPE PREDICTION")
        print("="*60)
        
        df = targets['accommodation_prediction']
        X, y, preprocessor, features = prepare_features_for_training(df, 'Accommodation type')
        
        if len(X) > 100:  # Only train if we have enough samples
            results, best_model, X_test, y_test = train_models(X, y, preprocessor, "Accommodation Type Prediction")
            trained_models['accommodation_type'] = {
                'model': best_model,
                'results': results,
                'features': features
            }
            
            # Evaluate best model
            evaluate_model(best_model, X_test, y_test, "Accommodation Type Prediction")
    
    return trained_models, hotel_processed, trips_processed

## 6. PREDICTION FUNCTIONS

def make_predictions(trained_models, user_data, prediction_type='hotel_country'):
    """Make predictions for new user data"""
    
    if prediction_type not in trained_models:
        print(f"Model for {prediction_type} not available.")
        return None
    
    model = trained_models[prediction_type]['model']
    
    try:
        # Make prediction
        prediction = model.predict(user_data)
        prediction_proba = model.predict_proba(user_data)
        
        return {
            'prediction': prediction,
            'probabilities': prediction_proba,
            'classes': model.classes_
        }
    except Exception as e:
        print(f"Error making prediction: {e}")
        return None

def get_feature_importance(trained_models, model_type='hotel_country'):
    """Get feature importance from trained models"""
    
    if model_type not in trained_models:
        print(f"Model for {model_type} not available.")
        return None
    
    model = trained_models[model_type]['model']
    features = trained_models[model_type]['features']
    
    # Get feature importance (only works for tree-based models)
    try:
        if hasattr(model.named_steps['classifier'], 'feature_importances_'):
            # Get feature names after preprocessing
            feature_names = []
            preprocessor = model.named_steps['preprocessor']
            
            # This is a simplified version - in practice, you'd need to handle
            # the feature names more carefully after one-hot encoding
            importance = model.named_steps['classifier'].feature_importances_
            
            # Create importance dataframe
            importance_df = pd.DataFrame({
                'feature': [f'feature_{i}' for i in range(len(importance))],
                'importance': importance
            }).sort_values('importance', ascending=False)
            
            # Plot top 20 features
            plt.figure(figsize=(10, 8))
            top_features = importance_df.head(20)
            sns.barplot(data=top_features, x='importance', y='feature')
            plt.title(f'Top 20 Feature Importances - {model_type}')
            plt.tight_layout()
            plt.show()
            
            return importance_df
            
    except Exception as e:
        print(f"Could not extract feature importance: {e}")
        return None

# Execute the main pipeline
if __name__ == "__main__":
    trained_models, hotel_data, trips_data = main()
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    print(f"Successfully trained {len(trained_models)} models:")
    for model_name in trained_models.keys():
        print(f"  ✓ {model_name}")
    
    print("\nYou can now use the trained models to make predictions:")
    print("- Use make_predictions() function to predict for new users")
    print("- Use get_feature_importance() to understand model decisions")
    print("- Models are stored in the 'trained_models' dictionary")