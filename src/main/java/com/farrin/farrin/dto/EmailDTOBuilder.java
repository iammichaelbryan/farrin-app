package com.farrin.farrin.dto;

public class EmailDTOBuilder extends DTOBuilder<EmailDTO> {
    
    public EmailDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<EmailDTO> reset() {
        this.product = new EmailDTO();
        return this;
    }
    
    public EmailDTOBuilder setId(Integer id) {
        this.product.setId(id);
        return this;
    }
    
    public EmailDTOBuilder setEmailTo(String emailTo) {
        this.product.setEmailTo(emailTo);
        return this;
    }
    
    public EmailDTOBuilder setBody(String body) {
        this.product.setBody(body);
        return this;
    }
    
    @Override
    public EmailDTO getResult() {
        EmailDTO result = this.product;
        reset();
        return result;
    }
}