package com.farrin.farrin.repository;

import com.farrin.farrin.model.ApiHealthMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApiHealthMetricsRepository extends JpaRepository<ApiHealthMetrics, Integer> {
    Optional<ApiHealthMetrics> findByProviderId(Integer providerId);
}