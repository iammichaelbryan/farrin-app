package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.service.ExternalDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/external-data")
@RequiredArgsConstructor
public class ExternalDataController {

    private final ExternalDataService externalDataService;

    @GetMapping("/flights")
    public ResponseEntity<Object> fetchFlightData(@RequestParam String origin, 
                                                 @RequestParam String destination,
                                                 @RequestParam String departureDate) {
        try {
            var flightData = externalDataService.fetchFlightData(origin, destination, departureDate);
            return ResponseEntity.ok(flightData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/accommodation")
    public ResponseEntity<Object> fetchAccommodationData(@RequestParam String location,
                                                        @RequestParam String checkIn,
                                                        @RequestParam String checkOut) {
        try {
            var accommodationData = externalDataService.fetchAccommodationData(location, checkIn, checkOut);
            return ResponseEntity.ok(accommodationData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/weather")
    public ResponseEntity<Object> fetchWeatherData(@RequestParam String location,
                                                  @RequestParam String date) {
        try {
            var weatherData = externalDataService.fetchWeatherData(location, date);
            return ResponseEntity.ok(weatherData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/activities")
    public ResponseEntity<Object> fetchActivityData(@RequestParam String location,
                                                   @RequestParam String category) {
        try {
            var activityData = externalDataService.fetchActivityData(location, category);
            return ResponseEntity.ok(activityData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<HTTPResponse> syncExternalData(@RequestBody Object syncRequest) {
        try {
            Boolean result = externalDataService.syncData();
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Data synchronization completed")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Data synchronization failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/sync-status")
    public ResponseEntity<Object> getSyncStatus() {
        try {
            var syncStatus = externalDataService.getSyncStatus();
            return ResponseEntity.ok(syncStatus);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }
}