package com.farrin.farrin.dto;

import com.farrin.farrin.model.FlightClassification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightDTO {
    private Integer userId;
    private Integer tripId;
    private String flightNumber;
    private String providerName;
    private Integer cost;
    private LocalDateTime departure;
    private LocalDateTime arrival;
    private String departureLocation;
    private String arrivalLocation;
    private FlightClassification classification;
    private String confirmationCode;
    private String userNotes;
}