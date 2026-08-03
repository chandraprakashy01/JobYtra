package com.placement.controller.dto;

import com.placement.model.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AICandidateMatchDTO {
    private Student student;
    private Integer matchScore;
    private String justification;
    private Boolean hasApplied;
    private String applicationId;

    public AICandidateMatchDTO() {}

    public AICandidateMatchDTO(Student student, Integer matchScore, String justification, Boolean hasApplied, String applicationId) {
        this.student = student;
        this.matchScore = matchScore;
        this.justification = justification;
        this.hasApplied = hasApplied;
        this.applicationId = applicationId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }

    public String getJustification() {
        return justification;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }

    public Boolean getHasApplied() {
        return hasApplied;
    }

    public void setHasApplied(Boolean hasApplied) {
        this.hasApplied = hasApplied;
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }
}
