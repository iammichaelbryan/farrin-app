package com.farrin.farrin.repository;

import com.farrin.farrin.model.TravelHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelHistoryRepository extends JpaRepository<TravelHistory, Integer> {
    
    List<TravelHistory> findByUserId(Integer userId);
    
    List<TravelHistory> findByDestinationId(Integer destinationId);
    
    @Query("SELECT th FROM TravelHistory th WHERE th.userId = :userId AND th.id = :historyId")
    Optional<TravelHistory> findByUserIdAndId(@Param("userId") Integer userId, @Param("historyId") Integer historyId);
    
    @Query("SELECT AVG(th.rating) FROM TravelHistory th WHERE th.destinationId = :destinationId AND th.rating IS NOT NULL")
    Double findAverageRatingByDestinationId(@Param("destinationId") Integer destinationId);
    
    void deleteByUserIdAndId(Integer userId, Integer historyId);
}