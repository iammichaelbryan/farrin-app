package com.farrin.farrin.repository;

import com.farrin.farrin.model.TravelRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TravelRequirementRepository extends JpaRepository<TravelRequirement, Integer> {
    Optional<TravelRequirement> findByOriginCountryIdAndDestinationCountryId(Integer originCountryId, Integer destinationCountryId);
}