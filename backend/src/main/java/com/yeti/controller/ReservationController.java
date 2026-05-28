package com.yeti.controller;

import com.yeti.dto.ReservationRequest;
import com.yeti.dto.ReservationResponse;
import com.yeti.model.Reservation;
import com.yeti.model.User;
import com.yeti.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller to manage creating and confirming table reservations.
 * Provides endpoints for users to create and view their reservations,
 * and for administrators to view, confirm, and cancel any reservation.
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /**
     * Helper method to retrieve the ID of the currently authenticated user.
     *
     * @return The ID of the authenticated user.
     * @throws IllegalStateException if the user is not authenticated or the principal is not a User object.
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return ((User) authentication.getPrincipal()).getId();
        }
        throw new IllegalStateException("User not authenticated or principal is not a User object.");
    }

    /**
     * Helper method to check if the currently authenticated user has ADMIN role.
     *
     * @return true if the user is an admin, false otherwise.
     */
    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    /**
     * Creates a new table reservation.
     * Accessible by authenticated users.
     * The user ID is automatically retrieved from the security context.
     *
     * @param request The reservation details provided in the request body.
     * @return A {@link ResponseEntity} containing the created {@link ReservationResponse} and HTTP status 201 (Created).
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        Long userId = getCurrentUserId();
        Reservation newReservation = reservationService.createReservation(
                userId,
                request.getReservationTime(),
                request.getNumberOfGuests(),
                request.getSpecialRequests(),
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getCustomerPhone()
        );
        return new ResponseEntity<>(new ReservationResponse(newReservation), HttpStatus.CREATED);
    }

    /**
     * Retrieves all reservations made by the authenticated user.
     * Accessible by authenticated users.
     *
     * @return A {@link ResponseEntity} containing a list of {@link ReservationResponse} for the user and HTTP status 200 (OK).
     */
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationResponse>> getMyReservations() {
        Long userId = getCurrentUserId();
        List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
        List<ReservationResponse> responseList = reservations.stream()
                .map(ReservationResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    /**
     * Retrieves a specific reservation by its ID.
     * Accessible by authenticated users if it's their reservation, or by ADMINs.
     *
     * @param id The ID of the reservation to retrieve.
     * @return A {@link ResponseEntity} containing the {@link ReservationResponse} if found and authorized,
     *         or HTTP status 404 (Not Found) if not found, or 403 (Forbidden) if not authorized.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable Long id) {
        Long currentUserId = getCurrentUserId();
        boolean admin = isAdmin();

        Optional<Reservation> reservationOptional = reservationService.getReservationByIdForUserOrAdmin(id, currentUserId, admin);

        return reservationOptional.map(reservation -> ResponseEntity.ok(new ReservationResponse(reservation)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Retrieves all reservations in the system.
     * Accessible only by users with the 'ADMIN' role.
     *
     * @return A {@link ResponseEntity} containing a list of all {@link ReservationResponse} and HTTP status 200 (OK).
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        List<ReservationResponse> responseList = reservations.stream()
                .map(ReservationResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    /**
     * Confirms a specific reservation.
     * Accessible only by users with the 'ADMIN' role.
     *
     * @param id The ID of the reservation to confirm.
     * @return A {@link ResponseEntity} containing the confirmed {@link ReservationResponse} and HTTP status 200 (OK),
     *         or 400 (Bad Request) if the reservation cannot be confirmed (e.g., not found, already confirmed).
     */
    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> confirmReservation(@PathVariable Long id) {
        try {
            Reservation confirmedReservation = reservationService.confirmReservation(id);
            return ResponseEntity.ok(new ReservationResponse(confirmedReservation));
        } catch (IllegalArgumentException e) {
            // Reservation not found or invalid state for confirmation
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Cancels a specific reservation.
     * Accessible by authenticated users if it's their reservation, or by ADMINs.
     *
     * @param id The ID of the reservation to cancel.
     * @return A {@link ResponseEntity} containing the cancelled {@link ReservationResponse} and HTTP status 200 (OK),
     *         or 403 (Forbidden) if not authorized, 404 (Not Found) if reservation does not exist,
     *         or 400 (Bad Request) if the reservation cannot be cancelled (e.g., already passed).
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationResponse> cancelReservation(@PathVariable Long id) {
        Long currentUserId = getCurrentUserId();
        boolean admin = isAdmin();
        try {
            Reservation cancelledReservation = reservationService.cancelReservation(id, currentUserId, admin);
            return ResponseEntity.ok(new ReservationResponse(cancelledReservation));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Not authorized to cancel
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build(); // Reservation not found or invalid state for cancellation
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}