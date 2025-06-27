package com.farrin.farrin.dto;

public class PasswordResetDTOBuilder extends DTOBuilder<PasswordResetDTO> {
    
    public PasswordResetDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<PasswordResetDTO> reset() {
        this.product = new PasswordResetDTO();
        return this;
    }
    
    public PasswordResetDTOBuilder setEmail(String email) {
        this.product.setEmail(email);
        return this;
    }
    
    public PasswordResetDTOBuilder setResetCode(String resetCode) {
        this.product.setResetCode(resetCode);
        return this;
    }
    
    public PasswordResetDTOBuilder setNewPassword(String newPassword) {
        this.product.setNewPassword(newPassword);
        return this;
    }
    
    @Override
    public PasswordResetDTO getResult() {
        PasswordResetDTO result = this.product;
        reset();
        return result;
    }
}