package com.farrin.farrin.dto;

import com.farrin.farrin.model.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Integer recipientId;
    private NotificationType notifType;
    private String subject;
    private String message;
    private Integer priority;
}