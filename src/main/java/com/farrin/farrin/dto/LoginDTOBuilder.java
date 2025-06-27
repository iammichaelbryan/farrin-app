package com.farrin.farrin.dto;

public class LoginDTOBuilder extends DTOBuilder<LoginDTO> {
    
    public LoginDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<LoginDTO> reset() {
        this.product = new LoginDTO();
        return this;
    }
    
    public LoginDTOBuilder setEmail(String email) {
        this.product.setEmail(email);
        return this;
    }
    
    public LoginDTOBuilder setPassword(String password) {
        this.product.setPassword(password);
        return this;
    }
    
    @Override
    public LoginDTO getResult() {
        LoginDTO result = this.product;
        reset();
        return result;
    }
}