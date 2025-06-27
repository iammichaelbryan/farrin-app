package com.farrin.farrin.dto;

import com.farrin.farrin.model.EventContext;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionEventDTO {
    private Integer id;
    private Integer userId;
    private EventContext event;
    private LocalDateTime timestamp;
}