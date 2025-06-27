package com.farrin.farrin.dto;

import java.time.LocalDateTime;

public class EventDTOBuilder extends DTOBuilder<EventDTO> {
    
    public EventDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<EventDTO> reset() {
        this.product = new EventDTO();
        return this;
    }
    
    public EventDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public EventDTOBuilder setTripId(Integer tripId) {
        this.product.setTripId(tripId);
        return this;
    }
    
    public EventDTOBuilder setName(String name) {
        this.product.setName(name);
        return this;
    }
    
    public EventDTOBuilder setEventDateTime(LocalDateTime eventDateTime) {
        this.product.setEventDateTime(eventDateTime);
        return this;
    }
    
    public EventDTOBuilder setLocation(String location) {
        this.product.setLocation(location);
        return this;
    }
    
    public EventDTOBuilder setDescription(String description) {
        this.product.setDescription(description);
        return this;
    }
    
    @Override
    public EventDTO getResult() {
        EventDTO result = this.product;
        reset();
        return result;
    }
}