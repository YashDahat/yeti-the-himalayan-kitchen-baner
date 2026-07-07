package com.yetithehimalayankitchenbaner.config;

import com.yetithehimalayankitchenbaner.model.Role;
import com.yetithehimalayankitchenbaner.model.User;
import com.yetithehimalayankitchenbaner.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserService userService;

    public AdminInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        final String adminEmail = "admin@example.com";
        final String adminPassword = "adminpass"; // This password will be encoded by UserService

        try {
            userService.loadUserByUsername(adminEmail);
            log.info("Admin user '{}' already exists.", adminEmail);
        } catch (UsernameNotFoundException e) {
            log.info("Creating initial admin user '{}'...", adminEmail);
            User adminUser = new User(adminEmail, adminPassword, Role.ADMIN);
            userService.registerUser(adminUser);
            log.info("Admin user '{}' created successfully.", adminEmail);
        }
    }
}