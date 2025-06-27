package com.farrin.farrin.dto;

import com.farrin.farrin.model.TripType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripCreationDTO {
    private Integer userId;
    private Integer destinationId;
    private TripType tripType;
    private LocalDateTime startDate;
    private Integer durationDays;
    private Set<String> inviteeEmails;
    private Integer adults;
    private Integer children;
}