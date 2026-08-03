package com.placement.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.util.List;

@Data
@Embeddable
public class Eligibility {
    private Float minCgpa;
    @ElementCollection
    private List<String> branches;
}
