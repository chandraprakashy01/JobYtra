package com.placement.service;

import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.controller.dto.AICandidateMatchDTO;
import com.placement.controller.dto.ResumeAnalysisDTO;
import com.placement.controller.dto.ResumeJobMatchDTO;
import com.placement.controller.dto.CoverLetterDTO;
import com.placement.controller.dto.InterviewQuestionDTO;
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
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ─── Shared: Gemini API call ──────────────────────────────────────────────

    private String callGemini(String prompt) throws Exception {
        String apiKey = resolveApiKey();
        if (apiKey == null) throw new IllegalStateException("No Gemini API key configured");

        Map<String, Object> textPart = Map.of("text", sanitizePrompt(prompt));
        Map<String, Object> parts = Map.of("parts", List.of(textPart));
        Map<String, Object> contents = Map.of("contents", List.of(parts));
        String requestBody = objectMapper.writeValueAsString(contents);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .timeout(Duration.ofSeconds(30))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        return root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
    }

    private String resolveApiKey() {
        String key = (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) ? geminiApiKey : System.getenv("GEMINI_API_KEY");
        if (key == null || key.trim().isEmpty() || key.contains("your_gemini_api_key")) return null;
        return key.trim();
    }

    private String sanitizePrompt(String input) {
        if (input == null) return "";
        String trimmed = input.length() > 25000 ? input.substring(0, 25000) : input;
        return trimmed.replace("```", "").replace("${", "\\${");
    }

    private String extractJson(String rawText) {
        Pattern objPattern = Pattern.compile("\\{[\\s\\S]*\\}");
        Matcher objMatcher = objPattern.matcher(rawText);
        if (objMatcher.find()) return objMatcher.group();
        Pattern arrPattern = Pattern.compile("\\[[\\s\\S]*\\]");
        Matcher arrMatcher = arrPattern.matcher(rawText);
        if (arrMatcher.find()) return arrMatcher.group();
        return rawText.replaceAll("```json|```", "").trim();
    }

    private List<String> jsonArrayToList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            node.forEach(n -> list.add(n.asText()));
        }
        return list;
    }

    // ─── Phase 1: Resume Analyzer ────────────────────────────────────────────

    public ResumeAnalysisDTO analyzeResume(String resumeText) {
        try {
            if (resolveApiKey() == null) return fallbackResumeAnalysis(resumeText);

            String prompt =
                "You are an expert ATS (Applicant Tracking System) and career coach.\n" +
                "Analyze the following resume and return a structured evaluation.\n\n" +
                "RESUME TEXT:\n" + resumeText + "\n\n" +
                "Respond ONLY with a JSON object in this EXACT format (no markdown, no explanation):\n" +
                "{\"atsScore\": 78, \"detectedSkills\": [\"Java\", \"Spring Boot\"], " +
                "\"missingKeywords\": [\"Docker\", \"Kubernetes\"], " +
                "\"strengths\": [\"Strong project experience\"], " +
                "\"suggestions\": [\"Add quantified achievements\"], " +
                "\"summary\": \"A solid entry-level resume.\"}";

            String raw = callGemini(prompt);
            JsonNode node = objectMapper.readTree(extractJson(raw));

            return new ResumeAnalysisDTO(
                node.path("atsScore").asInt(60),
                jsonArrayToList(node.path("detectedSkills")),
                jsonArrayToList(node.path("missingKeywords")),
                jsonArrayToList(node.path("strengths")),
                jsonArrayToList(node.path("suggestions")),
                node.path("summary").asText("Resume analyzed successfully.")
            );
        } catch (Exception e) {
            System.err.println("analyzeResume failed: " + e.getMessage());
            return fallbackResumeAnalysis(resumeText);
        }
    }

    private ResumeAnalysisDTO fallbackResumeAnalysis(String resumeText) {
        String lower = resumeText.toLowerCase();
        List<String> techSkills = Arrays.asList("java","python","react","node","sql","spring","javascript",
                "typescript","docker","kubernetes","git","aws","linux","html","css","mongodb");
        List<String> detected = techSkills.stream().filter(lower::contains).collect(Collectors.toList());
        List<String> missing = techSkills.stream().filter(s -> !lower.contains(s)).limit(5).collect(Collectors.toList());
        int score = Math.min(95, 40 + (detected.size() * 5));
        return new ResumeAnalysisDTO(score, detected, missing,
                List.of("Technical skills detected", "Resume text successfully parsed"),
                List.of("Add quantified achievements", "Include links to projects", "Use industry keywords"),
                "Resume parsed locally. Detected " + detected.size() + " known skills.");
    }

    // ─── Phase 2: Resume vs Job Match ────────────────────────────────────────

    public ResumeJobMatchDTO matchResumeToJob(String resumeText, String jobDescription) {
        try {
            if (resolveApiKey() == null) return fallbackJobMatch(resumeText, jobDescription);

            String prompt =
                "You are an expert recruiter. Analyze how well the resume matches the job description.\n\n" +
                "RESUME:\n" + resumeText + "\n\nJOB DESCRIPTION:\n" + jobDescription + "\n\n" +
                "Respond ONLY with JSON (no markdown):\n" +
                "{\"matchScore\": 72, \"matchedSkills\": [\"Java\"], \"missingSkills\": [\"Docker\"], " +
                "\"suggestions\": [\"Highlight backend experience\"], " +
                "\"learningRoadmap\": [\"Learn Docker (1 week)\", \"Build REST API project\"]}";

            String raw = callGemini(prompt);
            JsonNode node = objectMapper.readTree(extractJson(raw));

            return new ResumeJobMatchDTO(
                node.path("matchScore").asInt(50),
                jsonArrayToList(node.path("matchedSkills")),
                jsonArrayToList(node.path("missingSkills")),
                jsonArrayToList(node.path("suggestions")),
                jsonArrayToList(node.path("learningRoadmap"))
            );
        } catch (Exception e) {
            System.err.println("matchResumeToJob failed: " + e.getMessage());
            return fallbackJobMatch(resumeText, jobDescription);
        }
    }

    private ResumeJobMatchDTO fallbackJobMatch(String resumeText, String jobDescription) {
        String resumeLower = resumeText.toLowerCase();
        String jobLower = jobDescription.toLowerCase();
        List<String> techSkills = Arrays.asList("java","python","react","spring","sql","docker","kubernetes",
                "javascript","typescript","node","aws","git","rest","graphql","mongodb","redis");
        List<String> matched = techSkills.stream().filter(s -> resumeLower.contains(s) && jobLower.contains(s)).collect(Collectors.toList());
        List<String> missing = techSkills.stream().filter(s -> jobLower.contains(s) && !resumeLower.contains(s)).collect(Collectors.toList());
        int score = (int) Math.min(95, 40 + (matched.size() * 8.0));
        return new ResumeJobMatchDTO(score, matched, missing,
                List.of("Tailor your resume to the job description", "Highlight relevant projects"),
                List.of("Build projects using missing skills", "Complete online courses for gap areas"));
    }

    // ─── Phase 3: Cover Letter Generator ─────────────────────────────────────

    public CoverLetterDTO generateCoverLetter(String resumeText, String companyName, String jobDescription, String tone) {
        try {
            if (resolveApiKey() == null) return fallbackCoverLetter(companyName, tone);

            String safeResume = resumeText.length() > 3000 ? resumeText.substring(0, 3000) : resumeText;
            String safeJob = jobDescription.length() > 2000 ? jobDescription.substring(0, 2000) : jobDescription;

            String prompt =
                "You are a professional writer. Generate a personalized cover letter.\n\n" +
                "RESUME: " + safeResume + "\n\nCOMPANY: " + companyName +
                "\nJOB DESCRIPTION: " + safeJob + "\nTONE: " + tone + "\n\n" +
                "Write a 3-paragraph cover letter. Respond ONLY with JSON:\n" +
                "{\"coverLetter\": \"Dear Hiring Manager,\\n\\n[paragraph 1]\\n\\n[paragraph 2]\\n\\n[paragraph 3]\\n\\nSincerely,\\n[Name]\"}";

            String raw = callGemini(prompt);
            JsonNode node = objectMapper.readTree(extractJson(raw));
            String letter = node.path("coverLetter").asText();
            if (letter.isEmpty()) letter = raw.replaceAll("```json|```", "").trim();
            return new CoverLetterDTO(letter, tone, companyName);
        } catch (Exception e) {
            System.err.println("generateCoverLetter failed: " + e.getMessage());
            return fallbackCoverLetter(companyName, tone);
        }
    }

    private CoverLetterDTO fallbackCoverLetter(String companyName, String tone) {
        String letter =
            "Dear Hiring Manager,\n\n" +
            "I am writing to express my strong interest in the open position at " + companyName + ". " +
            "With my academic background in engineering and hands-on project experience, I am confident " +
            "in my ability to contribute meaningfully to your team from day one.\n\n" +
            "Throughout my studies, I have developed strong technical skills and a passion for problem-solving. " +
            "I am eager to bring my dedication, adaptability, and collaborative mindset to " + companyName + ".\n\n" +
            "I would welcome the opportunity to discuss how my background aligns with your needs. " +
            "Thank you for considering my application.\n\nSincerely,\n[Your Name]";
        return new CoverLetterDTO(letter, tone, companyName);
    }

    // ─── Phase 5: Interview Coach ─────────────────────────────────────────────

    public List<InterviewQuestionDTO> generateInterviewQuestions(String role, List<String> skills, String experience, String difficulty) {
        try {
            if (resolveApiKey() == null) return fallbackInterviewQuestions(role, difficulty);

            String skillsStr = skills != null ? String.join(", ", skills) : "general software engineering";
            String prompt =
                "You are an expert technical interviewer. Generate 5 interview questions.\n\n" +
                "ROLE: " + role + "\nSKILLS: " + skillsStr + "\nEXPERIENCE: " + experience + "\nDIFFICULTY: " + difficulty + "\n\n" +
                "Respond ONLY with a JSON array (no markdown):\n" +
                "[{\"question\":\"...\",\"hint\":\"...\",\"expectedAnswer\":\"...\",\"followUp\":\"...\",\"difficulty\":\"" + difficulty + "\"}]";

            String raw = callGemini(prompt);
            String jsonStr = extractJson(raw);
            JsonNode array = objectMapper.readTree(jsonStr);
            List<InterviewQuestionDTO> questions = new ArrayList<>();
            if (array.isArray()) {
                array.forEach(q -> questions.add(new InterviewQuestionDTO(
                    q.path("question").asText(),
                    q.path("hint").asText(),
                    q.path("expectedAnswer").asText(),
                    q.path("followUp").asText(),
                    q.path("difficulty").asText(difficulty)
                )));
            }
            return questions.isEmpty() ? fallbackInterviewQuestions(role, difficulty) : questions;
        } catch (Exception e) {
            System.err.println("generateInterviewQuestions failed: " + e.getMessage());
            return fallbackInterviewQuestions(role, difficulty);
        }
    }

    private List<InterviewQuestionDTO> fallbackInterviewQuestions(String role, String difficulty) {
        return List.of(
            new InterviewQuestionDTO(
                "Tell me about yourself and why you're interested in this " + role + " role.",
                "Structure: Present situation → Past experience → Future goals",
                "Give a concise 2-minute overview of your background, key skills, and career goals aligned with the role.",
                "What specifically excites you about working at this company?", difficulty),
            new InterviewQuestionDTO(
                "Describe a challenging project you've worked on and what you learned.",
                "Use STAR: Situation, Task, Action, Result",
                "Describe a real project, your specific contribution, the challenge faced, and the measurable outcome.",
                "What would you do differently if you could redo that project?", difficulty),
            new InterviewQuestionDTO(
                "How do you handle tight deadlines and prioritize multiple tasks?",
                "Mention time management tools or frameworks you use",
                "Explain your approach to task prioritization, stakeholder communication, and quality under pressure.",
                "Give a specific example of a time you had to meet a critical deadline.", difficulty),
            new InterviewQuestionDTO(
                "Explain a technical concept from your skill set to a non-technical audience.",
                "Choose a concept you know well; use simple analogies",
                "Demonstrate ability to simplify complex ideas. This shows communication skills for team collaboration.",
                "Why is clear communication important for engineers?", difficulty),
            new InterviewQuestionDTO(
                "Where do you see yourself professionally in 2-3 years?",
                "Align your answer with growth opportunities at the company",
                "Show ambition and self-awareness. Tie goals to skills you want to develop.",
                "How does this role fit into your long-term career plan?", difficulty)
        );
    }

    // ─── Existing: Candidate Evaluation (Company AI Match) ───────────────────

    public AICandidateMatchDTO evaluateCandidate(Job job, Student student, Boolean hasApplied, String applicationId) {
        String apiKey = resolveApiKey();
        if (apiKey == null) {
            return fallbackMatching(job, student, hasApplied, applicationId, "Local Match (No API Key set)");
        }

        try {
            String prompt = String.format(
                "You are an expert HR recruiter matching college students to job postings.\n" +
                "Evaluate the suitability of the candidate for this job position.\n\n" +
                "JOB: %s\nDescription: %s\nBranches: %s\nMin CGPA: %s\n\n" +
                "CANDIDATE: %s | Branch: %s | CGPA: %s | Skills: %s\n\n" +
                "Respond ONLY with JSON: {\"score\": 85, \"reason\": \"Reason here.\"}",
                job.getTitle(), job.getDescription(),
                job.getEligibility() != null && job.getEligibility().getBranches() != null ? String.join(", ", job.getEligibility().getBranches()) : "Any",
                job.getEligibility() != null && job.getEligibility().getMinCgpa() != null ? job.getEligibility().getMinCgpa() : "None",
                student.getName(), student.getBranch(), student.getCgpa(),
                student.getSkills() != null ? String.join(", ", student.getSkills()) : "None"
            );

            String raw = callGemini(prompt);
            return parseGeminiResponse(raw, student, hasApplied, applicationId);
        } catch (Exception e) {
            System.err.println("evaluateCandidate failed: " + e.getMessage());
            return fallbackMatching(job, student, hasApplied, applicationId, "Local Match (Exception occurred)");
        }
    }

    private AICandidateMatchDTO parseGeminiResponse(String rawText, Student student, Boolean hasApplied, String applicationId) {
        try {
            Pattern jsonPattern = Pattern.compile("\\{[^{}]*\\}");
            Matcher matcher = jsonPattern.matcher(rawText.replace("\n", " "));
            if (matcher.find()) {
                JsonNode node = objectMapper.readTree(matcher.group());
                int score = node.path("score").asInt(50);
                String reason = node.path("reason").asText("Matched based on AI evaluation.");
                return new AICandidateMatchDTO(student, score, reason, hasApplied, applicationId);
            }
        } catch (Exception e) {
            System.err.println("Failed to parse Gemini response: " + rawText);
        }
        String clean = rawText.replaceAll("```json|```", "").trim();
        return new AICandidateMatchDTO(student, 70, clean.substring(0, Math.min(clean.length(), 200)), hasApplied, applicationId);
    }

    private AICandidateMatchDTO fallbackMatching(Job job, Student student, Boolean hasApplied, String applicationId, String prefix) {
        int score = 40;
        List<String> matchedSkills = new ArrayList<>();
        if (student.getCgpa() != null) score += Math.round(student.getCgpa() * 4);
        if (job.getEligibility() != null && job.getEligibility().getBranches() != null) {
            if (job.getEligibility().getBranches().contains(student.getBranch())) score += 10;
        }
        if (student.getSkills() != null && job.getDescription() != null) {
            String descLower = job.getDescription().toLowerCase();
            for (String skill : student.getSkills()) {
                if (descLower.contains(skill.toLowerCase())) { matchedSkills.add(skill); score += 5; }
            }
        }
        score = Math.min(100, Math.max(0, score));
        String justification = String.format("%s: Candidate from %s with CGPA %.1f. Matched: %s.",
                prefix, student.getBranch(), student.getCgpa() != null ? student.getCgpa() : 0,
                matchedSkills.isEmpty() ? "None" : String.join(", ", matchedSkills));
        return new AICandidateMatchDTO(student, score, justification, hasApplied, applicationId);
    }
}
