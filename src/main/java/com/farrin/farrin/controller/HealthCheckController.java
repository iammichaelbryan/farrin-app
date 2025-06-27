package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.service.ApiHealthMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health")
@RequiredArgsConstructor
public class HealthCheckController {

    private final ApiHealthMonitoringService apiHealthMonitoringService;

    @GetMapping("/system")
    public ResponseEntity<Object> getSystemHealth() {
        try {
            var systemHealth = apiHealthMonitoringService.getSystemHealthStatus();
            return ResponseEntity.ok(systemHealth);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/api")
    public ResponseEntity<Object> getApiHealth() {
        try {
            var apiHealth = apiHealthMonitoringService.getApiHealthStatus();
            return ResponseEntity.ok(apiHealth);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<Object> checkSpecificProvider(@PathVariable Integer providerId) {
        try {
            var providerHealth = apiHealthMonitoringService.checkProviderStatus(providerId);
            return ResponseEntity.ok(providerHealth);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<Object> getHealthMetrics(@RequestParam(required = false) Integer providerId) {
        try {
            var metrics = apiHealthMonitoringService.getHealthMetrics(providerId);
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/check")
    public ResponseEntity<HTTPResponse> runHealthCheck(@RequestBody(required = false) Object checkRequest) {
        try {
            Boolean result = apiHealthMonitoringService.performHealthCheck();
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Health check completed successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Health check failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }
}