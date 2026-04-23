package com.placement.controller;

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
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    JobRepository jobRepository;

    @Autowired
    StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Job>> getAllApprovedJobs() {
        return ResponseEntity.ok(jobRepository.findByIsApprovedTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable String id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<Job>> getRecommendedJobs(Authentication authentication) {
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Job> allApproved = jobRepository.findByIsApprovedTrue();
        
        List<Job> recommended = allApproved.stream().filter(job -> {
            // Check eligibility first
            if (student.getCgpa() != null && job.getEligibility() != null && job.getEligibility().getMinCgpa() != null) {
                if (student.getCgpa() < job.getEligibility().getMinCgpa()) return false;
            }
            if (job.getEligibility() != null && job.getEligibility().getBranches() != null && !job.getEligibility().getBranches().isEmpty()) {
                if (!job.getEligibility().getBranches().contains(student.getBranch())) return false;
            }

            // Skill match: calculate score
            long matchCount = 0;
            if (student.getSkills() != null && job.getDescription() != null) {
                String descLower = job.getDescription().toLowerCase();
                matchCount = student.getSkills().stream()
                        .filter(skill -> descLower.contains(skill.toLowerCase()))
                        .count();
            }
            return matchCount > 0; // return if at least 1 skill matches
        }).collect(Collectors.toList());

        return ResponseEntity.ok(recommended);
    }
}
