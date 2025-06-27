package com.farrin.farrin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HTTPResponse {
    private Integer statusCode;
    private Map<String, String> headers;
    private String errorMessage;
    private LocalDateTime timestamp;
    private String body;
    
    public Boolean getSuccess() {
        return statusCode != null && statusCode >= 200 && statusCode < 300;
    }
}