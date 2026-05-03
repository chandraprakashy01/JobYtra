package com.placement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String name;
    
    @Indexed(unique = true)
    private String email;
    private String password;
    private String branch; // CSE|IT|ECE|ME|CE
    private Float cgpa;
    private List<String> skills;
    private String resumeUrl;
    private Boolean isApproved = false;
    private String batch;
    private String collegeId;

    // Role will just be useful for security mapping
    private String role = "ROLE_STUDENT";
}
