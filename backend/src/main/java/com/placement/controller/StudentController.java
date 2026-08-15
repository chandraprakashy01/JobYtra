package com.placement.controller;

import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@CrossOrigin(origins = "https://jobytra.vercel.app", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
public class StudentController {
    
    @Autowired
    StudentRepository studentRepository;

    private final Path root = Paths.get("uploads");

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return studentRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Student studentDetails, Authentication authentication) {
        String email = authentication.getName();
        return studentRepository.findByEmail(email).map(student -> {
            student.setSkills(studentDetails.getSkills());
            student.setCgpa(studentDetails.getCgpa());
            student.setBranch(studentDetails.getBranch());
            studentRepository.save(student);
            return ResponseEntity.ok(student);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));

            String email = authentication.getName();
            Student student = studentRepository.findByEmail(email).orElseThrow();
            student.setResumeUrl("/uploads/" + filename);
            studentRepository.save(student);

            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }

    @PostMapping("/profile-pic")
    public ResponseEntity<?> uploadProfilePic(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));

            String email = authentication.getName();
            Student student = studentRepository.findByEmail(email).orElseThrow();
            student.setProfilePicUrl("/uploads/" + filename);
            studentRepository.save(student);

            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }
}
