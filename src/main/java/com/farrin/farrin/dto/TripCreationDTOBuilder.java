package com.farrin.farrin.dto;

import com.farrin.farrin.model.TripType;

import java.time.LocalDateTime;
import java.util.Set;

public class TripCreationDTOBuilder extends DTOBuilder<TripCreationDTO> {
    
    public TripCreationDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<TripCreationDTO> reset() {
        this.product = new TripCreationDTO();
        return this;
    }
    
    public TripCreationDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public TripCreationDTOBuilder setDestinationId(Integer destinationId) {
        this.product.setDestinationId(destinationId);
        return this;
    }
    
    public TripCreationDTOBuilder setTripType(TripType tripType) {
        this.product.setTripType(tripType);
        return this;
    }
    
    public TripCreationDTOBuilder setStartDate(LocalDateTime startDate) {
        this.product.setStartDate(startDate);
        return this;
    }
    
    public TripCreationDTOBuilder setDurationDays(Integer durationDays) {
        this.product.setDurationDays(durationDays);
        return this;
    }
    
    public TripCreationDTOBuilder setInviteeEmails(Set<String> inviteeEmails) {
        this.product.setInviteeEmails(inviteeEmails);
        return this;
    }
    
    @Override
    public TripCreationDTO getResult() {
        TripCreationDTO result = this.product;
        reset();
        return result;
    }
}