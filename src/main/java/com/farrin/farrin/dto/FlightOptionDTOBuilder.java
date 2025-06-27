package com.farrin.farrin.dto;

import com.farrin.farrin.model.CurrencyCode;
import com.farrin.farrin.model.FlightClassification;

import java.time.LocalDateTime;

public class FlightOptionDTOBuilder extends DTOBuilder<FlightOptionDTO> {
    
    public FlightOptionDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<FlightOptionDTO> reset() {
        this.product = new FlightOptionDTO();
        return this;
    }
    
    public FlightOptionDTOBuilder setStatus(String status) {
        this.product.setStatus(status);
        return this;
    }
    
    public FlightOptionDTOBuilder setTimestamp(LocalDateTime timestamp) {
        this.product.setTimestamp(timestamp);
        return this;
    }
    
    public FlightOptionDTOBuilder setSource(String source) {
        this.product.setSource(source);
        return this;
    }
    
    public FlightOptionDTOBuilder setRequestId(String requestId) {
        this.product.setRequestId(requestId);
        return this;
    }
    
    public FlightOptionDTOBuilder setFlightNumber(String flightNumber) {
        this.product.setFlightNumber(flightNumber);
        return this;
    }
    
    public FlightOptionDTOBuilder setAirline(String airline) {
        this.product.setAirline(airline);
        return this;
    }
    
    public FlightOptionDTOBuilder setDepartureLocation(String departureLocation) {
        this.product.setDepartureLocation(departureLocation);
        return this;
    }
    
    public FlightOptionDTOBuilder setArrivalLocation(String arrivalLocation) {
        this.product.setArrivalLocation(arrivalLocation);
        return this;
    }
    
    public FlightOptionDTOBuilder setDepartureTime(LocalDateTime departureTime) {
        this.product.setDepartureTime(departureTime);
        return this;
    }
    
    public FlightOptionDTOBuilder setArrivalTime(LocalDateTime arrivalTime) {
        this.product.setArrivalTime(arrivalTime);
        return this;
    }
    
    public FlightOptionDTOBuilder setPrice(Integer price) {
        this.product.setPrice(price);
        return this;
    }
    
    public FlightOptionDTOBuilder setCurrency(CurrencyCode currency) {
        this.product.setCurrency(currency);
        return this;
    }
    
    public FlightOptionDTOBuilder setClassification(FlightClassification classification) {
        this.product.setClassification(classification);
        return this;
    }
    
    public FlightOptionDTOBuilder setDuration(Integer duration) {
        this.product.setDuration(duration);
        return this;
    }
    
    public FlightOptionDTOBuilder setAvailableSeats(Integer availableSeats) {
        this.product.setAvailableSeats(availableSeats);
        return this;
    }
    
    @Override
    public FlightOptionDTO getResult() {
        FlightOptionDTO result = this.product;
        reset();
        return result;
    }
}