package com.placement.model;

import lombok.Data;

import java.util.List;

@Data
public class Eligibility {
    private Float minCgpa;
    private List<String> branches;
}
