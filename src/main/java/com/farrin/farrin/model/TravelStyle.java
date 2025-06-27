package com.farrin.farrin.model;

public enum TravelStyle {
    CASUAL("Casual"),
    FREQUENT("Frequent"),
    BUSINESS("Business"),
    ENTHUSIAST("Enthusiast"),
    ORGANIZER("Organizer");

    private final String displayName;

    TravelStyle(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}