package com.farrin.farrin.repository;

import com.farrin.farrin.model.Country;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends IGenericRepository<Country, Integer> {
    
    Optional<Country> findByCountryCode(String countryCode);
    
    Optional<Country> findByName(String name);
    
    List<Country> findByContinentId(Integer continentId);
    
    List<Country> findByNameContainingIgnoreCase(String name);
}