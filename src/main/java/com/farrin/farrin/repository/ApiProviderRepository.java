package com.farrin.farrin.repository;

import com.farrin.farrin.model.ApiProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiProviderRepository extends JpaRepository<ApiProvider, Integer> {
}