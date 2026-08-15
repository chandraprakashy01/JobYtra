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
import java.time.LocalDateTime;

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

        // Generate 6-digit OTP
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        if (student != null) {
            student.setResetOtp(otp);
            student.setResetOtpExpiry(expiry);
            studentRepository.save(student);
        } else {
            company.setResetOtp(otp);
            company.setResetOtpExpiry(expiry);
            companyRepository.save(company);
        }

        // Send email
        String emailSubject = "JobYtra - Password Reset OTP";
        String emailBody = "Hello,\n\n" +
                "You have requested to reset your password. Here is your One-Time Password (OTP):\n\n" +
                "OTP: " + otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "Best regards,\n" +
                "JobYtra Placement Cell";
        
        emailService.sendEmail(email, emailSubject, emailBody);

        return ResponseEntity.ok(new MessageResponse("An OTP has been sent to your email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        String newPassword = request.getNewPassword();

        Student student = studentRepository.findByEmail(email).orElse(null);
        Company company = companyRepository.findByEmail(email).orElse(null);

        if (student == null && company == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }

        boolean isValid = false;
        
        if (student != null) {
            if (otp.equals(student.getResetOtp()) && student.getResetOtpExpiry() != null && LocalDateTime.now().isBefore(student.getResetOtpExpiry())) {
                student.setPassword(encoder.encode(newPassword));
                student.setResetOtp(null);
                student.setResetOtpExpiry(null);
                studentRepository.save(student);
                isValid = true;
            }
        } else {
            if (otp.equals(company.getResetOtp()) && company.getResetOtpExpiry() != null && LocalDateTime.now().isBefore(company.getResetOtpExpiry())) {
                company.setPassword(encoder.encode(newPassword));
                company.setResetOtp(null);
                company.setResetOtpExpiry(null);
                companyRepository.save(company);
                isValid = true;
            }
        }

        if (!isValid) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid or expired OTP."));
        }

        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully."));
    }
}
