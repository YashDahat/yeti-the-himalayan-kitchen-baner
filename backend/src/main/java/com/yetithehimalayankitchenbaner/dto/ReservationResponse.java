package com.yetithehimalayankitchenbaner.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.yetithehimalayankitchenbaner.model.ReservationStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private UUID id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private java.time.LocalDate reservationDate;
    private java.time.LocalTime reservationTime;
    private Integer numberOfGuests;
    private ReservationStatus status;
    private String specialRequests;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}
