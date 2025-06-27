package com.farrin.farrin.model;

public enum TripType {
    SOLO("Solo"),
    FAMILY("Family"),
    FRIENDS("Friends");

    private final String displayName;

    TripType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}