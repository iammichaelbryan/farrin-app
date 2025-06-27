package com.farrin.farrin.dto;

import com.farrin.farrin.model.Gender;
import com.farrin.farrin.model.Country;
import com.farrin.farrin.model.Destination;
import com.farrin.farrin.model.Preference;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
public class UserResponseDTOBuilder extends DTOBuilder<UserResponseDTO> {
    
    public UserResponseDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<UserResponseDTO> reset() {
        this.product = new UserResponseDTO();
        return this;
    }
    
    public UserResponseDTOBuilder setId(Integer id) {
        this.product.setId(id);
        return this;
    }
    
    public UserResponseDTOBuilder setFirstName(String firstName) {
        this.product.setFirstName(firstName);
        return this;
    }
    
    public UserResponseDTOBuilder setLastName(String lastName) {
        this.product.setLastName(lastName);
        return this;
    }
    
    public UserResponseDTOBuilder setEmail(String email) {
        this.product.setEmail(email);
        return this;
    }
    
    public UserResponseDTOBuilder setGender(Gender gender) {
        this.product.setGender(gender);
        return this;
    }
    
    public UserResponseDTOBuilder setAge(Integer age) {
        this.product.setAge(age);
        return this;
    }
    
    public UserResponseDTOBuilder setIsVerified(Boolean isVerified) {
        this.product.setIsVerified(isVerified);
        return this;
    }
    
    public UserResponseDTOBuilder setLoginCount(Integer loginCount) {
        this.product.setLoginCount(loginCount);
        return this;
    }
    
    public UserResponseDTOBuilder setDob(LocalDate dob) {
        this.product.setDob(dob);
        return this;
    }
    
    public UserResponseDTOBuilder setCreatedAt(LocalDateTime createdAt) {
        this.product.setCreatedAt(createdAt);
        return this;
    }
    
    public UserResponseDTOBuilder setCitizenships(Set<Country> citizenships) {
        this.product.setCitizenships(citizenships);
        return this;
    }
    
    public UserResponseDTOBuilder setPreferences(Preference preferences) {
        this.product.setPreferences(preferences);
        return this;
    }
    
    public UserResponseDTOBuilder setTravelHistory(Set<Destination> travelHistory) {
        this.product.setTravelHistory(travelHistory);
        return this;
    }
    
    public UserResponseDTOBuilder setBucketList(Set<Destination> bucketList) {
        this.product.setBucketList(bucketList);
        return this;
    }
    
    @Override
    public UserResponseDTO getResult() {
        UserResponseDTO result = this.product;
        reset();
        return result;
    }
}