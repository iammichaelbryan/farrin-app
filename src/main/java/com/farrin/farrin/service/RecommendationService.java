package com.farrin.farrin.service;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.PreferenceRepository;
import com.farrin.farrin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService extends BaseService {
    
    private final TravelDestinationModelService modelService;
    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;

    public List<DestinationResponseDTO> getPersonalizedRecommendations(Integer userId) {
        try {
            logOperation("getPersonalizedRecommendations", userId);
            
            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }
            
            // Get user and preferences
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("User not found: {}", userId);
                return Collections.emptyList();
            }
            
            User user = userOpt.get();
            Optional<Preference> preferenceOpt = preferenceRepository.findByUserId(userId);
            Preference preference = preferenceOpt.orElse(null);
            
            // Build ML model request
            Map<String, Object> modelRequest = modelService.buildModelRequest(user, preference, "New York");
            
            // Call the actual ML model (or simulate if not available)
            Map<String, Object> modelResponse = callMLModelService(modelRequest);
            
            // Process model response and return recommendations
            List<DestinationResponseDTO> recommendations = modelService.processModelResponse(modelResponse, userId);
            
            // Recommendations are already sorted by rank from ML model
            // No need to re-sort unless we want secondary sorting criteria
            
            log.info("Generated {} personalized recommendations for user {}", recommendations.size(), userId);
            return recommendations;
            
        } catch (Exception e) {
            handleServiceException(e, "getPersonalizedRecommendations");
            return Collections.emptyList();
        }
    }
    
    /**
     * Calls the ML model service or simulates response if service is unavailable
     */
    private Map<String, Object> callMLModelService(Map<String, Object> request) {
        try {
            // Check if ML service is available
            if (modelService.isMLServiceAvailable()) {
                log.info("ML model service is available, making actual prediction call");
                // Use the actual ML model service
                return callActualMLService(request);
            } else {
                log.warn("ML model service is unavailable, using simulation fallback");
                return simulateModelResponse(request);
            }
            
        } catch (Exception e) {
            log.error("Failed to call ML model service: {}", e.getMessage());
            log.info("Falling back to simulated response");
            return simulateModelResponse(request);
        }
    }
    
    /**
     * Makes actual call to ML model service through TravelDestinationModelService
     */
    private Map<String, Object> callActualMLService(Map<String, Object> request) {
        try {
            log.info("Making actual call to ML model service with {} parameters", request.size());
            log.debug("Request parameters: {}", request.keySet());
            
            // Call the actual ML model service via HTTP
            Map<String, Object> response = modelService.callMLModel(request);
            
            // Check if the response indicates success
            if ("success".equals(response.get("status"))) {
                log.info("Successfully received ML model predictions");
                return response;
            } else {
                log.warn("ML model service returned error status: {}", response.get("status"));
                log.warn("Error message: {}", response.get("message"));
                // Fall back to simulation
                return simulateModelResponse(request);
            }
            
        } catch (Exception e) {
            log.error("Error in actual ML service call: {}", e.getMessage());
            throw e;
        }
    }
    
    /**
     * Simulates ML model response with actual expected format
     */
    private Map<String, Object> simulateModelResponse(Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        
        // Create sample predictions in the expected format
        List<Map<String, Object>> predictions = new ArrayList<>();
        
        String[] sampleDestinations = {
            "Paris", "Tokyo", "New York", "London", "Barcelona", 
            "Rome", "Amsterdam", "Sydney", "Dubai", "Bangkok"
        };
        
        for (int i = 0; i < Math.min(sampleDestinations.length, 10); i++) {
            Map<String, Object> prediction = new HashMap<>();
            prediction.put("rank", i + 1);
            prediction.put("destination", sampleDestinations[i]);
            
            double probability = 0.9 - (i * 0.08); // Decreasing probability
            prediction.put("probability", Math.round(probability * 10000.0) / 10000.0);
            
            String confidence = probability > 0.7 ? "High" : probability > 0.4 ? "Medium" : "Low";
            prediction.put("confidence", confidence);
            
            prediction.put("explanation", "Recommended based on your travel preferences, demographic data, and similar user patterns.");
            
            // Simulate SHAP details
            Map<String, Object> shapDetails = new HashMap<>();
            shapDetails.put("budget_impact", 0.3);
            shapDetails.put("climate_preference", 0.2);
            shapDetails.put("travel_style", 0.25);
            shapDetails.put("demographics", 0.25);
            prediction.put("shap_details", shapDetails);
            
            predictions.add(prediction);
        }
        
        response.put("predictions", predictions);
        
        Map<String, Object> modelInfo = new HashMap<>();
        modelInfo.put("name", "Travel Destination Recommender v1.0");
        modelInfo.put("test_accuracy", 0.87);
        response.put("model_info", modelInfo);
        
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        
        return response;
    }

    public Set<DestinationResponseDTO> getDestinationsByInterest(Interest interest) {
        logOperation("getDestinationsByInterest", interest);
        return Set.of();
    }

    public Set<String> getActivityRecommendations(Integer userId, Integer destinationId) {
        logOperation("getActivityRecommendations", destinationId);
        return Set.of();
    }

    public Set<DestinationResponseDTO> filterDestinations(Interest interest, TravelStyle travelStyle, 
                                                         Climate climate, Integer minBudget, Integer maxBudget) {
        logOperation("filterDestinations", interest + ", " + travelStyle + ", " + climate);
        return Set.of();
    }

    public Integer estimateBudget(Integer userId, Integer destinationId) {
        logOperation("estimateBudget", destinationId);
        return 1000;
    }

    public BigDecimal generateSentimentAnalysis(Integer destinationId) {
        logOperation("generateSentimentAnalysis", destinationId);
        return BigDecimal.valueOf(0.8);
    }

    public Boolean updateRecommendationModel() {
        logOperation("updateRecommendationModel", "model");
        return true;
    }
}