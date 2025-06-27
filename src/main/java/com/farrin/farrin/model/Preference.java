package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "preferences")
@Data
@EqualsAndHashCode(exclude = {"user"})
@NoArgsConstructor
@AllArgsConstructor
public class Preference {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "accommodation_budget")
    private Integer accommodationBudget;
    
    @Column(name = "transportation_budget")
    private Integer transportationBudget;
    
    @Column(name = "total_budget")
    private Integer totalBudget;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "primary_interest")
    private Interest primaryInterest;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "primary_travel_style")
    private TravelStyle primaryTravelStyle;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_climate")
    private Climate preferredClimate;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_travel_season")
    private Season preferredTravelSeason;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_accommodation")
    private PreferredAccommodationType preferredAccommodation;
    
    @Column(name = "avg_travel_duration")
    private Integer avgTravelDuration;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transport_preference")
    private TransportType transportPreference;
    
    @Column(name = "data_sharing", nullable = false)
    private Boolean dataSharing = false;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnore
    private User user;
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}