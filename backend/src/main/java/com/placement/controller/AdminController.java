package com.placement.controller;

import com.placement.controller.dto.MessageResponse;
import com.placement.model.Company;
import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.model.Application;
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
import org.springframework.transaction.annotation.Transactional;

@CrossOrigin(origins = "https://jobytra.vercel.app", maxAge = 3600)
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

    @PutMapping("/students/{id}/toggle-top-performer")
    public ResponseEntity<?> toggleTopPerformer(@PathVariable String id) {
        Student student = studentRepository.findById(id).orElseThrow();
        boolean isTop = student.getIsTopPerformer() != null ? student.getIsTopPerformer() : false;
        student.setIsTopPerformer(!isTop);
        studentRepository.save(student);
        return ResponseEntity.ok(student);
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

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
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
        long placedStudents = applicationRepository.countDistinctStudentIdByStatusIgnoreCase("selected");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalCompanies", totalCompanies);
        stats.put("totalPlaced", placedStudents);
        stats.put("placementRate", totalStudents > 0 ? ((double) placedStudents / totalStudents) * 100 : 0);

        return ResponseEntity.ok(stats);
    }

    @Transactional
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        List<Application> apps = applicationRepository.findByStudentId(id);
        applicationRepository.deleteAll(apps);
        studentRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Student deleted successfully"));
    }

    @Transactional
    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable String id) {
        List<Job> jobs = jobRepository.findByCompanyId(id);
        for(Job j : jobs) {
            List<Application> apps = applicationRepository.findByJobId(j.getId());
            applicationRepository.deleteAll(apps);
        }
        jobRepository.deleteAll(jobs);
        companyRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Company deleted successfully"));
    }

    @Transactional
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id) {
        List<Application> apps = applicationRepository.findByJobId(id);
        applicationRepository.deleteAll(apps);
        jobRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Job deleted successfully"));
    }
}
