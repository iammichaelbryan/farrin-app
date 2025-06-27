package com.farrin.farrin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationDTO {
    private Integer userId;
    private Integer tripId;
    private String name;
    private String providerName;
    private Integer cost;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private String address;
    private String roomType;
    private String confirmationCode;
    private String userNotes;
}