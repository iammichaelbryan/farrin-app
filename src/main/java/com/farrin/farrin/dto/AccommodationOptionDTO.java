package com.farrin.farrin.dto;

import com.farrin.farrin.model.CurrencyCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AccommodationOptionDTO extends ExternalApiResponseDTO {
    private String name;
    private String location;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private BigDecimal pricePerNight;
    private CurrencyCode currency;
    private BigDecimal rating;
    private Set<String> amenities;
    private Set<String> imageUrls;
    private Integer availableRooms;
}