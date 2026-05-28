package com.yeti.repository;

import com.yeti.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Finds all reservations for a specific date.
     * @param reservationDate The date of the reservation.
     * @return A list of reservations on the given date.
     */
    List<Reservation> findByReservationDate(LocalDate reservationDate);

    /**
     * Finds all reservations for a specific user.
     * @param userId The ID of the user.
     * @return A list of reservations made by the user.
     */
    List<Reservation> findByUserId(Long userId);

    /**
     * Finds reservations by date and time, ordered by time.
     * @param reservationDate The date of the reservation.
     * @param reservationTime The time of the reservation.
     * @return A list of reservations matching the date and time.
     */
    List<Reservation> findByReservationDateAndReservationTime(LocalDate reservationDate, LocalTime reservationTime);

    /**
     * Finds reservations by date and time range.
     * @param reservationDate The date of the reservation.
     * @param startTime The start time of the range.
     * @param endTime The end time of the range.
     * @return A list of reservations within the specified date and time range.
     */
    List<Reservation> findByReservationDateAndReservationTimeBetween(LocalDate reservationDate, LocalTime startTime, LocalTime endTime);
}