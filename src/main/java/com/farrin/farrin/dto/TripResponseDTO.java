package com.farrin.farrin.dto;

import com.farrin.farrin.model.TripStatus;
import com.farrin.farrin.model.TripType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponseDTO {
    private Integer id;
    private Integer ownerId;
    private Integer destinationId;
    private String destinationName;
    private TripType tripType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer durationDays;
    private TripStatus status;
    private Integer memberCount;
    private LocalDateTime createdAt;
}