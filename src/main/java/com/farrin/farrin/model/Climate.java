package com.farrin.farrin.model;

public enum Climate {
    TROPICAL("Tropical"),
    DRY("Dry"),
    CONTINENTAL("Continental"),
    POLAR("Polar"),
    MEDITERRANEAN("Mediterranean"),
    ARID("Arid"),
    SEMI_ARID("Semi-Arid"),
    MONSOON("Monsoon"),
    TUNDRA("Tundra");

    private final String displayName;

    Climate(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}