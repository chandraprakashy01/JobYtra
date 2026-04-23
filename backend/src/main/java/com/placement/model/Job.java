package com.placement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "jobs")
public class Job {
    @Id
    private String id;
    private String title;
    private String companyId;
    private String description;
    
    private Eligibility eligibility;
    
    private String salary;
    private String location;
    private String type; // "internship" | "full-time"
    private Date deadline;
    private Boolean isApproved = false;
    private Date postedAt = new Date();
}
