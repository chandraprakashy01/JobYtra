package com.placement.controller;

import com.placement.controller.dto.MessageResponse;
import com.placement.model.Company;
import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.CompanyRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @PutMapping("/students/{id}/approve")
    public ResponseEntity<?> approveStudent(@PathVariable String id) {
        Student student = studentRepository.findById(id).orElseThrow();
        student.setIsApproved(true);
        studentRepository.save(student);
        return ResponseEntity.ok(new MessageResponse("Student approved"));
    }

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    @PutMapping("/companies/{id}/verify")
    public ResponseEntity<?> verifyCompany(@PathVariable String id) {
        Company company = companyRepository.findById(id).orElseThrow();
        company.setIsVerified(true);
        companyRepository.save(company);
        return ResponseEntity.ok(new MessageResponse("Company verified"));
    }

    @GetMapping("/jobs/pending")
    public ResponseEntity<List<Job>> getPendingJobs() {
        return ResponseEntity.ok(jobRepository.findByIsApprovedFalse());
    }

    @PutMapping("/jobs/{id}/approve")
    public ResponseEntity<?> approveJob(@PathVariable String id) {
        Job job = jobRepository.findById(id).orElseThrow();
        job.setIsApproved(true);
        jobRepository.save(job);
        return ResponseEntity.ok(new MessageResponse("Job approved"));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        // Just rough stats:
        long placedStudents = applicationRepository.findAll().stream()
                .filter(a -> "selected".equalsIgnoreCase(a.getStatus()))
                .map(a -> a.getStudentId())
                .distinct()
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalCompanies", totalCompanies);
        stats.put("totalPlaced", placedStudents);
        stats.put("placementRate", totalStudents > 0 ? ((double) placedStudents / totalStudents) * 100 : 0);

        return ResponseEntity.ok(stats);
    }
}
