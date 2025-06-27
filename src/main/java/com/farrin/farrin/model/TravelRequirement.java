package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "travel_requirements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelRequirement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "origin_country_id", nullable = false)
    private Integer originCountryId;
    
    @Column(name = "destination_country_id", nullable = false)
    private Integer destinationCountryId;
    
    @Column(name = "visa_required", nullable = false)
    private Boolean visaRequired = false;
    
    @Column(name = "visa_type", length = 50)
    private String visaType;
    
    @ElementCollection
    @CollectionTable(name = "travel_requirement_documents",
                    joinColumns = @JoinColumn(name = "travel_requirement_id"))
    @Column(name = "document")
    private Set<String> requiredDocuments;
    
    @ElementCollection
    @CollectionTable(name = "travel_requirement_vaccinations",
                    joinColumns = @JoinColumn(name = "travel_requirement_id"))
    @Column(name = "vaccination")
    private Set<String> vaccinations;
    
    @Column(name = "min_passport_validity")
    private Integer minPassportValidity;
    
    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_country_id", insertable = false, updatable = false)
    private Country sourceCountry;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_country_id", insertable = false, updatable = false)
    private Country destCountry;
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
    }
}