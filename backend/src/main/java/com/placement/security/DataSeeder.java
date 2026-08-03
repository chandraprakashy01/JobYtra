package com.placement.security;

import com.placement.model.Admin;
import com.placement.model.Company;
import com.placement.model.Eligibility;
import com.placement.model.Job;
import com.placement.model.Student;
import com.placement.repository.AdminRepository;
import com.placement.repository.CompanyRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin
        java.util.Optional<Admin> existingAdmin = adminRepository.findByEmail("Abc@gmail.com");
        if (existingAdmin.isEmpty()) {
            Admin admin = new Admin();
            admin.setEmail("Abc@gmail.com");
            admin.setPassword(passwordEncoder.encode("Abc@123"));
            admin.setRole("ROLE_ADMIN");
            adminRepository.save(admin);
            System.out.println("Default admin user seeded: Abc@gmail.com / Abc@123");
        }

        // 2. Seed Company
        Company company = companyRepository.findByEmail("google@gmail.com").orElse(null);
        if (company == null) {
            company = new Company();
            company.setName("Google India");
            company.setEmail("google@gmail.com");
            company.setPassword(passwordEncoder.encode("Company@123"));
            company.setWebsite("https://google.com");
            company.setAbout("Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, and computer software.");
            company.setIsVerified(true);
            companyRepository.save(company);
            System.out.println("Dummy Company seeded: google@gmail.com / Company@123");
        }

        // 3. Seed Students
        if (studentRepository.findByEmail("aarav@gmail.com").isEmpty()) {
            Student s1 = new Student();
            s1.setName("Aarav Sharma");
            s1.setEmail("aarav@gmail.com");
            s1.setPassword(passwordEncoder.encode("Student@123"));
            s1.setBranch("CSE");
            s1.setCgpa(9.2f);
            s1.setSkills(List.of("Java", "Spring Boot", "React", "SQL", "HTML", "CSS"));
            s1.setBatch("2026");
            s1.setCollegeId("C2026-CSE-001");
            s1.setIsApproved(true);
            studentRepository.save(s1);
        }

        if (studentRepository.findByEmail("priya@gmail.com").isEmpty()) {
            Student s2 = new Student();
            s2.setName("Priya Patel");
            s2.setEmail("priya@gmail.com");
            s2.setPassword(passwordEncoder.encode("Student@123"));
            s2.setBranch("CSE");
            s2.setCgpa(8.8f);
            s2.setSkills(List.of("Python", "Django", "Machine Learning", "Docker", "Git"));
            s2.setBatch("2026");
            s2.setCollegeId("C2026-CSE-002");
            s2.setIsApproved(true);
            studentRepository.save(s2);
        }

        if (studentRepository.findByEmail("rahul@gmail.com").isEmpty()) {
            Student s3 = new Student();
            s3.setName("Rahul Verma");
            s3.setEmail("rahul@gmail.com");
            s3.setPassword(passwordEncoder.encode("Student@123"));
            s3.setBranch("ECE");
            s3.setCgpa(7.9f);
            s3.setSkills(List.of("Embedded C", "Arduino", "MATLAB", "C++"));
            s3.setBatch("2026");
            s3.setCollegeId("C2026-ECE-005");
            s3.setIsApproved(true);
            studentRepository.save(s3);
            System.out.println("Dummy Students seeded: aarav@gmail.com, priya@gmail.com, rahul@gmail.com");
        }

        // 4. Seed Jobs
        if (jobRepository.findByCompanyId(company.getId()).isEmpty()) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MONTH, 1);
            Date deadline = cal.getTime();

            Job j1 = new Job();
            j1.setTitle("Software Engineer Intern");
            j1.setCompanyId(company.getId());
            j1.setDescription("Looking for a software engineer intern with strong proficiency in Java, Spring Boot, React, and databases. Responsibilities include building scalable web APIs and interactive frontend components.");
            j1.setSalary("50k/month");
            j1.setLocation("Bangalore");
            j1.setType("internship");
            j1.setDeadline(deadline);
            j1.setIsApproved(true);
            
            Eligibility e1 = new Eligibility();
            e1.setMinCgpa(7.5f);
            e1.setBranches(List.of("CSE", "IT"));
            j1.setEligibility(e1);
            jobRepository.save(j1);

            Job j2 = new Job();
            j2.setTitle("Machine Learning Associate");
            j2.setCompanyId(company.getId());
            j2.setDescription("Looking for a graduate associate skilled in Python, training machine learning models, Django backend, and containerization using Docker.");
            j2.setSalary("15 LPA");
            j2.setLocation("Hyderabad");
            j2.setType("full-time");
            j2.setDeadline(deadline);
            j2.setIsApproved(true);
            
            Eligibility e2 = new Eligibility();
            e2.setMinCgpa(8.0f);
            e2.setBranches(List.of("CSE"));
            j2.setEligibility(e2);
            jobRepository.save(j2);

            System.out.println("Dummy Jobs seeded: Software Engineer Intern, Machine Learning Associate");
        }
    }
}
