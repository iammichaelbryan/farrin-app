package com.farrin.farrin.dto;

import com.farrin.farrin.model.Climate;
import com.farrin.farrin.model.Interest;
import com.farrin.farrin.model.TransportType;
import com.farrin.farrin.model.TravelStyle;

public class PreferenceUpdateDTOBuilder extends DTOBuilder<PreferenceUpdateDTO> {
    
    public PreferenceUpdateDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<PreferenceUpdateDTO> reset() {
        this.product = new PreferenceUpdateDTO();
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setAccommodationBudget(Integer accommodationBudget) {
        this.product.setAccommodationBudget(accommodationBudget);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setTransportationBudget(Integer transportationBudget) {
        this.product.setTransportationBudget(transportationBudget);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setTotalBudget(Integer totalBudget) {
        this.product.setTotalBudget(totalBudget);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setPrimaryInterest(Interest primaryInterest) {
        this.product.setPrimaryInterest(primaryInterest);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setPrimaryTravelStyle(TravelStyle primaryTravelStyle) {
        this.product.setPrimaryTravelStyle(primaryTravelStyle);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setPreferredClimate(Climate preferredClimate) {
        this.product.setPreferredClimate(preferredClimate);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setAvgTravelDuration(Integer avgTravelDuration) {
        this.product.setAvgTravelDuration(avgTravelDuration);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setTransportPreference(TransportType transportPreference) {
        this.product.setTransportPreference(transportPreference);
        return this;
    }
    
    public PreferenceUpdateDTOBuilder setDataSharing(Boolean dataSharing) {
        this.product.setDataSharing(dataSharing);
        return this;
    }
    
    @Override
    public PreferenceUpdateDTO getResult() {
        PreferenceUpdateDTO result = this.product;
        reset();
        return result;
    }
}