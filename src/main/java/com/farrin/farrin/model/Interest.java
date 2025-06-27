package com.farrin.farrin.model;

public enum Interest {
    ADVENTURE("Adventure"),
    RELAXATION("Relaxation"),
    CULTURAL_EXPERIENCE("CulturalExperience"),
    NATURE("Nature");

    private final String displayName;

    Interest(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}