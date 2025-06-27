package com.farrin.farrin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TravelGoalDTOBuilder extends DTOBuilder<TravelGoalDTO> {
    
    public TravelGoalDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<TravelGoalDTO> reset() {
        this.product = new TravelGoalDTO();
        return this;
    }
    
    public TravelGoalDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public TravelGoalDTOBuilder setName(String name) {
        this.product.setName(name);
        return this;
    }
    
    public TravelGoalDTOBuilder setCategory(String category) {
        this.product.setCategory(category);
        return this;
    }
    
    public TravelGoalDTOBuilder setDescription(String description) {
        this.product.setDescription(description);
        return this;
    }
    
    public TravelGoalDTOBuilder setTargetDate(LocalDateTime targetDate) {
        this.product.setTargetDate(targetDate);
        return this;
    }
    
    public TravelGoalDTOBuilder setProgress(BigDecimal progress) {
        this.product.setProgress(progress);
        return this;
    }
    
    public TravelGoalDTOBuilder setIsCompleted(Boolean isCompleted) {
        this.product.setIsCompleted(isCompleted);
        return this;
    }
    
    @Override
    public TravelGoalDTO getResult() {
        TravelGoalDTO result = this.product;
        reset();
        return result;
    }
}