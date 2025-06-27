package com.farrin.farrin.dto;

import java.math.BigDecimal;
import java.util.Set;

public class RecommendationResponseDTOBuilder extends DTOBuilder<RecommendationResponseDTO> {
    
    public RecommendationResponseDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<RecommendationResponseDTO> reset() {
        this.product = new RecommendationResponseDTO();
        return this;
    }
    
    public RecommendationResponseDTOBuilder setDestinations(Set<DestinationResponseDTO> destinations) {
        this.product.setDestinations(destinations);
        return this;
    }
    
    public RecommendationResponseDTOBuilder setActivities(Set<String> activities) {
        this.product.setActivities(activities);
        return this;
    }
    
    public RecommendationResponseDTOBuilder setBudgetEstimate(Integer budgetEstimate) {
        this.product.setBudgetEstimate(budgetEstimate);
        return this;
    }
    
    public RecommendationResponseDTOBuilder setSentimentScore(BigDecimal sentimentScore) {
        this.product.setSentimentScore(sentimentScore);
        return this;
    }
    
    @Override
    public RecommendationResponseDTO getResult() {
        RecommendationResponseDTO result = this.product;
        reset();
        return result;
    }
}