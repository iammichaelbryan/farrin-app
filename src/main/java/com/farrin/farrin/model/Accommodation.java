package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Set;

@Entity
@Table(name = "accommodations")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Accommodation extends Booking {
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(name = "check_in", nullable = false)
    private LocalDateTime checkIn;
    
    @Column(name = "check_out", nullable = false)
    private LocalDateTime checkOut;
    
    @Column(name = "price_per_night", precision = 10, scale = 2)
    private BigDecimal pricePerNight;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private CurrencyCode currency;
    
    @Column(length = 300)
    private String address;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal rating;
    
    @ElementCollection
    @CollectionTable(name = "accommodation_amenities",
                    joinColumns = @JoinColumn(name = "accommodation_id"))
    @Column(name = "amenity")
    private Set<String> amenities;
    
    @ElementCollection
    @CollectionTable(name = "accommodation_images",
                    joinColumns = @JoinColumn(name = "accommodation_id"))
    @Column(name = "image_url", length = 500)
    private Set<String> imageUrls;
    
    @Column(name = "available_rooms")
    private Integer availableRooms;
    
    @Column(name = "room_type", length = 50)
    private String roomType;
    
    @Column(name = "children_allowed", nullable = false)
    private Boolean childrenAllowed = true;
    
    public BigDecimal getTotalCost() {
        if (pricePerNight != null && checkIn != null && checkOut != null) {
            long nights = ChronoUnit.DAYS.between(checkIn.toLocalDate(), checkOut.toLocalDate());
            return pricePerNight.multiply(BigDecimal.valueOf(nights));
        }
        return BigDecimal.ZERO;
    }
}