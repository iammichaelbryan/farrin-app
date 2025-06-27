package com.farrin.farrin.dto;

import com.farrin.farrin.model.Season;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class WeatherDataDTO extends ExternalApiResponseDTO {
    private String location;
    private LocalDate date;
    private BigDecimal temperature;
    private String condition;
    private Integer humidity;
    private BigDecimal windSpeed;
    private BigDecimal precipitationProbability;
    private Season season;
    private Integer uvIndex;
}