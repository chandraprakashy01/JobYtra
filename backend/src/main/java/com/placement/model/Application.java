package com.placement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "applications")
public class Application {
    @Id
    private String id;
    private String studentId;
    private String jobId;
    private String status; // "applied" | "shortlisted" | "selected" | "rejected"
    private Date appliedAt = new Date();
    
    // For Interview Scheduling
    private Date interviewDate;
}
