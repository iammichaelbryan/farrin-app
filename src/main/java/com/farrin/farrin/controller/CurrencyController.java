package com.farrin.farrin.controller;

import com.farrin.farrin.dto.*;
import com.farrin.farrin.model.CurrencyCode;
import com.farrin.farrin.service.CurrencyConversionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/currency")
@RequiredArgsConstructor
public class CurrencyController {

    private final CurrencyConversionService currencyConversionService;

    @GetMapping("/convert")
    public ResponseEntity<Object> convertCurrency(@RequestParam BigDecimal amount,
                                                 @RequestParam CurrencyCode fromCurrency,
                                                 @RequestParam CurrencyCode toCurrency) {
        try {
            var convertedAmount = currencyConversionService.convertCurrency(amount, fromCurrency, toCurrency);
            return ResponseEntity.ok(convertedAmount);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/rates")
    public ResponseEntity<Object> getCurrentRates(@RequestParam CurrencyCode baseCurrency,
                                                 @RequestParam CurrencyCode targetCurrency) {
        try {
            var rate = currencyConversionService.getCurrentRate(baseCurrency, targetCurrency);
            return ResponseEntity.ok(rate);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @PutMapping("/rates")
    public ResponseEntity<HTTPResponse> updateRates() {
        try {
            Boolean result = currencyConversionService.updateCurrencyRates();
            if (result) {
                return ResponseEntity.ok(HTTPResponse.builder()
                    .statusCode(200)
                    .body("Currency rates updated successfully")
                    .build());
            }
            return ResponseEntity.badRequest().body(HTTPResponse.builder()
                .statusCode(400)
                .errorMessage("Failed to update currency rates")
                .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/supported")
    public ResponseEntity<Object> getSupportedCurrencies() {
        try {
            var currencies = currencyConversionService.getSupportedCurrencies();
            return ResponseEntity.ok(currencies);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }

    @GetMapping("/fees")
    public ResponseEntity<Object> calculateConversionFee(@RequestParam BigDecimal amount,
                                                        @RequestParam CurrencyCode fromCurrency,
                                                        @RequestParam CurrencyCode toCurrency) {
        try {
            var fee = currencyConversionService.calculateConversionFee(amount, fromCurrency, toCurrency);
            return ResponseEntity.ok(fee);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(HTTPResponse.builder()
                .statusCode(500)
                .errorMessage("Internal server error")
                .build());
        }
    }
}