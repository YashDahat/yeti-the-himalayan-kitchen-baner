package com.yeti.service;

import com.yeti.model.Reservation;
import com.yeti.model.ReservationStatus;
import com.yeti.model.User;
import com.yeti.repository.ReservationRepository;
import com.yeti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository; // To link reservations to users if needed

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new table reservation.
     *
     * @param reservation The reservation object to create.
     * @return The created reservation.
     * @throws IllegalArgumentException if reservation details are invalid (e.g., past time, invalid party size).
     */
    @Transactional
    public Reservation createReservation(Reservation reservation) {
        // Basic validation
        if (reservation.getReservationTime() == null || reservation.getReservationTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reservation time must be in the future.");
        }
        if (reservation.getPartySize() == null || reservation.getPartySize() <= 0) {
            throw new IllegalArgumentException("Party size must be a positive number.");
        }
        if (reservation.getCustomerName() == null || reservation.getCustomerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer name cannot be empty.");
        }
        if (reservation.getCustomerEmail() == null || reservation.getCustomerEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Customer email cannot be empty.");
        }

        // Set initial status
        if (reservation.getStatus() == null) {
            reservation.setStatus(ReservationStatus.PENDING);
        }

        // If a user ID is provided, link the user
        if (reservation.getUser() != null && reservation.getUser().getId() != null) {
            User user = userRepository.findById(reservation.getUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + reservation.getUser().getId()));
            reservation.setUser(user);
        } else {
            reservation.setUser(null); // Ensure no detached user is set if not explicitly linked
        }

        return reservationRepository.save(reservation);
    }

    /**
     * Retrieves a reservation by its ID.
     *
     * @param id The ID of the reservation.
     * @return An Optional containing the reservation if found, or empty otherwise.
     */
    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    /**
     * Retrieves all reservations.
     *
     * @return A list of all reservations.
     */
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    /**
     * Retrieves all reservations for a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of reservations made by the user.
     * @throws IllegalArgumentException if the user is not found.
     */
    public List<Reservation> getReservationsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return reservationRepository.findByUser(user);
    }

    /**
     * Updates an existing reservation.
     *
     * @param id                The ID of the reservation to update.
     * @param updatedReservation The reservation object with updated details.
     * @return The updated reservation.
     * @throws com.yeti.exception.ResourceNotFoundException if the reservation is not found.
     * @throws IllegalArgumentException if the reservation cannot be updated due to its current status or invalid data.
     */
    @Transactional
    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new com.yeti.exception.ResourceNotFoundException("Reservation not found with ID: " + id));

        // Only allow updates if the reservation is PENDING or CONFIRMED
        if (existingReservation.getStatus() == ReservationStatus.CANCELLED ||
            existingReservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot update a reservation that is already " + existingReservation.getStatus());
        }

        // Update fields
        if (updatedReservation.getReservationTime() != null) {
            if (updatedReservation.getReservationTime().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Reservation time must be in the future.");
            }
            existingReservation.setReservationTime(updatedReservation.getReservationTime());
        }
        if (updatedReservation.getPartySize() != null) {
            if (updatedReservation.getPartySize() <= 0) {
                throw new IllegalArgumentException("Party size must be a positive number.");
            }
            existingReservation.setPartySize(updatedReservation.getPartySize());
        }
        if (updatedReservation.getCustomerName() != null && !updatedReservation.getCustomerName().trim().isEmpty()) {
            existingReservation.setCustomerName(updatedReservation.getCustomerName());
        }
        if (updatedReservation.getCustomerEmail() != null && !updatedReservation.getCustomerEmail().trim().isEmpty()) {
            existingReservation.setCustomerEmail(updatedReservation.getCustomerEmail());
        }
        if (updatedReservation.getCustomerPhone() != null) {
            existingReservation.setCustomerPhone(updatedReservation.getCustomerPhone());
        }
        if (updatedReservation.getSpecialRequests() != null) {
            existingReservation.setSpecialRequests(updatedReservation.getSpecialRequests());
        }
        // Status can be updated by an admin, but not typically by a user directly through this method
        // For user-initiated updates, status changes should be handled by specific methods like cancelReservation
        if (updatedReservation.getStatus() != null) {
            existingReservation.setStatus(updatedReservation.getStatus());
        }

        return reservationRepository.save(existingReservation);
    }

    /**
     * Cancels a reservation.
     *
     * @param id The ID of the reservation to cancel.
     * @return The cancelled reservation.
     * @throws com.yeti.exception.ResourceNotFoundException if the reservation is not found.
     * @throws IllegalArgumentException if the reservation cannot be cancelled due to its current status.
     */
    @Transactional
    public Reservation cancelReservation(Long id) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new com.yeti.exception.ResourceNotFoundException("Reservation not found with ID: " + id));

        if (existingReservation.getStatus() == ReservationStatus.CANCELLED ||
            existingReservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot cancel a reservation that is already " + existingReservation.getStatus());
        }

        existingReservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(existingReservation);
    }

    /**
     * Confirms a reservation (typically by an admin).
     *
     * @param id The ID of the reservation to confirm.
     * @return The confirmed reservation.
     * @throws com.yeti.exception.ResourceNotFoundException if the reservation is not found.
     * @throws IllegalArgumentException if the reservation cannot be confirmed due to its current status.
     */
    @Transactional
    public Reservation confirmReservation(Long id) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new com.yeti.exception.ResourceNotFoundException("Reservation not found with ID: " + id));

        if (existingReservation.getStatus() == ReservationStatus.CANCELLED ||
            existingReservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot confirm a reservation that is already " + existingReservation.getStatus());
        }
        if (existingReservation.getStatus() == ReservationStatus.CONFIRMED) {
            return existingReservation; // Already confirmed
        }

        existingReservation.setStatus(ReservationStatus.CONFIRMED);
        return reservationRepository.save(existingReservation);
    }

    /**
     * Marks a reservation as completed (typically after the reservation time has passed).
     *
     * @param id The ID of the reservation to complete.
     * @return The completed reservation.
     * @throws com.yeti.exception.ResourceNotFoundException if the reservation is not found.
     * @throws IllegalArgumentException if the reservation cannot be completed due to its current status.
     */
    @Transactional
    public Reservation completeReservation(Long id) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new com.yeti.exception.ResourceNotFoundException("Reservation not found with ID: " + id));

        if (existingReservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot complete a cancelled reservation.");
        }
        if (existingReservation.getStatus() == ReservationStatus.COMPLETED) {
            return existingReservation; // Already completed
        }

        existingReservation.setStatus(ReservationStatus.COMPLETED);
        return reservationRepository.save(existingReservation);
    }
}