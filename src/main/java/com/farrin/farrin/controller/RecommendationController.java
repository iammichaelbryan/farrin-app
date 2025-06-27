package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.*;
import com.farrin.farrin.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<Object> getPersonalizedRecommendations(@RequestParam Integer userId) {
        try {
            var recommendations = recommendationService.getPersonalizedRecommendations(userId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/destinations")
    public ResponseEntity<Object> getDestinationsByInterest(@RequestParam Interest interest) {
        try {
            var destinations = recommendationService.getDestinationsByInterest(interest);
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/activities")
    public ResponseEntity<Object> getActivityRecommendations(@RequestParam Integer userId,
                                                            @RequestParam Integer destinationId) {
        try {
            var activities = recommendationService.getActivityRecommendations(userId, destinationId);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<Object> filterDestinations(@RequestParam Interest interest,
                                                     @RequestParam TravelStyle travelStyle,
                                                     @RequestParam Climate climate,
                                                     @RequestParam Integer minBudget,
                                                     @RequestParam Integer maxBudget) {
        try {
            var destinations = recommendationService.filterDestinations(interest, travelStyle, climate, minBudget, maxBudget);
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/budget")
    public ResponseEntity<Object> getBudgetEstimate(@RequestParam Integer userId,
                                                   @RequestParam Integer destinationId) {
        try {
            var estimate = recommendationService.estimateBudget(userId, destinationId);
            return ResponseEntity.ok(estimate);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/model")
    public ResponseEntity<HTTPResponse> updateRecommendationModel() {
        try {
            Boolean result = recommendationService.updateRecommendationModel();
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Recommendation model updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to update recommendation model")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }
}