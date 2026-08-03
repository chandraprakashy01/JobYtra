package com.placement.controller.dto;

public class CoverLetterDTO {

    private String coverLetter;
    private String tone;
    private String companyName;

    public CoverLetterDTO() {}

    public CoverLetterDTO(String coverLetter, String tone, String companyName) {
        this.coverLetter = coverLetter;
        this.tone = tone;
        this.companyName = companyName;
    }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
}
