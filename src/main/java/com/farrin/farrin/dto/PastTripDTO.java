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
public class PastTripDTO {
    private Integer userId;
    private Integer destinationId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer rating; // 1-5 star rating
    private String notes;
    private Integer totalCost;
}