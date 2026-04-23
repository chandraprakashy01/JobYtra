package com.placement.controller.dto;

import lombok.Data;
import java.util.List;

@Data
public class SignupRequestStudent {
    private String name;
    private String email;
    private String password;
    private String branch;
    private Float cgpa;
    private List<String> skills;
    private String batch;
    private String collegeId;
}
