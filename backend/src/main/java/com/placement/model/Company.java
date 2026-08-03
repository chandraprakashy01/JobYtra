package com.placement.model;

import lombok.Data;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Data
@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    
    @Column(unique = true)
    private String email;
    private String password;
    private String website;
    private String about;
    private Boolean isVerified = false;

    private String role = "ROLE_COMPANY";
}
