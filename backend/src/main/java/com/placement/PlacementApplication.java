package com.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlacementApplication {
    public static void main(String[] args) {
        // Fix for MongoDB Atlas Free Tier SSL handshake error in Java 21
        System.setProperty("jdk.tls.client.protocols", "TLSv1.2");
        SpringApplication.run(PlacementApplication.class, args);
    }
}
