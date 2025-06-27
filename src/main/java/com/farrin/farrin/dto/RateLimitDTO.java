package com.farrin.farrin.dto;

import com.farrin.farrin.model.RateLimitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateLimitDTO {
    private RateLimitType limitType;
    private String identifier;
    private Integer requestsPerMinute;
    private Integer requestsPerHour;
    private Integer requestsPerDay;
}