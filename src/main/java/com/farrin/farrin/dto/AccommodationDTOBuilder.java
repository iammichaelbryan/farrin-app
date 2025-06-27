package com.farrin.farrin.dto;

import java.time.LocalDateTime;

public class AccommodationDTOBuilder extends DTOBuilder<AccommodationDTO> {
    
    public AccommodationDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<AccommodationDTO> reset() {
        this.product = new AccommodationDTO();
        return this;
    }
    
    public AccommodationDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public AccommodationDTOBuilder setTripId(Integer tripId) {
        this.product.setTripId(tripId);
        return this;
    }
    
    public AccommodationDTOBuilder setName(String name) {
        this.product.setName(name);
        return this;
    }
    
    public AccommodationDTOBuilder setProviderName(String providerName) {
        this.product.setProviderName(providerName);
        return this;
    }
    
    public AccommodationDTOBuilder setCost(Integer cost) {
        this.product.setCost(cost);
        return this;
    }
    
    public AccommodationDTOBuilder setCheckIn(LocalDateTime checkIn) {
        this.product.setCheckIn(checkIn);
        return this;
    }
    
    public AccommodationDTOBuilder setCheckOut(LocalDateTime checkOut) {
        this.product.setCheckOut(checkOut);
        return this;
    }
    
    public AccommodationDTOBuilder setAddress(String address) {
        this.product.setAddress(address);
        return this;
    }
    
    public AccommodationDTOBuilder setRoomType(String roomType) {
        this.product.setRoomType(roomType);
        return this;
    }
    
    public AccommodationDTOBuilder setConfirmationCode(String confirmationCode) {
        this.product.setConfirmationCode(confirmationCode);
        return this;
    }
    
    public AccommodationDTOBuilder setUserNotes(String userNotes) {
        this.product.setUserNotes(userNotes);
        return this;
    }
    
    @Override
    public AccommodationDTO getResult() {
        AccommodationDTO result = this.product;
        reset();
        return result;
    }
}