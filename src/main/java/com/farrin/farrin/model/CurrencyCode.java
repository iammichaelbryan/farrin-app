package com.farrin.farrin.model;

public enum CurrencyCode {
    JMD("JMD"),
    USD("USD"),
    EUR("EUR"),
    AUS("AUS"),
    GBP("GBP"),
    CAD("CAD");

    private final String code;

    CurrencyCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}