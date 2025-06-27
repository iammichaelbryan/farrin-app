package com.farrin.farrin.dto;

import com.farrin.farrin.model.CurrencyCode;
import com.farrin.farrin.model.FlightClassification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FlightOptionDTO extends ExternalApiResponseDTO {
    private String flightNumber;
    private String airline;
    private String departureLocation;
    private String arrivalLocation;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer price;
    private CurrencyCode currency;
    private FlightClassification classification;
    private Integer duration;
    private Integer availableSeats;
}