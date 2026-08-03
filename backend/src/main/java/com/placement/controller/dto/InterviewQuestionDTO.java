package com.placement.controller.dto;

import java.util.List;

public class InterviewQuestionDTO {

    private String question;
    private String hint;
    private String expectedAnswer;
    private String followUp;
    private String difficulty;

    public InterviewQuestionDTO() {}

    public InterviewQuestionDTO(String question, String hint, String expectedAnswer, String followUp, String difficulty) {
        this.question = question;
        this.hint = hint;
        this.expectedAnswer = expectedAnswer;
        this.followUp = followUp;
        this.difficulty = difficulty;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getHint() { return hint; }
    public void setHint(String hint) { this.hint = hint; }

    public String getExpectedAnswer() { return expectedAnswer; }
    public void setExpectedAnswer(String expectedAnswer) { this.expectedAnswer = expectedAnswer; }

    public String getFollowUp() { return followUp; }
    public void setFollowUp(String followUp) { this.followUp = followUp; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
