package com.farrin.farrin.dto;

import com.farrin.farrin.model.Country;
import com.farrin.farrin.model.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateDTO {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private Gender gender;
    private LocalDate dob;
    private Set<Country> citizenships;
}