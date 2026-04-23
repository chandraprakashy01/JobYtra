package com.placement.controller;

import com.placement.controller.dto.MessageResponse;
import com.placement.model.Application;
import com.placement.model.Company;
import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.CompanyRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentRepository;
import com.placement.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
