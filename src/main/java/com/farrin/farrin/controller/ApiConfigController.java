package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.service.ApiConfigurationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api-config")
@RequiredArgsConstructor
public class ApiConfigController {

    private final ApiConfigurationService apiConfigurationService;

    @GetMapping("/providers")
    public ResponseEntity<Object> getApiProviders() {
        try {
            var providers = apiConfigurationService.getApiProviders();
            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/providers")
    public ResponseEntity<HTTPResponse> addApiProvider(@RequestBody Object providerConfig) {
        try {
            Boolean result = apiConfigurationService.addApiProvider(providerConfig);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("API provider added successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to add API provider")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/providers/{providerId}")
    public ResponseEntity<HTTPResponse> updateApiProvider(@PathVariable Integer providerId,
                                                         @RequestBody Object providerConfig) {
        try {
            Boolean result = apiConfigurationService.updateApiProvider(providerId, providerConfig);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("API provider updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to update API provider")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @DeleteMapping("/providers/{providerId}")
    public ResponseEntity<HTTPResponse> removeApiProvider(@PathVariable Integer providerId) {
        try {
            Boolean result = apiConfigurationService.removeApiProvider(providerId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("API provider removed successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to remove API provider")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/providers/{providerId}/status")
    public ResponseEntity<Object> getProviderStatus(@PathVariable Integer providerId) {
        try {
            var status = apiConfigurationService.getProviderStatus(providerId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PostMapping("/providers/{providerId}/test")
    public ResponseEntity<HTTPResponse> testApiProvider(@PathVariable Integer providerId) {
        try {
            Boolean result = apiConfigurationService.testProvider(providerId);
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("API provider test successful")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("API provider test failed")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }
}