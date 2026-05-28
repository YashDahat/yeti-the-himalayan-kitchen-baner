package com.yeti.controller;

import com.yeti.dto.AuthResponse;
import com.yeti.dto.LoginRequest;
import com.yeti.dto.RegisterRequest;
import com.yeti.model.User;
import com.yeti.security.JwtService;
import com.yeti.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller for handling user authentication, including registration and login.
 * Exposes endpoints for user registration and login, generating JWT tokens upon successful authentication.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Constructs an AuthController with necessary services.
     *
     * @param userService The service for user-related operations, including registration and loading user details.
     * @param jwtService The service for generating JSON Web Tokens.
     * @param authenticationManager The Spring Security AuthenticationManager for authenticating user credentials.
     */
    public AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Handles user registration.
     * Creates a new user account and, upon successful registration, generates a JWT token for the user.
     *
     * @param request The registration request containing user's name, email, and password.
     * @return A ResponseEntity containing an AuthResponse with the JWT token and user details.
     * @throws ResponseStatusException if registration fails due to invalid input (e.g., duplicate email) or server error.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Register the user using the UserService
            User registeredUser = userService.registerUser(request.getName(), request.getEmail(), request.getPassword());

            // After successful registration, load user details and generate a JWT token
            UserDetails userDetails = userService.loadUserByUsername(registeredUser.getEmail());
            String jwtToken = jwtService.generateToken(userDetails);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    AuthResponse.builder()
                            .token(jwtToken)
                            .message("User registered successfully")
                            .userEmail(registeredUser.getEmail())
                            .userName(registeredUser.getName())
                            .userRole(registeredUser.getRole().name())
                            .build()
            );
        } catch (IllegalArgumentException e) {
            // Catch specific exceptions like duplicate email from UserService
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            // Catch any other unexpected errors during registration
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Registration failed: " + e.getMessage());
        }
    }

    /**
     * Handles user login.
     * Authenticates user credentials and, upon successful authentication, generates a JWT token.
     *
     * @param request The login request containing user's email and password.
     * @return A ResponseEntity containing an AuthResponse with the JWT token and user details.
     * @throws ResponseStatusException if authentication fails (e.g., invalid credentials) or server error.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Authenticate the user using Spring Security's AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // If authentication is successful, retrieve user details and generate a JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(userDetails);

            // Fetch the full User object to get additional details like name and role for the response
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found after authentication."));

            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .token(jwtToken)
                            .message("Login successful")
                            .userEmail(user.getEmail())
                            .userName(user.getName())
                            .userRole(user.getRole().name())
                            .build()
            );
        } catch (AuthenticationException e) {
            // Handle specific authentication failures (e.g., bad credentials)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        } catch (Exception e) {
            // Catch any other unexpected errors during login
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Login failed: " + e.getMessage());
        }
    }
}