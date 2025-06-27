package com.farrin.farrin.dto;

import com.farrin.farrin.model.FlightClassification;

import java.time.LocalDateTime;

public class FlightDTOBuilder extends DTOBuilder<FlightDTO> {
    
    public FlightDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<FlightDTO> reset() {
        this.product = new FlightDTO();
        return this;
    }
    
    public FlightDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public FlightDTOBuilder setTripId(Integer tripId) {
        this.product.setTripId(tripId);
        return this;
    }
    
    public FlightDTOBuilder setFlightNumber(String flightNumber) {
        this.product.setFlightNumber(flightNumber);
        return this;
    }
    
    public FlightDTOBuilder setProviderName(String providerName) {
        this.product.setProviderName(providerName);
        return this;
    }
    
    public FlightDTOBuilder setCost(Integer cost) {
        this.product.setCost(cost);
        return this;
    }
    
    public FlightDTOBuilder setDeparture(LocalDateTime departure) {
        this.product.setDeparture(departure);
        return this;
    }
    
    public FlightDTOBuilder setArrival(LocalDateTime arrival) {
        this.product.setArrival(arrival);
        return this;
    }
    
    public FlightDTOBuilder setDepartureLocation(String departureLocation) {
        this.product.setDepartureLocation(departureLocation);
        return this;
    }
    
    public FlightDTOBuilder setArrivalLocation(String arrivalLocation) {
        this.product.setArrivalLocation(arrivalLocation);
        return this;
    }
    
    public FlightDTOBuilder setClassification(FlightClassification classification) {
        this.product.setClassification(classification);
        return this;
    }
    
    public FlightDTOBuilder setConfirmationCode(String confirmationCode) {
        this.product.setConfirmationCode(confirmationCode);
        return this;
    }
    
    public FlightDTOBuilder setUserNotes(String userNotes) {
        this.product.setUserNotes(userNotes);
        return this;
    }
    
    @Override
    public FlightDTO getResult() {
        FlightDTO result = this.product;
        reset();
        return result;
    }
}