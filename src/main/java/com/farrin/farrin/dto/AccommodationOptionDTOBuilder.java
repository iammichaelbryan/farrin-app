package com.farrin.farrin.dto;

import com.farrin.farrin.model.CurrencyCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public class AccommodationOptionDTOBuilder extends DTOBuilder<AccommodationOptionDTO> {
    
    public AccommodationOptionDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<AccommodationOptionDTO> reset() {
        this.product = new AccommodationOptionDTO();
        return this;
    }
    
    public AccommodationOptionDTOBuilder setStatus(String status) {
        this.product.setStatus(status);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setTimestamp(LocalDateTime timestamp) {
        this.product.setTimestamp(timestamp);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setSource(String source) {
        this.product.setSource(source);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setRequestId(String requestId) {
        this.product.setRequestId(requestId);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setName(String name) {
        this.product.setName(name);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setLocation(String location) {
        this.product.setLocation(location);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setCheckIn(LocalDateTime checkIn) {
        this.product.setCheckIn(checkIn);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setCheckOut(LocalDateTime checkOut) {
        this.product.setCheckOut(checkOut);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setPricePerNight(BigDecimal pricePerNight) {
        this.product.setPricePerNight(pricePerNight);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setCurrency(CurrencyCode currency) {
        this.product.setCurrency(currency);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setRating(BigDecimal rating) {
        this.product.setRating(rating);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setAmenities(Set<String> amenities) {
        this.product.setAmenities(amenities);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setImageUrls(Set<String> imageUrls) {
        this.product.setImageUrls(imageUrls);
        return this;
    }
    
    public AccommodationOptionDTOBuilder setAvailableRooms(Integer availableRooms) {
        this.product.setAvailableRooms(availableRooms);
        return this;
    }
    
    @Override
    public AccommodationOptionDTO getResult() {
        AccommodationOptionDTO result = this.product;
        reset();
        return result;
    }
}