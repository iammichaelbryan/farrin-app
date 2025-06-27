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
public class HTTPRequest {
    private String method;
    private String endpoint;
    private Map<String, String> headers;
    private LocalDateTime timestamp;
    private String body;
    private Map<String, String> parameters;
}