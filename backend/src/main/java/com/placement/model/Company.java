package com.placement.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "companies")
public class Company {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String website;
    private String about;
    private Boolean isVerified = false;

    private String role = "ROLE_COMPANY";
}
