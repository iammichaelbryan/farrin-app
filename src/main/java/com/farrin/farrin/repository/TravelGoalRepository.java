package com.farrin.farrin.repository;

import com.farrin.farrin.model.TravelGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelGoalRepository extends JpaRepository<TravelGoal, Integer> {
}