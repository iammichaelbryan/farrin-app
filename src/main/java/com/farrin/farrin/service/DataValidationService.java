package com.farrin.farrin.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
@Slf4j
public class DataValidationService extends BaseService {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$"
    );

    public Boolean validateUserInput(Object input) {
        if (input == null) {
            log.warn("User input validation failed: input is null");
            return false;
        }
        logOperation("validateUserInput", input);
        return true;
    }

    public Boolean validateEmailFormat(String email) {
        if (email == null || email.trim().isEmpty()) {
            log.warn("Email validation failed: email is null or empty");
            return false;
        }
        
        Boolean isValid = EMAIL_PATTERN.matcher(email).matches();
        logOperation("validateEmailFormat", "Email: " + email + ", Valid: " + isValid);
        return isValid;
    }

    public Boolean validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            log.warn("Password validation failed: password is null or too short");
            return false;
        }
        
        // Simplified validation - just check length for now
        Boolean isValid = password.length() >= 8;
        logOperation("validatePasswordStrength", "Password strength valid: " + isValid);
        return isValid;
    }

    public Boolean validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            log.warn("Date range validation failed: one or both dates are null");
            return false;
        }
        
        Boolean isValid = startDate.isBefore(endDate);
        logOperation("validateDateRange", "Start: " + startDate + ", End: " + endDate + ", Valid: " + isValid);
        return isValid;
    }

    public Boolean validateBudgetRange(Integer lowerBudget, Integer upperBudget) {
        if (lowerBudget == null || upperBudget == null) {
            log.warn("Budget range validation failed: one or both budgets are null");
            return false;
        }
        
        if (lowerBudget < 0 || upperBudget < 0) {
            log.warn("Budget range validation failed: negative budget values");
            return false;
        }
        
        Boolean isValid = lowerBudget <= upperBudget;
        logOperation("validateBudgetRange", "Lower: " + lowerBudget + ", Upper: " + upperBudget + ", Valid: " + isValid);
        return isValid;
    }

    public String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        String sanitized = input.trim()
            .replaceAll("<script[^>]*>.*?</script>", "")
            .replaceAll("<[^>]+>", "")
            .replaceAll("[<>\"'&]", "");
            
        logOperation("sanitizeInput", "Original length: " + input.length() + ", Sanitized length: " + sanitized.length());
        return sanitized;
    }

    public Boolean validateApiResponse(Object response) {
        if (response == null) {
            log.warn("API response validation failed: response is null");
            return false;
        }
        logOperation("validateApiResponse", "Response type: " + response.getClass().getSimpleName());
        return true;
    }

    public Boolean validateBusinessRules(String ruleType, Object data) {
        if (ruleType == null || data == null) {
            log.warn("Business rule validation failed: ruleType or data is null");
            return false;
        }
        
        logOperation("validateBusinessRules", "Rule: " + ruleType + ", Data type: " + data.getClass().getSimpleName());
        
        switch (ruleType) {
            case "age":
                return validateAge(data);
            case "trip_duration":
                return validateTripDuration(data);
            case "future_date":
                return validateFutureDate(data);
            default:
                log.warn("Unknown business rule type: {}", ruleType);
                return false;
        }
    }
    
    private Boolean validateAge(Object data) {
        if (data instanceof LocalDate) {
            LocalDate birthDate = (LocalDate) data;
            LocalDate now = LocalDate.now();
            int age = now.getYear() - birthDate.getYear();
            
            if (birthDate.plusYears(age).isAfter(now)) {
                age--;
            }
            
            return age >= 13 && age <= 120;
        }
        return false;
    }
    
    private Boolean validateTripDuration(Object data) {
        if (data instanceof Integer) {
            Integer days = (Integer) data;
            return days > 0 && days <= 365;
        }
        return false;
    }
    
    private Boolean validateFutureDate(Object data) {
        if (data instanceof LocalDateTime) {
            LocalDateTime date = (LocalDateTime) data;
            return date.isAfter(LocalDateTime.now());
        }
        return false;
    }
}