package com.farrin.farrin.service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class BaseService {

    protected Boolean validateInput() {
        return true;
    }

    protected void logOperation(String operation, Object data) {
        log.info("Executing operation: {} with data: {}", operation, data);
    }

    protected void handleServiceException(Exception e, String operation) {
        log.error("Service exception in operation: {} - {}", operation, e.getMessage(), e);
        throw new RuntimeException("Service operation failed: " + operation, e);
    }
}