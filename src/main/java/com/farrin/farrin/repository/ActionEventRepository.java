package com.farrin.farrin.repository;

import com.farrin.farrin.model.ActionEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActionEventRepository extends JpaRepository<ActionEvent, Integer> {
}