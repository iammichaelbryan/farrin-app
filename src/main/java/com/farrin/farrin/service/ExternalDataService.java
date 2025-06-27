package com.farrin.farrin.service;

import org.springframework.stereotype.Service;

@Service
public class ExternalDataService {

    public Object fetchFlightData(String origin, String destination, String departureDate) {
        logOperation("fetchFlightData", origin + " to " + destination);
        return null;
    }

    public Object fetchAccommodationData(String location, String checkIn, String checkOut) {
        logOperation("fetchAccommodationData", location);
        return null;
    }

    public Object fetchWeatherData(String location, String date) {
        logOperation("fetchWeatherData", location);
        return null;
    }

    public Object fetchActivityData(String location, String category) {
        logOperation("fetchActivityData", location);
        return null;
    }

    public Boolean syncData() {
        logOperation("syncData", null);
        return true;
    }

    public Object getSyncStatus() {
        logOperation("getSyncStatus", null);
        return null;
    }

    private void logOperation(String operation, Object data) {
        System.out.println("ExternalDataService." + operation + " called with: " + data);
    }
}