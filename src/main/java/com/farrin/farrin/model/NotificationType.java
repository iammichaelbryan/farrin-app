package com.farrin.farrin.model;

public enum NotificationType {
    EMAIL("Email"),
    SMS("SMS"),
    PUSH("Push"),
    IN_APP("In-App");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}