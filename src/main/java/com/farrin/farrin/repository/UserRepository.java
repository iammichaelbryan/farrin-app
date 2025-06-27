package com.farrin.farrin.repository;

import com.farrin.farrin.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends IGenericRepository<User, Integer> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isVerified = true")
    Optional<User> findVerifiedUserByEmail(@Param("email") String email);


    @Query("SELECT u FROM User u WHERE u.loggedIn = true")
    java.util.List<User> findLoggedInUsers();
    
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN FETCH u.preferences " +
           "LEFT JOIN FETCH u.citizenships " +
           "WHERE u.id = :id")
    Optional<User> findByIdWithBasicRelations(@Param("id") Integer id);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.travelHistoryEntries WHERE u.id = :id")
    Optional<User> findByIdWithTravelHistory(@Param("id") Integer id);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.bucketList WHERE u.id = :id")
    Optional<User> findByIdWithBucketList(@Param("id") Integer id);
}