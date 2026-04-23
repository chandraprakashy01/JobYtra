package com.placement.controller;

import com.placement.controller.dto.MessageResponse;
import com.placement.model.Application;
import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    StudentRepository studentRepository;

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyForJob(@PathVariable String jobId, Authentication authentication) {
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email).orElseThrow();

        if (!student.getIsApproved()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Your account is not approved yet."));
        }

        Job job = jobRepository.findById(jobId).orElseThrow();

        // 1. Auto-eligibility Check
        if (job.getEligibility() != null) {
            if (job.getEligibility().getMinCgpa() != null && student.getCgpa() < job.getEligibility().getMinCgpa()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Not eligible: CGPA requirement not met."));
            }
            if (job.getEligibility().getBranches() != null && !job.getEligibility().getBranches().isEmpty()) {
                if (!job.getEligibility().getBranches().contains(student.getBranch())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Not eligible: Branch requirement not met."));
                }
            }
        }

        // Check if already applied
        if (applicationRepository.existsByStudentIdAndJobId(student.getId(), jobId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Already applied to this job."));
        }

        Application app = new Application();
        app.setStudentId(student.getId());
        app.setJobId(jobId);
        app.setStatus("applied");
        app.setAppliedAt(new Date());

        applicationRepository.save(app);

        return ResponseEntity.ok(new MessageResponse("Applied successfully!"));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(applicationRepository.findByStudentId(student.getId()));
    }
}
