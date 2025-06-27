package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "action_event_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActionEventLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "total_events", nullable = false)
    private Integer totalEvents = 0;
    
    @Column(name = "last_processed")
    private LocalDateTime lastProcessed;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "log_id")
    private List<ActionEvent> actionEvents;
}