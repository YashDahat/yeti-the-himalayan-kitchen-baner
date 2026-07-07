package com.yetithehimalayankitchenbaner.repository;

import com.yetithehimalayankitchenbaner.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    List<Reservation> findByReservationDateBetween(LocalDate startDate, LocalDate endDate);
}