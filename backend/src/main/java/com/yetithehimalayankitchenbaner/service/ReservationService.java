package com.yetithehimalayankitchenbaner.service;

import com.yetithehimalayankitchenbaner.repository.ReservationRepository;
import com.yetithehimalayankitchenbaner.model.Reservation;
import com.yetithehimalayankitchenbaner.model.ReservationStatus;
import com.yetithehimalayankitchenbaner.dto.CreateReservationRequest;
import com.yetithehimalayankitchenbaner.dto.ReservationResponse;
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public ReservationResponse createReservation(CreateReservationRequest request) {
        LocalDateTime requestedDateTime = LocalDateTime.of(request.getReservationDate(), request.getReservationTime());
        if (requestedDateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reservation date and time cannot be in the past.");
        }

        Reservation reservation = new Reservation();
        reservation.setCustomerName(request.getCustomerName());
        reservation.setCustomerEmail(request.getCustomerEmail());
        reservation.setCustomerPhone(request.getCustomerPhone());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        Reservation savedReservation = reservationRepository.save(reservation);
        return mapToReservationResponse(savedReservation);
    }

    public ReservationResponse getReservationById(UUID id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));
        return mapToReservationResponse(reservation);
    }

    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservationsByDateRange(LocalDate startDate, LocalDate endDate) {
        return reservationRepository.findByReservationDateBetween(startDate, endDate).stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }

    public ReservationResponse updateReservationStatus(UUID id, ReservationStatus newStatus) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

        reservation.setStatus(newStatus);
        reservation.setUpdatedAt(LocalDateTime.now());

        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToReservationResponse(updatedReservation);
    }

    public void deleteReservation(UUID id) {
        if (!reservationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reservation not found with ID: " + id);
        }
        reservationRepository.deleteById(id);
    }

    private ReservationResponse mapToReservationResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .customerName(reservation.getCustomerName())
                .customerEmail(reservation.getCustomerEmail())
                .customerPhone(reservation.getCustomerPhone())
                .reservationDate(reservation.getReservationDate())
                .reservationTime(reservation.getReservationTime())
                .numberOfGuests(reservation.getNumberOfGuests())
                .status(reservation.getStatus())
                .specialRequests(reservation.getSpecialRequests())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }
}