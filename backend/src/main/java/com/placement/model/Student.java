package com.placement.model;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.List;

@Data
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    
    @Column(unique = true)
    private String email;
    private String password;
    private String branch; // CSE|IT|ECE|ME|CE
    private Float cgpa;
    @ElementCollection
    private List<String> skills;
    private String resumeUrl;
    private Boolean isApproved = false;
    private String batch;
    private String collegeId;

    // Role will just be useful for security mapping
    private String role = "ROLE_STUDENT";
}
