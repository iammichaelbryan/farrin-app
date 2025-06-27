package com.farrin.farrin.dto;

import com.farrin.farrin.model.Climate;
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
public class DestinationResponseDTO {
    private Integer id;
    private String name;
    private String description;
    private String countryName;
    private String continentName;
    private Climate climate;
    private Set<String> popularActivities;
    private String imageUrl;
    private String travelAdvisory;
    private BigDecimal averageRating;
    private Boolean isLiked;
    private Boolean isInBucketList;
    
    // ML Model prediction fields
    private Integer rank;
    private Double probability;
    private String confidence; // "High", "Medium", "Low"
    private String explanation;
    private Object shapDetails;
}