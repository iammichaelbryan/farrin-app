package com.farrin.farrin.dto;

import com.farrin.farrin.model.CurrencyCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CurrencyRateDTO extends ExternalApiResponseDTO {
    private CurrencyCode baseCurrency;
    private CurrencyCode targetCurrency;
    private BigDecimal rate;
    private LocalDateTime lastUpdated;
}