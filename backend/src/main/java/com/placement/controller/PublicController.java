package com.placement.controller;

import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public")
public class PublicController {
    
    @Autowired
    StudentRepository studentRepository;

    @GetMapping("/top-students")
    public ResponseEntity<List<Student>> getTopStudents() {
        return ResponseEntity.ok(studentRepository.findTop6ByIsApprovedTrueOrderByCgpaDesc());
    }
}
