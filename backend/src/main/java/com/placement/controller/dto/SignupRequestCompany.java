package com.placement.controller.dto;

import lombok.Data;

@Data
public class SignupRequestCompany {
    private String name;
    private String email;
    private String password;
    private String website;
    private String about;
}
