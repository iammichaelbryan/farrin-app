package com.farrin.farrin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponseDTO {
    private Set<DestinationResponseDTO> destinations;
    private Set<String> activities;
    private Integer budgetEstimate;
    private BigDecimal sentimentScore;
}