package com.farrin.farrin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface IGenericRepository<T, ID> extends JpaRepository<T, ID> {
    
    List<T> findAll();
    
    Optional<T> findById(ID id);
    
    <S extends T> S save(S entity);
    
    void deleteById(ID id);
    
    boolean existsById(ID id);
    
    long count();
}