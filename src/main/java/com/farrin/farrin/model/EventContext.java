package com.farrin.farrin.model;

public enum EventContext {
    USER_REGISTERED("UserRegistered"),
    PROFILE_UPDATED("ProfileUpdated"),
    PREFERENCES_CHANGED("PreferencesChanged"),
    TRIP_CREATED("TripCreated"),
    TRIP_UPDATED("TripUpdated"),
    TRIP_DELETED("TripDeleted"),
    EVENT_CREATED("EventCreated"),
    BOOKING_CREATED("BookingCreated"),
    WEATHER_UPDATED("WeatherUpdated"),
    RECOMMENDATION_GENERATED("RecommendationGenerated"),
    MODEL_UPDATED("ModelUpdated"),
    EXTERNAL_DATA_UPDATED("ExternalDataUpdated"),
    API_HEALTH_CHANGED("ApiHealthChanged"),
    NOTIFICATION_SENT("NotificationSent"),
    NOTIFICATION_FAILED("NotificationFailed"),
    RECOMMENDATION_CLICKED("RecommendationClicked");

    private final String displayName;

    EventContext(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}