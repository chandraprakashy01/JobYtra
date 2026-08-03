package com.placement.repository;

import com.placement.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, String> {
    Optional<Company> findByEmail(String email);
    Boolean existsByEmail(String email);
}
