package com.farrin.farrin.repository;

import com.farrin.farrin.model.Trip;
import com.farrin.farrin.model.TripStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends IGenericRepository<Trip, Integer> {
    
    List<Trip> findByOwnerId(Integer ownerId);
    
    List<Trip> findByOwnerIdAndStatus(Integer ownerId, TripStatus status);
    
    List<Trip> findByDestinationId(Integer destinationId);
    
    @Query("SELECT t FROM Trip t WHERE t.ownerId = :userId AND t.startDate > :currentDate")
    List<Trip> findUpcomingTripsByUser(@Param("userId") Integer userId, @Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT t FROM Trip t WHERE t.ownerId = :userId AND t.startDate <= :currentDate AND t.status = :status")
    List<Trip> findPastTripsByUser(@Param("userId") Integer userId, @Param("currentDate") LocalDateTime currentDate, @Param("status") TripStatus status);
}