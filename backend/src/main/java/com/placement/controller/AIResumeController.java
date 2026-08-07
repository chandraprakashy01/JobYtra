package com.placement.controller;

import com.placement.controller.dto.*;
import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import com.placement.service.GeminiService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * AIResumeController — handles all student-facing AI features:
 * - Phase 1: Resume Analyzer (PDF → ATS score, skills, suggestions)
 * - Phase 2: Resume vs Job Match (score + learning roadmap)
 * - Phase 3: Cover Letter Generator
 * - Phase 5: Interview Coach (Q&A generation)
 *
 * All endpoints are under /api/student/ai/ and require ROLE_STUDENT (enforced by WebSecurityConfig).
 */
@CrossOrigin(origins = "https://jobytra.vercel.app", maxAge = 3600)
@RestController
@RequestMapping("/api/student/ai")
public class AIResumeController {

    @Autowired
    GeminiService geminiService;

    @Autowired
    StudentRepository studentRepository;

    // ─── Shared: PDF text extraction ─────────────────────────────────────────

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are accepted.");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("PDF size must not exceed 5MB.");
        }
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            if (text == null || text.trim().isEmpty()) {
                throw new IllegalArgumentException("Could not extract text from PDF. Ensure it is not image-only.");
            }
            return text;
        }
    }

    // ─── Phase 1: Analyze Resume ──────────────────────────────────────────────

    /**
     * POST /api/student/ai/analyze-resume
     * Accepts: multipart/form-data with "file" (PDF)
     * Returns: ResumeAnalysisDTO (ATS score, skills, suggestions)
     */
    @PostMapping(value = "/analyze-resume", consumes = "multipart/form-data")
    public ResponseEntity<?> analyzeResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String resumeText = extractTextFromPdf(file);
            ResumeAnalysisDTO result = geminiService.analyzeResume(resumeText);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("analyze-resume error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to analyze resume: " + e.getMessage()));
        }
    }

    // ─── Phase 2: Match Resume to Job ─────────────────────────────────────────

    /**
     * POST /api/student/ai/match-job
     * Accepts: multipart/form-data with "file" (PDF) + "jobDescription" (text)
     * Returns: ResumeJobMatchDTO (score, matched/missing skills, roadmap)
     */
    @PostMapping(value = "/match-job", consumes = "multipart/form-data")
    public ResponseEntity<?> matchResumeToJob(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription,
            Authentication authentication) {
        try {
            if (jobDescription == null || jobDescription.trim().length() < 20) {
                return ResponseEntity.badRequest().body(new MessageResponse("Job description must be at least 20 characters."));
            }
            String resumeText = extractTextFromPdf(file);
            ResumeJobMatchDTO result = geminiService.matchResumeToJob(resumeText, jobDescription.trim());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("match-job error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to match resume: " + e.getMessage()));
        }
    }

    // ─── Phase 3: Cover Letter Generator ─────────────────────────────────────

    /**
     * POST /api/student/ai/cover-letter
     * Accepts: multipart/form-data with "file" (PDF) + form fields
     * Returns: CoverLetterDTO
     */
    @PostMapping(value = "/cover-letter", consumes = "multipart/form-data")
    public ResponseEntity<?> generateCoverLetter(
            @RequestParam("file") MultipartFile file,
            @RequestParam("companyName") String companyName,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam(value = "tone", defaultValue = "Professional") String tone,
            Authentication authentication) {
        try {
            if (companyName == null || companyName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Company name is required."));
            }
            String resumeText = extractTextFromPdf(file);
            CoverLetterDTO result = geminiService.generateCoverLetter(resumeText, companyName.trim(), jobDescription.trim(), tone.trim());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("cover-letter error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to generate cover letter: " + e.getMessage()));
        }
    }

    // ─── Phase 5: Interview Coach ─────────────────────────────────────────────

    /**
     * POST /api/student/ai/interview-prep
     * Accepts: JSON body { role, skills, experience, difficulty }
     * Returns: List<InterviewQuestionDTO>
     */
    @PostMapping("/interview-prep")
    public ResponseEntity<?> generateInterviewQuestions(
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        try {
            String role = (String) body.getOrDefault("role", "Software Engineer");
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) body.getOrDefault("skills", List.of());
            String experience = (String) body.getOrDefault("experience", "Fresher");
            String difficulty = (String) body.getOrDefault("difficulty", "Medium");

            if (role == null || role.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Role is required."));
            }

            List<InterviewQuestionDTO> questions = geminiService.generateInterviewQuestions(
                role.trim(), skills, experience.trim(), difficulty.trim()
            );
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            System.err.println("interview-prep error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(new MessageResponse("Failed to generate questions: " + e.getMessage()));
        }
    }
}
