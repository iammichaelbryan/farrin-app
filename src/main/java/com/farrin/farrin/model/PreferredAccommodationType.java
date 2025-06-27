package com.farrin.farrin.model;

public enum PreferredAccommodationType {
    HOTEL("Hotel"),
    AIRBNB("AirBnB"),
    LODGE("Lodge");

    private final String displayName;

    PreferredAccommodationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}