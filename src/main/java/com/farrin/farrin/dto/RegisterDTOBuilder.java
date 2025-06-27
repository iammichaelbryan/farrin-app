package com.farrin.farrin.dto;

import com.farrin.farrin.model.Country;
import com.farrin.farrin.model.Gender;

import java.time.LocalDate;
import java.util.Set;

public class RegisterDTOBuilder extends DTOBuilder<RegisterDTO> {
    
    public RegisterDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<RegisterDTO> reset() {
        this.product = new RegisterDTO();
        return this;
    }
    
    public RegisterDTOBuilder setEmail(String email) {
        this.product.setEmail(email);
        return this;
    }
    
    public RegisterDTOBuilder setPassword(String password) {
        this.product.setPassword(password);
        return this;
    }
    
    public RegisterDTOBuilder setFirstName(String firstName) {
        this.product.setFirstName(firstName);
        return this;
    }
    
    public RegisterDTOBuilder setLastName(String lastName) {
        this.product.setLastName(lastName);
        return this;
    }
    
    public RegisterDTOBuilder setDob(String dob) {
        this.product.setDateOfBirth(dob);
        return this;
    }
    
    public RegisterDTOBuilder setGender(Gender gender) {
        this.product.setGender(gender);
        return this;
    }
    
    public RegisterDTOBuilder setCitizenshipIds(Set<Integer> citizenshipIds) {
        this.product.setCitizenshipIds(citizenshipIds);
        return this;
    }
    
    @Override
    public RegisterDTO getResult() {
        RegisterDTO result = this.product;
        reset();
        return result;
    }
}