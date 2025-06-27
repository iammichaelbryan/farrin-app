package com.farrin.farrin.dto;

import com.farrin.farrin.model.Country;

import java.time.LocalDate;
import java.util.Set;

public class ProfileUpdateDTOBuilder extends DTOBuilder<ProfileUpdateDTO> {
    
    public ProfileUpdateDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<ProfileUpdateDTO> reset() {
        this.product = new ProfileUpdateDTO();
        return this;
    }
    
    public ProfileUpdateDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public ProfileUpdateDTOBuilder setFirstName(String firstName) {
        this.product.setFirstName(firstName);
        return this;
    }
    
    public ProfileUpdateDTOBuilder setLastName(String lastName) {
        this.product.setLastName(lastName);
        return this;
    }
    
    public ProfileUpdateDTOBuilder setEmail(String email) {
        this.product.setEmail(email);
        return this;
    }
    
    public ProfileUpdateDTOBuilder setDob(LocalDate dob) {
        this.product.setDob(dob);
        return this;
    }
    
    public ProfileUpdateDTOBuilder setCitizenships(Set<Country> citizenships) {
        this.product.setCitizenships(citizenships);
        return this;
    }
    
    @Override
    public ProfileUpdateDTO getResult() {
        ProfileUpdateDTO result = this.product;
        reset();
        return result;
    }
}