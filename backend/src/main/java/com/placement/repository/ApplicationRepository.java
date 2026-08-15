package com.placement.repository;

import com.placement.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, String> {
    List<Application> findByStudentId(String studentId);
    List<Application> findByJobId(String jobId);
    boolean existsByStudentIdAndJobId(String studentId, String jobId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT a.studentId) FROM Application a WHERE LOWER(a.status) = LOWER(:status)")
    long countDistinctStudentIdByStatusIgnoreCase(@org.springframework.data.repository.query.Param("status") String status);
}
