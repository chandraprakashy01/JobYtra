package com.placement.security;

import com.placement.model.Admin;
import com.placement.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        java.util.Optional<Admin> existingAdmin = adminRepository.findByEmail("Abc@gmail.com");
        Admin admin = existingAdmin.orElse(new Admin());
        admin.setEmail("Abc@gmail.com");
        admin.setPassword(passwordEncoder.encode("Abc@123"));
        admin.setRole("ROLE_ADMIN");
        adminRepository.save(admin);
        System.out.println("Default admin user ensured: Abc@gmail.com / Abc@123");
    }
}
