package com.farrin.farrin.model;

public enum FlightClassification {
    ONE_WAY("OneWay"),
    TWO_WAY("TwoWay");

    private final String displayName;

    FlightClassification(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}