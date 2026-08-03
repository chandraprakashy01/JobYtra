package com.placement.controller.dto;

import java.util.List;

public class ResumeAnalysisDTO {

    private int atsScore;
    private List<String> detectedSkills;
    private List<String> missingKeywords;
    private List<String> strengths;
    private List<String> suggestions;
    private String summary;

    public ResumeAnalysisDTO() {}

    public ResumeAnalysisDTO(int atsScore, List<String> detectedSkills, List<String> missingKeywords,
                             List<String> strengths, List<String> suggestions, String summary) {
        this.atsScore = atsScore;
        this.detectedSkills = detectedSkills;
        this.missingKeywords = missingKeywords;
        this.strengths = strengths;
        this.suggestions = suggestions;
        this.summary = summary;
    }

    public int getAtsScore() { return atsScore; }
    public void setAtsScore(int atsScore) { this.atsScore = atsScore; }

    public List<String> getDetectedSkills() { return detectedSkills; }
    public void setDetectedSkills(List<String> detectedSkills) { this.detectedSkills = detectedSkills; }

    public List<String> getMissingKeywords() { return missingKeywords; }
    public void setMissingKeywords(List<String> missingKeywords) { this.missingKeywords = missingKeywords; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}
