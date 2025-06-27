package com.farrin.farrin.repository;

import com.farrin.farrin.model.Climate;
import com.farrin.farrin.model.Destination;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends IGenericRepository<Destination, Integer> {
    
    List<Destination> findByCountryId(Integer countryId);
    
    List<Destination> findByClimate(Climate climate);
    
    Optional<Destination> findByName(String name);
    
    @Query("SELECT d FROM Destination d WHERE d.name LIKE %:name%")
    List<Destination> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT d FROM Destination d WHERE d.countryId IN :countryIds")
    List<Destination> findByCountryIds(@Param("countryIds") List<Integer> countryIds);
}