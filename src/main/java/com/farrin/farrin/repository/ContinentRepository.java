package com.farrin.farrin.repository;

import com.farrin.farrin.model.Continent;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContinentRepository extends IGenericRepository<Continent, Integer> {
    
    Optional<Continent> findByName(String name);
}