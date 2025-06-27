package com.farrin.farrin.model;

public enum GroupPreference {
    SOLO("Solo"),
    GROUP("Group"),
    FAMILY("Family");

    private final String displayName;

    GroupPreference(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}