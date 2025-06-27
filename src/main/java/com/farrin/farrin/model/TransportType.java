package com.farrin.farrin.model;

public enum TransportType {
    FLIGHTS("Flights");

    private final String displayName;

    TransportType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}