package com.farrin.farrin.service;

import com.farrin.farrin.model.*;
import com.farrin.farrin.repository.CurrencyRateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CurrencyConversionService extends BaseService {

    private final CurrencyRateRepository currencyRateRepository;

    public BigDecimal convertCurrency(BigDecimal amount, CurrencyCode fromCurrency, CurrencyCode toCurrency) {
        logOperation("convertCurrency", fromCurrency + " -> " + toCurrency);
        BigDecimal rate = getCurrentRate(fromCurrency, toCurrency);
        return amount.multiply(rate);
    }

    public BigDecimal getCurrentRate(CurrencyCode baseCurrency, CurrencyCode targetCurrency) {
        logOperation("getCurrentRate", baseCurrency + " -> " + targetCurrency);
        return currencyRateRepository.findByBaseCurrencyAndTargetCurrency(baseCurrency, targetCurrency)
            .map(CurrencyRate::getRate)
            .orElse(BigDecimal.ONE);
    }

    public Boolean updateCurrencyRates() {
        logOperation("updateCurrencyRates", "all");
        return true;
    }

    public CurrencyRate getCachedRate(CurrencyCode baseCurrency, CurrencyCode targetCurrency) {
        logOperation("getCachedRate", baseCurrency + " -> " + targetCurrency);
        return currencyRateRepository.findByBaseCurrencyAndTargetCurrency(baseCurrency, targetCurrency)
            .orElse(null);
    }

    public Boolean isRateValid(CurrencyRate rate) {
        logOperation("isRateValid", rate.getId());
        return rate.getValidUntil() == null || rate.getValidUntil().isAfter(java.time.LocalDateTime.now());
    }

    public Set<CurrencyCode> getSupportedCurrencies() {
        logOperation("getSupportedCurrencies", "all");
        return Set.of(CurrencyCode.values());
    }

    public BigDecimal calculateConversionFee(BigDecimal amount, CurrencyCode fromCurrency, CurrencyCode toCurrency) {
        logOperation("calculateConversionFee", fromCurrency + " -> " + toCurrency);
        return amount.multiply(BigDecimal.valueOf(0.01)); // 1% fee
    }
}