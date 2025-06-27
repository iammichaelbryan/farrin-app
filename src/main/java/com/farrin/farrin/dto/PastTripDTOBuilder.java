package com.farrin.farrin.dto;

public class PastTripDTOBuilder extends DTOBuilder<PastTripDTO> {
    
    public PastTripDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<PastTripDTO> reset() {
        this.product = new PastTripDTO();
        return this;
    }
    
    public PastTripDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public PastTripDTOBuilder setDestinationId(Integer destinationId) {
        this.product.setDestinationId(destinationId);
        return this;
    }
    
    @Override
    public PastTripDTO getResult() {
        PastTripDTO result = this.product;
        reset();
        return result;
    }
}