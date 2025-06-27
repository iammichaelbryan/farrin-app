package com.farrin.farrin.dto;

import com.farrin.farrin.model.TripStatus;
import com.farrin.farrin.model.TripType;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TripResponseDTOBuilder extends DTOBuilder<TripResponseDTO> {
    
    public TripResponseDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<TripResponseDTO> reset() {
        this.product = new TripResponseDTO();
        return this;
    }
    
    public TripResponseDTOBuilder setId(Integer id) {
        this.product.setId(id);
        return this;
    }
    
    public TripResponseDTOBuilder setOwnerId(Integer ownerId) {
        this.product.setOwnerId(ownerId);
        return this;
    }
    
    public TripResponseDTOBuilder setDestinationId(Integer destinationId) {
        this.product.setDestinationId(destinationId);
        return this;
    }
    
    public TripResponseDTOBuilder setDestinationName(String destinationName) {
        this.product.setDestinationName(destinationName);
        return this;
    }
    
    public TripResponseDTOBuilder setTripType(TripType tripType) {
        this.product.setTripType(tripType);
        return this;
    }
    
    public TripResponseDTOBuilder setStartDate(LocalDateTime startDate) {
        this.product.setStartDate(startDate);
        return this;
    }
    
    public TripResponseDTOBuilder setEndDate(LocalDateTime endDate) {
        this.product.setEndDate(endDate);
        return this;
    }
    
    public TripResponseDTOBuilder setStatus(TripStatus status) {
        this.product.setStatus(status);
        return this;
    }
    
    public TripResponseDTOBuilder setDurationDays(Integer durationDays) {
        this.product.setDurationDays(durationDays);
        return this;
    }
    
    public TripResponseDTOBuilder setMemberCount(Integer memberCount) {
        this.product.setMemberCount(memberCount);
        return this;
    }
    
    public TripResponseDTOBuilder setCreatedAt(LocalDateTime createdAt) {
        this.product.setCreatedAt(createdAt);
        return this;
    }
    
    @Override
    public TripResponseDTO getResult() {
        TripResponseDTO result = this.product;
        reset();
        return result;
    }
}