package com.farrin.farrin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteAccountDTO {
    @NotNull(message = "User ID is required")
    private Integer userId;
    
    @NotBlank(message = "Current password is required")
    private String currentPassword;
}