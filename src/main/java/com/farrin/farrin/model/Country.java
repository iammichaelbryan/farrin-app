package com.farrin.farrin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "countries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Country {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(name = "country_code", nullable = false, length = 3)
    private String countryCode;
    
    @Column(name = "continent_id", nullable = false)
    private Integer continentId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "continent_id", insertable = false, updatable = false)
    @JsonIgnore
    private Continent continent;
    
    @OneToMany(mappedBy = "country", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Destination> destinations;
    
    @ManyToMany(mappedBy = "citizenships")
    @JsonIgnore
    private Set<User> residents;
}