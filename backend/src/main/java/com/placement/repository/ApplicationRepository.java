package com.placement.repository;

import com.placement.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByStudentId(String studentId);
    List<Application> findByJobId(String jobId);
    boolean existsByStudentIdAndJobId(String studentId, String jobId);
}
