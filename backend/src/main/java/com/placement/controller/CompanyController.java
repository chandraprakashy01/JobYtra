package com.placement.controller;

import com.placement.controller.dto.MessageResponse;
import com.placement.controller.dto.AICandidateMatchDTO;
import com.placement.model.Application;
import com.placement.model.Company;
import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.CompanyRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentRepository;
import com.placement.service.EmailService;
import com.placement.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    JobRepository jobRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    GeminiService geminiService;

    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email).orElseThrow();
        // Return company info without password
        company.setPassword(null);
        return ResponseEntity.ok(company);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getMyJobs(Authentication authentication) {
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(jobRepository.findByCompanyId(company.getId()));
    }

    @PostMapping("/jobs/create")
    public ResponseEntity<?> createJob(@RequestBody Job job, Authentication authentication) {
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email).orElseThrow();

        if (!company.getIsVerified()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Company is not verified yet."));
        }

        job.setCompanyId(company.getId());
        job.setIsApproved(false); // require admin approval
        
        jobRepository.save(job);
        return ResponseEntity.ok(new MessageResponse("Job created successfully, pending admin approval."));
    }

    @GetMapping("/applications/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplicants(@PathVariable String jobId, Authentication authentication) {
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email).orElseThrow();

        // Verify company owns the job
        Job job = jobRepository.findById(jobId).orElseThrow();
        if (!job.getCompanyId().equals(company.getId())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(applicationRepository.findByJobId(jobId));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable String id, @RequestBody Application statusUpdate, Authentication authentication) {
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email).orElseThrow();

        Application app = applicationRepository.findById(id).orElseThrow();
        Job job = jobRepository.findById(app.getJobId()).orElseThrow();

        if (!job.getCompanyId().equals(company.getId())) {
            return ResponseEntity.status(403).build();
        }

        app.setStatus(statusUpdate.getStatus());
        if (statusUpdate.getInterviewDate() != null) {
            app.setInterviewDate(statusUpdate.getInterviewDate());
        }
        applicationRepository.save(app);

        // Interview Scheduling (basic) using EmailService
        if ("shortlisted".equalsIgnoreCase(app.getStatus())) {
            Student student = studentRepository.findById(app.getStudentId()).orElseThrow();
            emailService.sendEmail(student.getEmail(), "Interview Shortlisted: " + job.getTitle(),
                    "Congratulations! You have been shortlisted for an interview with " + company.getName() + " on " + app.getInterviewDate());
        }

        return ResponseEntity.ok(new MessageResponse("Status updated to " + app.getStatus()));
    }

    @GetMapping("/jobs/{jobId}/ai-match")
    public ResponseEntity<List<AICandidateMatchDTO>> getAICandidateMatches(@PathVariable String jobId, Authentication authentication) {
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email).orElseThrow();

        Job job = jobRepository.findById(jobId).orElseThrow();
        if (!job.getCompanyId().equals(company.getId())) {
            return ResponseEntity.status(403).build();
        }

        // 1. Get all applications for this job
        List<Application> applications = applicationRepository.findByJobId(jobId);
        Set<String> appliedStudentIds = applications.stream()
                .map(Application::getStudentId)
                .collect(Collectors.toSet());

        List<AICandidateMatchDTO> results = new ArrayList<>();

        // 2. Process Applied Candidates
        for (Application app : applications) {
            studentRepository.findById(app.getStudentId()).ifPresent(student -> {
                AICandidateMatchDTO match = geminiService.evaluateCandidate(job, student, true, app.getId());
                results.add(match);
            });
        }

        // 3. Process Talent Pool (approved students who haven't applied and are eligible)
        List<Student> allApprovedStudents = studentRepository.findByIsApprovedTrue();
        List<Student> eligibleTalents = allApprovedStudents.stream()
                .filter(student -> !appliedStudentIds.contains(student.getId()))
                .filter(student -> {
                    // Check CGPA Eligibility
                    if (student.getCgpa() != null && job.getEligibility() != null && job.getEligibility().getMinCgpa() != null) {
                        if (student.getCgpa() < job.getEligibility().getMinCgpa()) return false;
                    }
                    // Check Branch Eligibility
                    if (job.getEligibility() != null && job.getEligibility().getBranches() != null && !job.getEligibility().getBranches().isEmpty()) {
                        if (!job.getEligibility().getBranches().contains(student.getBranch())) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        // Pre-rank talents locally based on skill overlap + CGPA to evaluate only the top 10
        List<Student> topEligibleTalents = eligibleTalents.stream()
                .sorted((s1, s2) -> {
                    int score1 = calculateLocalScore(job, s1);
                    int score2 = calculateLocalScore(job, s2);
                    return Integer.compare(score2, score1);
                })
                .limit(10)
                .collect(Collectors.toList());

        for (Student talent : topEligibleTalents) {
            AICandidateMatchDTO match = geminiService.evaluateCandidate(job, talent, false, null);
            results.add(match);
        }

        // Sort overall matches by score descending
        results.sort(Comparator.comparing(AICandidateMatchDTO::getMatchScore).reversed());

        return ResponseEntity.ok(results);
    }

    @PostMapping("/jobs/{jobId}/invite/{studentId}")
    public ResponseEntity<?> inviteStudent(@PathVariable String jobId, @PathVariable String studentId, Authentication authentication) {
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email).orElseThrow();

        Job job = jobRepository.findById(jobId).orElseThrow();
        if (!job.getCompanyId().equals(company.getId())) {
            return ResponseEntity.status(403).build();
        }

        Student student = studentRepository.findById(studentId).orElseThrow();

        String subject = "Exclusive Invitation: Apply for " + job.getTitle() + " at " + company.getName();
        String text = String.format(
            "Hello %s,\n\n" +
            "Our recruitment team at %s reviewed your profile on JobYtra and found it to be an excellent match for our open position: %s.\n\n" +
            "We would love for you to apply to this role. Please log in to your student profile on JobYtra and navigate to Jobs to submit your application.\n\n" +
            "Best Regards,\n" +
            "HR Team\n" +
            "%s",
            student.getName(),
            company.getName(),
            job.getTitle(),
            company.getName()
        );

        emailService.sendEmail(student.getEmail(), subject, text);

        return ResponseEntity.ok(new MessageResponse("Invitation sent successfully."));
    }

    private int calculateLocalScore(Job job, Student student) {
        int score = 0;
        if (student.getCgpa() != null) {
            score += Math.round(student.getCgpa() * 10);
        }
        if (student.getSkills() != null && job.getDescription() != null) {
            String descLower = job.getDescription().toLowerCase();
            for (String skill : student.getSkills()) {
                if (descLower.contains(skill.toLowerCase())) {
                    score += 15;
                }
            }
        }
        return score;
    }
}

