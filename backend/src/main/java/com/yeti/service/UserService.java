package com.yeti.service;

import com.yeti.model.User;
import com.yeti.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user.
     *
     * @param user The user object containing registration details.
     * @return The registered user with an encoded password.
     * @throws IllegalArgumentException if a user with the given email already exists.
     */
    @Transactional
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with email " + user.getEmail() + " already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Set default role if not provided, or ensure a role is set
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER"); // Default role for new registrations
        }
        return userRepository.save(user);
    }

    /**
     * Finds a user by their email address.
     *
     * @param email The email address of the user.
     * @return An Optional containing the user if found, or empty otherwise.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Finds a user by their ID.
     *
     * @param id The ID of the user.
     * @return An Optional containing the user if found, or empty otherwise.
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Updates an existing user's profile information.
     *
     * @param userId The ID of the user to update.
     * @param updatedUser The user object containing the new profile details.
     * @return The updated user.
     * @throws IllegalArgumentException if the user with the given ID is not found.
     */
    @Transactional
    public User updateUserProfile(Long userId, User updatedUser) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            // Email update might require re-verification, handle carefully in a real app
            // For simplicity, we allow it here, but a separate flow might be better.
            if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
                if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                    throw new IllegalArgumentException("Email " + updatedUser.getEmail() + " is already taken by another user.");
                }
                existingUser.setEmail(updatedUser.getEmail());
            }
            // Password update should be handled via a separate change password flow
            // For now, we don't update password here.
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));
    }

    /**
     * Updates a user's password.
     *
     * @param userId The ID of the user.
     * @param newPassword The new password.
     * @return The updated user.
     * @throws IllegalArgumentException if the user is not found.
     */
    @Transactional
    public User updatePassword(Long userId, String newPassword) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setPassword(passwordEncoder.encode(newPassword));
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));
    }
}