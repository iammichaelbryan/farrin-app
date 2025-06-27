package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherInfo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "itinerary_id", nullable = false)
    private Integer itineraryId;
    
    @Column(nullable = false, length = 100)
    private String location;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal temperature;
    
    @Column(name = "weather_condition", length = 50)
    private String condition;
    
    @Column
    private Integer humidity;
    
    @Column(name = "wind_speed", precision = 5, scale = 2)
    private BigDecimal windSpeed;
    
    @Column(name = "precipitation_probability", precision = 5, scale = 2)
    private BigDecimal precipitationProbability;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private Season season;
    
    @Column(name = "uv_index")
    private Integer uvIndex;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", insertable = false, updatable = false)
    private Itinerary itinerary;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}