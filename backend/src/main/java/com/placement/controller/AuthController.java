package com.placement.controller;

import com.placement.controller.dto.*;
import com.placement.model.Company;
import com.placement.model.Student;
import com.placement.repository.CompanyRepository;
import com.placement.repository.StudentRepository;
import com.placement.security.JwtUtils;
import com.placement.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "https://jobytra.vercel.app", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.placement.service.EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getAuthorities().iterator().next().getAuthority()));
    }

    @PostMapping("/student/register")
    public ResponseEntity<?> registerStudent(@RequestBody SignupRequestStudent signUpRequest) {
        if (studentRepository.existsByEmail(signUpRequest.getEmail()) || companyRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        Student student = new Student();
        student.setName(signUpRequest.getName());
        student.setEmail(signUpRequest.getEmail());
        student.setPassword(encoder.encode(signUpRequest.getPassword()));
        student.setBranch(signUpRequest.getBranch());
        student.setCgpa(signUpRequest.getCgpa());
        student.setSkills(signUpRequest.getSkills());
        student.setBatch(signUpRequest.getBatch());
        student.setCollegeId(signUpRequest.getCollegeId());
        student.setIsApproved(false); // require admin approval

        studentRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Student registered successfully! Wait for Admin approval."));
    }

    @PostMapping("/company/register")
    public ResponseEntity<?> registerCompany(@RequestBody SignupRequestCompany signUpRequest) {
        if (studentRepository.existsByEmail(signUpRequest.getEmail()) || companyRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        Company company = new Company();
        company.setName(signUpRequest.getName());
        company.setEmail(signUpRequest.getEmail());
        company.setPassword(encoder.encode(signUpRequest.getPassword()));
        company.setWebsite(signUpRequest.getWebsite());
        company.setAbout(signUpRequest.getAbout());
        company.setIsVerified(false);

        companyRepository.save(company);

        return ResponseEntity.ok(new MessageResponse("Company registered successfully! Wait for verification."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        Student student = studentRepository.findByEmail(email).orElse(null);
        Company company = companyRepository.findByEmail(email).orElse(null);

        if (student == null && company == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }

        // Generate temporary password
        String tempPassword = "Temp@" + (int)(Math.random() * 900000 + 100000);
        String encodedPassword = encoder.encode(tempPassword);

        if (student != null) {
            student.setPassword(encodedPassword);
            studentRepository.save(student);
        } else {
            company.setPassword(encodedPassword);
            companyRepository.save(company);
        }

        // Send email
        String emailSubject = "JobYtra - Password Reset Request";
        String emailBody = "Hello,\n\n" +
                "Your password has been successfully reset. Below is your temporary password to log in:\n\n" +
                "Temporary Password: " + tempPassword + "\n\n" +
                "Please log in and update your password immediately in your profile settings.\n\n" +
                "Best regards,\n" +
                "JobYtra Placement Cell";
        
        emailService.sendEmail(email, emailSubject, emailBody);

        return ResponseEntity.ok(new ForgotPasswordResponse("Temporary password generated and sent to email.", tempPassword));
    }
}
