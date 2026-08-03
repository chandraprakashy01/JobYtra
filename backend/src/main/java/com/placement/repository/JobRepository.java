package com.placement.repository;

import com.placement.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, String> {
    List<Job> findByIsApprovedTrue();
    List<Job> findByIsApprovedFalse();
    List<Job> findByCompanyId(String companyId);
}
