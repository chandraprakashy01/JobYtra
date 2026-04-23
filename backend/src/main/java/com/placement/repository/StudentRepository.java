package com.placement.repository;

import com.placement.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<Student> findTop6ByIsApprovedTrueOrderByCgpaDesc();
}
