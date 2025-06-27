package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Flight extends Booking {
    
    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private FlightClassification classification;
    
    @Column(nullable = false)
    private LocalDateTime departure;
    
    @Column(nullable = false)
    private LocalDateTime arrival;
    
    @Column(name = "flight_number", length = 20)
    private String flightNumber;
    
    @Column(name = "departure_location", length = 100)
    private String departureLocation;
    
    @Column(name = "arrival_location", length = 100)
    private String arrivalLocation;
    
    @Column
    private Integer duration;
    
    @Column(name = "available_seats")
    private Integer availableSeats;
}