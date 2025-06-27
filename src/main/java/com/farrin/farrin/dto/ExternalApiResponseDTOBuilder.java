package com.farrin.farrin.dto;

import java.time.LocalDateTime;

public class ExternalApiResponseDTOBuilder extends DTOBuilder<ExternalApiResponseDTO> {
    
    public ExternalApiResponseDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<ExternalApiResponseDTO> reset() {
        this.product = new ExternalApiResponseDTO();
        return this;
    }
    
    public ExternalApiResponseDTOBuilder setStatus(String status) {
        this.product.setStatus(status);
        return this;
    }
    
    public ExternalApiResponseDTOBuilder setTimestamp(LocalDateTime timestamp) {
        this.product.setTimestamp(timestamp);
        return this;
    }
    
    public ExternalApiResponseDTOBuilder setSource(String source) {
        this.product.setSource(source);
        return this;
    }
    
    public ExternalApiResponseDTOBuilder setRequestId(String requestId) {
        this.product.setRequestId(requestId);
        return this;
    }
    
    @Override
    public ExternalApiResponseDTO getResult() {
        ExternalApiResponseDTO result = this.product;
        reset();
        return result;
    }
}