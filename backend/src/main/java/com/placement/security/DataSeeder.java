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

        // 5. Seed Bazarsetu Company & Job
        Company bazarsetu = companyRepository.findByEmail("hr@bazarsetu.in").orElse(null);
        if (bazarsetu == null) {
            bazarsetu = new Company();
            bazarsetu.setName("Bazarsetu");
            bazarsetu.setEmail("hr@bazarsetu.in");
            bazarsetu.setPassword(passwordEncoder.encode("Company@123"));
            bazarsetu.setWebsite("https://bazarsetu.in");
            bazarsetu.setAbout("Bazarsetu is a fast-growing platform leveraging AI for modern commerce.");
            bazarsetu.setIsVerified(true);
            companyRepository.save(bazarsetu);
            System.out.println("Seeded Company: Bazarsetu");
        }

        if (jobRepository.findByCompanyId(bazarsetu.getId()).isEmpty()) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MONTH, 1);
            Date deadline = cal.getTime();

            Job aiJob = new Job();
            aiJob.setTitle("AI Engineer");
            aiJob.setCompanyId(bazarsetu.getId());
            aiJob.setDescription("Join Bazarsetu as an AI Engineer. You will work on cutting-edge machine learning models, NLP, and computer vision to enhance our commerce platform.");
            aiJob.setSalary("18 LPA");
            aiJob.setLocation("Bangalore (Hybrid)");
            aiJob.setType("full-time");
            aiJob.setDeadline(deadline);
            aiJob.setIsApproved(true);

            Eligibility el = new Eligibility();
            el.setMinCgpa(7.5f);
            el.setBranches(List.of("CSE", "IT", "AI"));
            aiJob.setEligibility(el);
            
            jobRepository.save(aiJob);
            System.out.println("Seeded Job for Company: Bazarsetu");
        }

        // 6. Seed Additional Dummy Companies & Jobs/Internships
        String[][] companiesData = {
            {"Microsoft", "microsoft@gmail.com", "Redmond-based tech giant focusing on cloud, AI, and OS.", "https://microsoft.com"},
            {"TCS", "tcs@gmail.com", "Tata Consultancy Services is a global leader in IT services, consulting & business solutions.", "https://tcs.com"},
            {"Infosys", "infosys@gmail.com", "Infosys is a global leader in next-generation digital services and consulting.", "https://infosys.com"},
            {"Razorpay", "razorpay@gmail.com", "Razorpay is India's leading payments solution provider for businesses.", "https://razorpay.com"},
            {"Netflix", "netflix@gmail.com", "Netflix is a premier entertainment service with millions of paid memberships.", "https://netflix.com"},
            {"Amazon", "amazon@gmail.com", "Amazon is a multinational tech company focusing on e-commerce, cloud, and AI.", "https://amazon.com"},
            {"Meta", "meta@gmail.com", "Meta builds technologies that help people connect, find communities, and grow businesses.", "https://meta.com"},
            {"Flipkart", "flipkart@gmail.com", "Flipkart is one of India's leading digital commerce marketplaces.", "https://flipkart.com"},
            {"Zomato", "zomato@gmail.com", "Zomato is a technology platform connecting customers, restaurant partners, and delivery partners.", "https://zomato.com"},
            {"Adobe", "adobe@gmail.com", "Adobe is the global leader in digital media and digital marketing solutions.", "https://adobe.com"}
        };

        for (String[] cData : companiesData) {
            String name = cData[0];
            String email = cData[1];
            String about = cData[2];
            String website = cData[3];

            Company c = companyRepository.findByEmail(email).orElse(null);
            if (c == null) {
                c = new Company();
                c.setName(name);
                c.setEmail(email);
                c.setPassword(passwordEncoder.encode("Company@123"));
                c.setWebsite(website);
                c.setAbout(about);
                c.setIsVerified(true);
                companyRepository.save(c);
                System.out.println("Seeded Company: " + name);
            }

            // Seed jobs/internships for this company
            if (jobRepository.findByCompanyId(c.getId()).isEmpty()) {
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.MONTH, 1);
                Date deadline = cal.getTime();

                // Internships for Microsoft, Razorpay, Netflix, Zomato, Adobe
                // Full-time for TCS, Infosys, Amazon, Meta, Flipkart
                boolean isInternship = List.of("Microsoft", "Razorpay", "Netflix", "Zomato", "Adobe").contains(name);

                Job jobObj = new Job();
                jobObj.setCompanyId(c.getId());
                jobObj.setDeadline(deadline);
                jobObj.setIsApproved(true);

                if (isInternship) {
                    jobObj.setTitle(name + " Software Intern");
                    jobObj.setDescription("Join " + name + " as a Software Development Intern. You will work on production systems, write automated tests, and collaborate with product teams.");
                    jobObj.setSalary("45k/month");
                    jobObj.setLocation("Bangalore (Hybrid)");
                    jobObj.setType("internship");

                    Eligibility el = new Eligibility();
                    el.setMinCgpa(7.0f);
                    el.setBranches(List.of("CSE", "IT", "ECE"));
                    jobObj.setEligibility(el);
                } else {
                    jobObj.setTitle(name + " Graduate Analyst");
                    jobObj.setDescription("Join " + name + " as a Graduate Engineer/Analyst. You will build highly scalable REST microservices, monitor production systems, and design robust architectures.");
                    jobObj.setSalary("12 LPA");
                    jobObj.setLocation("Pune / Hyderabad");
                    jobObj.setType("full-time");

                    Eligibility el = new Eligibility();
                    el.setMinCgpa(6.5f);
                    el.setBranches(List.of("CSE", "IT", "ECE", "MECH"));
                    jobObj.setEligibility(el);
                }
                jobRepository.save(jobObj);
                System.out.println("Seeded Job for Company: " + name);
            }
        }
    }
}
