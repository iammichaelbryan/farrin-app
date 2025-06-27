package com.farrin.farrin.dto;

import com.farrin.farrin.model.Climate;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DestinationResponseDTOBuilder extends DTOBuilder<DestinationResponseDTO> {
    
    public DestinationResponseDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<DestinationResponseDTO> reset() {
        this.product = new DestinationResponseDTO();
        return this;
    }
    
    public DestinationResponseDTOBuilder setId(Integer id) {
        this.product.setId(id);
        return this;
    }
    
    public DestinationResponseDTOBuilder setName(String name) {
        this.product.setName(name);
        return this;
    }
    
    public DestinationResponseDTOBuilder setDescription(String description) {
        this.product.setDescription(description);
        return this;
    }
    
    public DestinationResponseDTOBuilder setCountryName(String countryName) {
        this.product.setCountryName(countryName);
        return this;
    }
    
    public DestinationResponseDTOBuilder setContinentName(String continentName) {
        this.product.setContinentName(continentName);
        return this;
    }
    
    public DestinationResponseDTOBuilder setClimate(Climate climate) {
        this.product.setClimate(climate);
        return this;
    }
    
    public DestinationResponseDTOBuilder setPopularActivities(Set<String> popularActivities) {
        this.product.setPopularActivities(popularActivities);
        return this;
    }
    
    public DestinationResponseDTOBuilder setImageUrl(String imageUrl) {
        this.product.setImageUrl(imageUrl);
        return this;
    }
    
    public DestinationResponseDTOBuilder setTravelAdvisory(String travelAdvisory) {
        this.product.setTravelAdvisory(travelAdvisory);
        return this;
    }
    
    @Override
    public DestinationResponseDTO getResult() {
        DestinationResponseDTO result = this.product;
        reset();
        return result;
    }
}