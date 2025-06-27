package com.farrin.farrin.dto;

import com.farrin.farrin.model.CurrencyCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CurrencyRateDTOBuilder extends DTOBuilder<CurrencyRateDTO> {
    
    public CurrencyRateDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<CurrencyRateDTO> reset() {
        this.product = new CurrencyRateDTO();
        return this;
    }
    
    public CurrencyRateDTOBuilder setStatus(String status) {
        this.product.setStatus(status);
        return this;
    }
    
    public CurrencyRateDTOBuilder setTimestamp(LocalDateTime timestamp) {
        this.product.setTimestamp(timestamp);
        return this;
    }
    
    public CurrencyRateDTOBuilder setSource(String source) {
        this.product.setSource(source);
        return this;
    }
    
    public CurrencyRateDTOBuilder setRequestId(String requestId) {
        this.product.setRequestId(requestId);
        return this;
    }
    
    public CurrencyRateDTOBuilder setBaseCurrency(CurrencyCode baseCurrency) {
        this.product.setBaseCurrency(baseCurrency);
        return this;
    }
    
    public CurrencyRateDTOBuilder setTargetCurrency(CurrencyCode targetCurrency) {
        this.product.setTargetCurrency(targetCurrency);
        return this;
    }
    
    public CurrencyRateDTOBuilder setRate(BigDecimal rate) {
        this.product.setRate(rate);
        return this;
    }
    
    public CurrencyRateDTOBuilder setLastUpdated(LocalDateTime lastUpdated) {
        this.product.setLastUpdated(lastUpdated);
        return this;
    }
    
    @Override
    public CurrencyRateDTO getResult() {
        CurrencyRateDTO result = this.product;
        reset();
        return result;
    }
}