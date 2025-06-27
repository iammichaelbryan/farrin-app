package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "api_health_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiHealthMetrics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "provider_id", nullable = false)
    private Integer providerId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApiHealthStatus status;
    
    @Column(name = "response_time", precision = 8, scale = 2)
    private BigDecimal responseTime;
    
    @Column(name = "error_rate", precision = 5, scale = 2)
    private BigDecimal errorRate;
    
    @Column(name = "last_checked", nullable = false)
    private LocalDateTime lastChecked;
    
    @Column(name = "uptime_percentage", precision = 5, scale = 2)
    private BigDecimal uptimePercentage;
    
    @Column(name = "consecutive_failures", nullable = false)
    private Integer consecutiveFailures = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", insertable = false, updatable = false)
    private ApiProvider provider;
}