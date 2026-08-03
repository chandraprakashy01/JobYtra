package com.placement.model;

import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Data
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String studentId;
    private String jobId;
    private String status; // "applied" | "shortlisted" | "selected" | "rejected"
    private Date appliedAt = new Date();
    
    // For Interview Scheduling
    private Date interviewDate;
}
