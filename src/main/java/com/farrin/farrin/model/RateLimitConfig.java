package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rate_limit_configs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RateLimitConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "limit_type", nullable = false, length = 20)
    private RateLimitType limitType;
    
    @Column(nullable = false, length = 100)
    private String identifier;
    
    @Column(name = "requests_per_minute")
    private Integer requestsPerMinute;
    
    @Column(name = "requests_per_hour")
    private Integer requestsPerHour;
    
    @Column(name = "requests_per_day")
    private Integer requestsPerDay;
    
    @Column(name = "current_count", nullable = false)
    private Integer currentCount = 0;
    
    @Column(name = "reset_time")
    private LocalDateTime resetTime;
    
    @Column(name = "provider_id")
    private Integer providerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", insertable = false, updatable = false)
    private ApiProvider provider;
}