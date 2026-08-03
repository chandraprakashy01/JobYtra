package com.placement.service;

import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.controller.dto.AICandidateMatchDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AICandidateMatchDTO evaluateCandidate(Job job, Student student, Boolean hasApplied, String applicationId) {
        String apiKey = geminiApiKey;
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = System.getenv("GEMINI_API_KEY");
        }

        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("your_gemini_api_key")) {
            return fallbackMatching(job, student, hasApplied, applicationId, "Local Match (No API Key set)");
        }

        try {
            String prompt = String.format(
                "You are an expert HR recruiter matching college students to job postings.\n" +
                "Evaluate the suitability of the candidate for this job position based on their profile.\n\n" +
                "JOB DETAILS:\n" +
                "Title: %s\n" +
                "Description: %s\n" +
                "Required Branches: %s\n" +
                "Min CGPA: %s\n\n" +
                "CANDIDATE DETAILS:\n" +
                "Name: %s\n" +
                "Branch: %s\n" +
                "CGPA: %s\n" +
                "Skills: %s\n\n" +
                "Analyze their fit carefully. Provide a percentage score (integer between 0 and 100) representing how well they match, and a short 1-2 sentence justification explaining why they got this score.\n" +
                "Respond ONLY with a JSON object in this format:\n" +
                "{\"score\": 85, \"reason\": \"Detailed reason here.\"}",
                job.getTitle(),
                job.getDescription(),
                job.getEligibility() != null && job.getEligibility().getBranches() != null ? String.join(", ", job.getEligibility().getBranches()) : "Any",
                job.getEligibility() != null && job.getEligibility().getMinCgpa() != null ? job.getEligibility().getMinCgpa() : "None",
                student.getName(),
                student.getBranch(),
                student.getCgpa(),
                student.getSkills() != null ? String.join(", ", student.getSkills()) : "None"
            );

            // Construct Gemini request body
            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> parts = Map.of("parts", List.of(textPart));
            Map<String, Object> contents = Map.of("contents", List.of(parts));
            String requestBody = objectMapper.writeValueAsString(contents);

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey.trim();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                String text = root.path("candidates")
                        .path(0)
                        .path("content")
                        .path("parts")
                        .path(0)
                        .path("text")
                        .asText();

                // Parse the score and reason from the JSON text response
                return parseGeminiResponse(text, student, hasApplied, applicationId);
            } else {
                System.err.println("Gemini API error: Status code " + response.statusCode() + " - " + response.body());
                return fallbackMatching(job, student, hasApplied, applicationId, "Local Match (Gemini Error: " + response.statusCode() + ")");
            }
        } catch (Exception e) {
            System.err.println("Failed to call Gemini API: " + e.getMessage());
            return fallbackMatching(job, student, hasApplied, applicationId, "Local Match (Exception occurred)");
        }
    }

    private AICandidateMatchDTO parseGeminiResponse(String rawText, Student student, Boolean hasApplied, String applicationId) {
        try {
            // Find JSON structure in case Gemini wrapped it in markdown
            Pattern jsonPattern = Pattern.compile("\\{[^{}]*\\}");
            Matcher matcher = jsonPattern.matcher(rawText.replace("\n", " "));
            if (matcher.find()) {
                String jsonStr = matcher.group();
                JsonNode node = objectMapper.readTree(jsonStr);
                int score = node.path("score").asInt(50);
                String reason = node.path("reason").asText("Matched candidate based on AI evaluation.");
                return new AICandidateMatchDTO(student, score, reason, hasApplied, applicationId);
            }
        } catch (Exception e) {
            System.err.println("Failed to parse Gemini response text: " + rawText);
        }
        // Fallback score if JSON parsing failed but we got text
        String cleanedText = rawText.replaceAll("```json|```", "").trim();
        return new AICandidateMatchDTO(student, 70, cleanedText.substring(0, Math.min(cleanedText.length(), 200)), hasApplied, applicationId);
    }

    private AICandidateMatchDTO fallbackMatching(Job job, Student student, Boolean hasApplied, String applicationId, String prefix) {
        int score = 40;
        List<String> matchedSkills = new ArrayList<>();

        if (student.getCgpa() != null) {
            score += Math.round(student.getCgpa() * 4); // up to 40 points
        }

        if (job.getEligibility() != null && job.getEligibility().getBranches() != null) {
            if (job.getEligibility().getBranches().contains(student.getBranch())) {
                score += 10;
            }
        }

        if (student.getSkills() != null && job.getDescription() != null) {
            String descLower = job.getDescription().toLowerCase();
            for (String skill : student.getSkills()) {
                if (descLower.contains(skill.toLowerCase())) {
                    matchedSkills.add(skill);
                    score += 5;
                }
            }
        }

        score = Math.min(100, Math.max(0, score));

        String justification = String.format(
            "%s: Candidate from branch %s has %s CGPA. Matches skills: %s.",
            prefix,
            student.getBranch(),
            student.getCgpa() != null ? student.getCgpa() : "N/A",
            matchedSkills.isEmpty() ? "None specifically matching" : String.join(", ", matchedSkills)
        );

        return new AICandidateMatchDTO(student, score, justification, hasApplied, applicationId);
    }
}
