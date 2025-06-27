package com.farrin.farrin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelGoalDTO {
    private Integer userId;
    private String name;
    private String category;
    private String description;
    private LocalDateTime targetDate;
    private BigDecimal progress;
    private Boolean isCompleted;
}