package com.farrin.farrin.repository;

import com.farrin.farrin.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByItineraryId(Integer itineraryId);
}