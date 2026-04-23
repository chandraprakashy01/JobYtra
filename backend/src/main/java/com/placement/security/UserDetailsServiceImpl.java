package com.placement.security;

import com.placement.model.Admin;
import com.placement.model.Company;
import com.placement.model.Student;
import com.placement.repository.AdminRepository;
import com.placement.repository.CompanyRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check student
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            return new UserDetailsImpl(student.get().getId(), student.get().getEmail(), student.get().getPassword(), student.get().getRole());
        }

        // Check company
        Optional<Company> company = companyRepository.findByEmail(email);
        if (company.isPresent()) {
            return new UserDetailsImpl(company.get().getId(), company.get().getEmail(), company.get().getPassword(), company.get().getRole());
        }

        // Check admin
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return new UserDetailsImpl(admin.get().getId(), admin.get().getEmail(), admin.get().getPassword(), admin.get().getRole());
        }

        throw new UsernameNotFoundException("User Not Found with email: " + email);
    }
}
