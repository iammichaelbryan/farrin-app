package com.farrin.farrin.service;

import com.farrin.farrin.dto.DestinationResponseDTO;
import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.CountryRepository;
import com.farrin.farrin.repository.DestinationRepository;
import com.farrin.farrin.repository.TravelHistoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelDestinationModelService extends BaseService {
    
    private final DestinationRepository destinationRepository;
    private final CountryRepository countryRepository;
    private final TravelHistoryRepository travelHistoryRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;
    
    @Value("${farrin.ml.service.url:http://localhost:5001}")
    private String mlServiceUrl;
    
    private static final DateTimeFormatter DOB_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy");
    private static final String MODEL_PATH = "models/travel_destination_model/travel_destination_model.pkl";
    
    /**
     * Converts user data to ML model prediction request format
     */
    public Map<String, Object> buildModelRequest(User user, Preference preference, String targetDestination) {
        try {
            logOperation("buildModelRequest", user.getId());
            
            Map<String, Object> request = new HashMap<>();
            
            // Load feature mappings
            JsonNode mappings = loadFeatureMappings();
            
            // Traveler DOB (MM/DD/YYYY format)
            if (user.getDob() != null) {
                request.put("Traveler DOB", user.getDob().format(DOB_FORMAT));
            } else {
                // Default to age 30 if no DOB
                LocalDate defaultDob = LocalDate.now().minusYears(30);
                request.put("Traveler DOB", defaultDob.format(DOB_FORMAT));
            }
            
            // Season preference
            String season = mapSeason(preference != null ? preference.getPreferredTravelSeason() : null, mappings);
            request.put("Season", season);
            
            // Duration in days
            Integer duration = preference != null ? preference.getAvgTravelDuration() : null;
            request.put("Duration (days)", duration != null ? duration : 7);
            
            // Gender
            String gender = mapGender(user.getGender(), mappings);
            request.put("Traveler gender", gender);
            
            // Nationality (from primary citizenship)
            String nationality = mapNationality(user.getCitizenships(), mappings);
            request.put("Traveler nationality", nationality);
            
            // Accommodation preferences
            String accommodationType = mapAccommodation(
                preference != null ? preference.getPreferredAccommodation() : null, mappings);
            request.put("Accommodation type", accommodationType);
            
            Integer accommodationCost = preference != null ? preference.getAccommodationBudget() : null;
            request.put("Accommodation cost", accommodationCost != null ? accommodationCost : 1200);
            
            // Transportation preferences
            String transportType = mapTransport(
                preference != null ? preference.getTransportPreference() : null, mappings);
            request.put("Transportation type", transportType);
            
            Integer transportCost = preference != null ? preference.getTransportationBudget() : null;
            request.put("Transportation cost", transportCost != null ? transportCost : 800);
            
            // Target destination for recommendation explanation
            request.put("generate_cf_for", targetDestination != null ? targetDestination : "New York");
            
            log.info("Built ML model request for user {} with {} parameters", 
                    user.getId(), request.size());
            log.info("Request details: {}", request);
            
            return request;
            
        } catch (Exception e) {
            handleServiceException(e, "buildModelRequest");
            return getDefaultRequest();
        }
    }
    
    /**
     * Processes ML model predictions and converts to DestinationResponseDTO list
     * Expected model response format:
     * {
     *   "status": "success",
     *   "predictions": [
     *     {
     *       "rank": 1,
     *       "destination": "Paris",
     *       "probability": 0.8543,
     *       "confidence": "High",
     *       "explanation": "Based on your preferences...",
     *       "shap_details": {...}
     *     }
     *   ],
     *   "model_info": {...},
     *   "timestamp": "..."
     * }
     */
    public List<DestinationResponseDTO> processModelResponse(Map<String, Object> modelResponse, Integer userId) {
        try {
            logOperation("processModelResponse", userId);
            
            List<DestinationResponseDTO> recommendations = new ArrayList<>();
            
            if (modelResponse.containsKey("predictions")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> predictions = (List<Map<String, Object>>) modelResponse.get("predictions");
                
                for (Map<String, Object> prediction : predictions) {
                    String destinationName = (String) prediction.get("destination");
                    
                    // Find destination in database by name
                    Optional<Destination> destOpt = destinationRepository.findByName(destinationName);
                    if (destOpt.isPresent()) {
                        Destination destination = destOpt.get();
                        DestinationResponseDTO dto = convertToDestinationResponseDTO(destination, userId);
                        
                        // Add ML model prediction data
                        dto.setRank((Integer) prediction.get("rank"));
                        dto.setProbability(((Number) prediction.get("probability")).doubleValue());
                        dto.setConfidence((String) prediction.get("confidence"));
                        dto.setExplanation((String) prediction.get("explanation"));
                        dto.setShapDetails(prediction.get("shap_details"));
                        
                        recommendations.add(dto);
                    } else {
                        log.warn("Destination not found in database: {}", destinationName);
                    }
                }
                
                // Sort by rank (ascending)
                recommendations.sort(Comparator.comparing(DestinationResponseDTO::getRank));
                
            } else {
                // Fallback: return all destinations if model response is invalid
                log.warn("Invalid model response format, returning all destinations");
                return getAllDestinationsAsFallback(userId);
            }
            
            log.info("Processed ML model response for user {}: {} recommendations generated", 
                    userId, recommendations.size());
            
            return recommendations;
                    
        } catch (Exception e) {
            handleServiceException(e, "processModelResponse");
            log.warn("Error processing model response, falling back to all destinations");
            return getAllDestinationsAsFallback(userId);
        }
    }
    
    /**
     * Fallback method to return all destinations when model fails
     */
    private List<DestinationResponseDTO> getAllDestinationsAsFallback(Integer userId) {
        List<Destination> allDestinations = destinationRepository.findAll();
        
        List<DestinationResponseDTO> recommendations = allDestinations.stream()
                .map(dest -> convertToDestinationResponseDTO(dest, userId))
                .collect(Collectors.toList());
        
        // Add simulated ranking for fallback
        for (int i = 0; i < recommendations.size(); i++) {
            DestinationResponseDTO dto = recommendations.get(i);
            dto.setRank(i + 1);
            dto.setProbability(0.5 + (Math.random() * 0.3)); // Random probability 0.5-0.8
            dto.setConfidence(dto.getProbability() > 0.7 ? "High" : dto.getProbability() > 0.4 ? "Medium" : "Low");
            dto.setExplanation("Recommended based on your travel preferences and profile data.");
        }
        
        Collections.shuffle(recommendations); // Random order for fallback
        
        return recommendations;
    }
    
    /**
     * Calls the actual ML model for predictions via Python Flask service
     */
    public Map<String, Object> callMLModel(Map<String, Object> request) {
        try {
            log.info("Calling ML model service at: {}/predict", mlServiceUrl);
            log.info("Request payload: {}", request);
            
            // Set up HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create HTTP entity with request body
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            // Make HTTP POST request to Python ML service
            String url = mlServiceUrl + "/predict";
            log.info("Making POST request to: {}", url);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                Map.class
            );
            
            log.info("ML service response status: {}", response.getStatusCode());
            log.info("ML service response body: {}", response.getBody());
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                log.info("ML model service responded successfully with {} predictions", 
                        responseBody.containsKey("predictions") ? 
                        ((List<?>) responseBody.get("predictions")).size() : 0);
                return responseBody;
            } else {
                log.warn("ML model service returned status: {}", response.getStatusCode());
                return getErrorResponse("Invalid response from ML service");
            }
            
        } catch (ResourceAccessException e) {
            log.error("ML model service is unavailable at {}: {}", mlServiceUrl, e.getMessage());
            return getErrorResponse("ML service unavailable");
        } catch (Exception e) {
            log.error("Error calling ML model service: {}", e.getMessage(), e);
            return getErrorResponse("ML service error: " + e.getMessage());
        }
    }
    
    /**
     * Creates an error response when ML service fails
     */
    private Map<String, Object> getErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", message);
        response.put("predictions", Collections.emptyList());
        response.put("timestamp", LocalDate.now().toString());
        return response;
    }
    
    /**
     * Checks if ML model service is available
     */
    public boolean isMLServiceAvailable() {
        try {
            String healthUrl = mlServiceUrl + "/health";
            log.info("Checking ML service health at: {}", healthUrl);
            ResponseEntity<Map> response = restTemplate.getForEntity(healthUrl, Map.class);
            boolean isHealthy = response.getStatusCode() == HttpStatus.OK;
            log.info("ML service health check result: {} (status: {})", isHealthy, response.getStatusCode());
            if (isHealthy && response.getBody() != null) {
                log.info("ML service health response: {}", response.getBody());
            }
            return isHealthy;
        } catch (Exception e) {
            log.warn("ML service health check failed: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Converts Destination entity to DestinationResponseDTO with user-specific data
     */
    private DestinationResponseDTO convertToDestinationResponseDTO(Destination destination, Integer userId) {
        try {
            DestinationResponseDTO dto = new DestinationResponseDTO();
            
            dto.setId(destination.getId());
            dto.setName(destination.getName());
            dto.setDescription(destination.getDescription());
            dto.setClimate(destination.getClimate());
            dto.setPopularActivities(destination.getPopularActivities());
            dto.setImageUrl(destination.getImageUrl());
            dto.setTravelAdvisory(destination.getTravelAdvisory());
            
            // Get country name
            if (destination.getCountryId() != null) {
                countryRepository.findById(destination.getCountryId())
                        .ifPresent(country -> {
                            dto.setCountryName(country.getName());
                            if (country.getContinent() != null) {
                                dto.setContinentName(country.getContinent().getName());
                            }
                        });
            }
            
            // Calculate average rating from travel history
            BigDecimal averageRating = calculateAverageRating(destination.getId());
            dto.setAverageRating(averageRating);
            
            // Check if user has liked this destination (placeholder - implement with likes table)
            dto.setIsLiked(false);
            
            // Check if destination is in user's bucket list (placeholder - implement with bucket list check)
            dto.setIsInBucketList(false);
            
            return dto;
            
        } catch (Exception e) {
            log.error("Error converting destination {} to DTO: {}", destination.getId(), e.getMessage());
            return new DestinationResponseDTO();
        }
    }
    
    /**
     * Calculates average rating for a destination based on travel history ratings
     */
    private BigDecimal calculateAverageRating(Integer destinationId) {
        try {
            Double averageRating = travelHistoryRepository.findAverageRatingByDestinationId(destinationId);
            
            if (averageRating != null && averageRating > 0) {
                return BigDecimal.valueOf(averageRating).setScale(1, BigDecimal.ROUND_HALF_UP);
            } else {
                // Fallback: simulate rating based on destination popularity (4.0 to 4.9)
                double rating = 4.0 + (destinationId % 10) * 0.1;
                return BigDecimal.valueOf(rating).setScale(1, BigDecimal.ROUND_HALF_UP);
            }
            
        } catch (Exception e) {
            log.error("Error calculating average rating for destination {}: {}", destinationId, e.getMessage());
            return BigDecimal.valueOf(4.5);
        }
    }
    
    // Feature mapping methods
    
    private String mapSeason(Season season, JsonNode mappings) {
        if (season == null) return mappings.path("default_values").path("season").asText("Summer");
        
        JsonNode seasonMap = mappings.path("enum_mappings").path("season");
        return seasonMap.path(season.name()).asText("Summer");
    }
    
    private String mapGender(Gender gender, JsonNode mappings) {
        if (gender == null) return "Male"; // Default
        
        JsonNode genderMap = mappings.path("enum_mappings").path("gender");
        return genderMap.path(gender.name()).asText("Male");
    }
    
    private String mapNationality(Set<Country> citizenships, JsonNode mappings) {
        if (citizenships == null || citizenships.isEmpty()) {
            return mappings.path("default_values").path("nationality").asText("American");
        }
        
        // Use first citizenship
        Country primaryCitizenship = citizenships.iterator().next();
        JsonNode nationalityMap = mappings.path("nationality_mappings");
        return nationalityMap.path(primaryCitizenship.getName()).asText("American");
    }
    
    private String mapAccommodation(PreferredAccommodationType accommodation, JsonNode mappings) {
        if (accommodation == null) return "Hotel";
        
        JsonNode accommodationMap = mappings.path("enum_mappings").path("accommodation");
        return accommodationMap.path(accommodation.name()).asText("Hotel");
    }
    
    private String mapTransport(TransportType transport, JsonNode mappings) {
        if (transport == null) return "Flight";
        
        JsonNode transportMap = mappings.path("enum_mappings").path("transport");
        return transportMap.path(transport.name()).asText("Flight");
    }
    
    private JsonNode loadFeatureMappings() {
        try {
            ClassPathResource resource = new ClassPathResource("models/travel_destination_model/feature_mappings.json");
            return objectMapper.readTree(resource.getInputStream());
        } catch (IOException e) {
            log.error("Failed to load feature mappings: {}", e.getMessage());
            return objectMapper.createObjectNode();
        }
    }
    
    private Map<String, Object> getDefaultRequest() {
        Map<String, Object> request = new HashMap<>();
        request.put("Traveler DOB", "01/01/1990");
        request.put("Season", "Summer");
        request.put("Duration (days)", 7);
        request.put("Traveler gender", "Male");
        request.put("Traveler nationality", "American");
        request.put("Accommodation type", "Hotel");
        request.put("Accommodation cost", 1200);
        request.put("Transportation type", "Flight");
        request.put("Transportation cost", 800);
        request.put("generate_cf_for", "New York");
        return request;
    }
}