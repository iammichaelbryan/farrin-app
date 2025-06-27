package com.farrin.farrin.model;

public enum BookingStatus {
    BOOKED("Booked"),
    CANCELLED("Cancelled"),
    PENDING("Pending");

    private final String displayName;

    BookingStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}