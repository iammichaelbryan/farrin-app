package com.farrin.farrin.dto;

import com.farrin.farrin.model.Season;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class WeatherDataDTOBuilder extends DTOBuilder<WeatherDataDTO> {
    
    public WeatherDataDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<WeatherDataDTO> reset() {
        this.product = new WeatherDataDTO();
        return this;
    }
    
    public WeatherDataDTOBuilder setStatus(String status) {
        this.product.setStatus(status);
        return this;
    }
    
    public WeatherDataDTOBuilder setTimestamp(LocalDateTime timestamp) {
        this.product.setTimestamp(timestamp);
        return this;
    }
    
    public WeatherDataDTOBuilder setSource(String source) {
        this.product.setSource(source);
        return this;
    }
    
    public WeatherDataDTOBuilder setRequestId(String requestId) {
        this.product.setRequestId(requestId);
        return this;
    }
    
    public WeatherDataDTOBuilder setLocation(String location) {
        this.product.setLocation(location);
        return this;
    }
    
    public WeatherDataDTOBuilder setDate(LocalDate date) {
        this.product.setDate(date);
        return this;
    }
    
    public WeatherDataDTOBuilder setTemperature(BigDecimal temperature) {
        this.product.setTemperature(temperature);
        return this;
    }
    
    public WeatherDataDTOBuilder setCondition(String condition) {
        this.product.setCondition(condition);
        return this;
    }
    
    public WeatherDataDTOBuilder setHumidity(Integer humidity) {
        this.product.setHumidity(humidity);
        return this;
    }
    
    public WeatherDataDTOBuilder setWindSpeed(BigDecimal windSpeed) {
        this.product.setWindSpeed(windSpeed);
        return this;
    }
    
    public WeatherDataDTOBuilder setPrecipitationProbability(BigDecimal precipitationProbability) {
        this.product.setPrecipitationProbability(precipitationProbability);
        return this;
    }
    
    public WeatherDataDTOBuilder setSeason(Season season) {
        this.product.setSeason(season);
        return this;
    }
    
    public WeatherDataDTOBuilder setUvIndex(Integer uvIndex) {
        this.product.setUvIndex(uvIndex);
        return this;
    }
    
    @Override
    public WeatherDataDTO getResult() {
        WeatherDataDTO result = this.product;
        reset();
        return result;
    }
}