package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "api_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiProvider {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "data_provided", length = 30)
    private APIData dataProvided;
    
    @Column(name = "base_url", length = 500)
    private String baseUrl;
    
    @Column(name = "api_key", length = 255)
    private String apiKey;
    
    @Column(name = "cost_per_request", precision = 10, scale = 4)
    private BigDecimal costPerRequest;
    
    @Column(name = "last_health_check")
    private LocalDateTime lastHealthCheck;
    
    @Column(name = "response_time_avg", precision = 8, scale = 2)
    private BigDecimal responseTimeAvg;
    
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApiHealthMetrics> healthMetrics;
    
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RateLimitConfig> rateLimitConfigs;
    
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CurrencyRate> currencyRates;
}