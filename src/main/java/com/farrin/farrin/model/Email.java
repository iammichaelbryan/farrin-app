package com.farrin.farrin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "emails")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Email extends Notification {
    
    @Column(name = "email_to", nullable = false, length = 100)
    private String to;
    
    @Column(columnDefinition = "TEXT")
    private String body;
    
    @Column(name = "is_html", nullable = false)
    private Boolean isHtml = false;
    
    @ElementCollection
    @CollectionTable(name = "email_attachments",
                    joinColumns = @JoinColumn(name = "email_id"))
    @Column(name = "attachment_path", length = 500)
    private Set<String> attachments;
}