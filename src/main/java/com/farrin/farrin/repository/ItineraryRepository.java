package com.farrin.farrin.repository;

import com.farrin.farrin.model.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Integer> {
    Optional<Itinerary> findByTripId(Integer tripId);
}