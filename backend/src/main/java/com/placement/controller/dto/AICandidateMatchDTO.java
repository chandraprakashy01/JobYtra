package com.placement.controller.dto;

import com.placement.model.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AICandidateMatchDTO {
    private Student student;
    private Integer matchScore;
    private String justification;
    private Boolean hasApplied;
    private String applicationId;
}
