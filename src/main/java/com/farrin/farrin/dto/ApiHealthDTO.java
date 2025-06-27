package com.farrin.farrin.dto;

import com.farrin.farrin.model.ApiHealthStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiHealthDTO {
    private Integer providerId;
    private ApiHealthStatus status;
    private BigDecimal responseTime;
    private BigDecimal errorRate;
    private BigDecimal uptimePercentage;
}