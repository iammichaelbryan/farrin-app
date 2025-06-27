package com.farrin.farrin.repository;

import com.farrin.farrin.model.CurrencyRate;
import com.farrin.farrin.model.CurrencyCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurrencyRateRepository extends JpaRepository<CurrencyRate, Integer> {
    Optional<CurrencyRate> findByBaseCurrencyAndTargetCurrency(CurrencyCode baseCurrency, CurrencyCode targetCurrency);
}