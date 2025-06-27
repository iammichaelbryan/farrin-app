package com.farrin.farrin.model;

public enum APIData {
    WEATHER("Weather"),
    CURRENCY_RATE("CurrencyRate"),
    ACCOMMODATION("Accommodation"),
    FLIGHTS("Flights"),
    TRAVEL_REQUIREMENTS("TravelRequirements");

    private final String displayName;

    APIData(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}