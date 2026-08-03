package com.placement.controller.dto;

import java.util.List;

public class ResumeJobMatchDTO {

    private int matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> suggestions;
    private List<String> learningRoadmap;

    public ResumeJobMatchDTO() {}

    public ResumeJobMatchDTO(int matchScore, List<String> matchedSkills, List<String> missingSkills,
                             List<String> suggestions, List<String> learningRoadmap) {
        this.matchScore = matchScore;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.suggestions = suggestions;
        this.learningRoadmap = learningRoadmap;
    }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }

    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public List<String> getLearningRoadmap() { return learningRoadmap; }
    public void setLearningRoadmap(List<String> learningRoadmap) { this.learningRoadmap = learningRoadmap; }
}
