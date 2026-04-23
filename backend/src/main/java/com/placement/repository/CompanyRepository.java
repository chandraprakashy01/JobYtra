package com.placement.repository;

import com.placement.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CompanyRepository extends MongoRepository<Company, String> {
    Optional<Company> findByEmail(String email);
    Boolean existsByEmail(String email);
}
