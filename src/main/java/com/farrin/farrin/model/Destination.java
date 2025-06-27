package com.farrin.farrin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Destination {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "country_id", nullable = false)
    private Integer countryId;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Climate climate;
    
    @ElementCollection
    @CollectionTable(name = "destination_activities", 
                    joinColumns = @JoinColumn(name = "destination_id"))
    @Column(name = "activity")
    private Set<String> popularActivities;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "travel_advisory", columnDefinition = "TEXT")
    private String travelAdvisory;
    
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", insertable = false, updatable = false)
    private Country country;
    
    // NOTE: Removed visitedByUsers mapping since we now use TravelHistory association entity
    // Users who visited this destination can be accessed through TravelHistory entities
    
    @JsonIgnore
    @ManyToMany(mappedBy = "bucketList")
    private Set<User> bucketListUsers;
    
    @JsonIgnore
    @ManyToMany(mappedBy = "recommendations")
    private Set<User> recommendedToUsers;
}