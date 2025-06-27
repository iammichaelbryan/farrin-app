package com.farrin.farrin.dto;

import com.farrin.farrin.model.Gender;
import com.farrin.farrin.model.Country;
import com.farrin.farrin.model.Destination;
import com.farrin.farrin.model.Preference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private Gender gender;
    private LocalDate dob;
    private Integer age;
    private Boolean isVerified;
    private Integer loginCount;
    private LocalDateTime createdAt;
    private Set<Country> citizenships;
    private Preference preferences;
    private Set<Destination> travelHistory;
    private Set<Destination> bucketList;
}