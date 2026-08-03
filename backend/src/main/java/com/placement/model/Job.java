package com.placement.model;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Data
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;
    private String companyId;
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Embedded
    private Eligibility eligibility;
    
    private String salary;
    private String location;
    private String type; // "internship" | "full-time"
    private Date deadline;
    private Boolean isApproved = false;
    private Date postedAt = new Date();
}
