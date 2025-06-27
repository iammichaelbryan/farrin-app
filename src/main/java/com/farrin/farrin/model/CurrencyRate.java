package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "currency_rates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrencyRate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "base_currency", nullable = false, length = 10)
    private CurrencyCode baseCurrency;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "target_currency", nullable = false, length = 10)
    private CurrencyCode targetCurrency;
    
    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal rate;
    
    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;
    
    @Column(length = 100)
    private String source;
    
    @Column(name = "valid_until")
    private LocalDateTime validUntil;
    
    @Column(name = "provider_id")
    private Integer providerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", insertable = false, updatable = false)
    private ApiProvider provider;
}