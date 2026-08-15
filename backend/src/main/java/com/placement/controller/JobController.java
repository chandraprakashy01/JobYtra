package com.placement.controller;

import com.placement.controller.dto.JobWithCompanyDTO;
import com.placement.model.Company;
import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.CompanyRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "https://jobytra.vercel.app", maxAge = 3600)
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    JobRepository jobRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    StudentRepository studentRepository;

    private JobWithCompanyDTO toDTO(Job job, Company company) {
        JobWithCompanyDTO dto = new JobWithCompanyDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setCompanyId(job.getCompanyId());
        dto.setDescription(job.getDescription());
        dto.setEligibility(job.getEligibility());
        dto.setSalary(job.getSalary());
        dto.setLocation(job.getLocation());
        dto.setType(job.getType());
        dto.setDeadline(job.getDeadline());
        dto.setIsApproved(job.getIsApproved());
        dto.setPostedAt(job.getPostedAt());

        if (company != null) {
            dto.setCompanyName(company.getName());
            dto.setCompanyWebsite(company.getWebsite());
            dto.setCompanyAbout(company.getAbout());
        }
        return dto;
    }

    private List<JobWithCompanyDTO> convertToDTOs(List<Job> jobs) {
        List<String> companyIds = jobs.stream()
                .map(Job::getCompanyId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        
        java.util.Map<String, Company> companyMap = companyRepository.findAllById(companyIds).stream()
                .collect(Collectors.toMap(Company::getId, c -> c));

        return jobs.stream()
                .map(job -> toDTO(job, companyMap.get(job.getCompanyId())))
                .collect(Collectors.toList());
    }

    @GetMapping
    public ResponseEntity<List<JobWithCompanyDTO>> getAllApprovedJobs() {
        List<Job> jobs = jobRepository.findByIsApprovedTrue();
        return ResponseEntity.ok(convertToDTOs(jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobWithCompanyDTO> getJobById(@PathVariable String id) {
        return jobRepository.findById(id)
                .map(job -> {
                    Company company = job.getCompanyId() != null ? companyRepository.findById(job.getCompanyId()).orElse(null) : null;
                    return ResponseEntity.ok(toDTO(job, company));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<JobWithCompanyDTO>> getRecommendedJobs(Authentication authentication) {
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Job> allApproved = jobRepository.findByIsApprovedTrue();

        List<Job> recommendedJobs = allApproved.stream().filter(job -> {
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

        return ResponseEntity.ok(convertToDTOs(recommendedJobs));
    }
}
