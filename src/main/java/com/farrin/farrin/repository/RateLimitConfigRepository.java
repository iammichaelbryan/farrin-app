package com.farrin.farrin.repository;

import com.farrin.farrin.model.RateLimitConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RateLimitConfigRepository extends JpaRepository<RateLimitConfig, Integer> {
}