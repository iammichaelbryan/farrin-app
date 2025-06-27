package com.farrin.farrin.model;

public enum ApiHealthStatus {
    HEALTHY("Healthy"),
    DEGRADED("Degraded"),
    DOWN("Down"),
    MAINTENANCE("Maintenance");

    private final String displayName;

    ApiHealthStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}