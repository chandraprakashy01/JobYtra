package com.placement.repository;

import com.placement.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByIsApprovedTrue();
    List<Job> findByIsApprovedFalse();
    List<Job> findByCompanyId(String companyId);
}
