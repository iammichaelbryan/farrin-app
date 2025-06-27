package com.farrin.farrin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PastTripResponseDTO {
    private Integer id;
    private String name; // destination name
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer durationDays;
    private String notes;
    private Integer totalCost;
    private Integer rating;
}