package com.placement.controller.dto;

import com.placement.model.Eligibility;
import lombok.Data;

import java.util.Date;

@Data
public class JobWithCompanyDTO {
    // Job fields
    private String id;
    private String title;
    private String companyId;
    private String description;
    private Eligibility eligibility;
    private String salary;
    private String location;
    private String type;
    private Date deadline;
    private Boolean isApproved;
    private Date postedAt;

    // Company fields
    private String companyName;
    private String companyWebsite;
    private String companyAbout;
}
