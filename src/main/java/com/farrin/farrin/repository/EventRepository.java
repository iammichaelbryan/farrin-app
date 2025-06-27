package com.farrin.farrin.repository;

import com.farrin.farrin.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByItineraryId(Integer itineraryId);
}