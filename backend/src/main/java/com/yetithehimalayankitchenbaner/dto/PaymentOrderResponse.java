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
public class PaymentOrderResponse {
    private String razorpayOrderId;
    private java.math.BigDecimal amount;
    private String currency;
    private String receipt;
    private String key;
}
