package com.placement.repository;

import com.placement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<Student> findTop6ByIsApprovedTrueOrderByCgpaDesc();
    List<Student> findByIsTopPerformerTrueAndIsApprovedTrue();
    List<Student> findByIsApprovedTrue();
}

