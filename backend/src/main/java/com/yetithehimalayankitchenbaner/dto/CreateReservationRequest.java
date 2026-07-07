package com.yetithehimalayankitchenbaner.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReservationRequest {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private java.time.LocalDate reservationDate;
    private java.time.LocalTime reservationTime;
    private Integer numberOfGuests;
    private String specialRequests;
}
