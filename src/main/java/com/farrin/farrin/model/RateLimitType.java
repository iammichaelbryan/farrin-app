package com.farrin.farrin.model;

public enum RateLimitType {
    USER("User"),
    IP("IP"),
    API_KEY("API_Key"),
    GLOBAL("Global");

    private final String displayName;

    RateLimitType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}