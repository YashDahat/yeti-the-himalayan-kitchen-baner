package com.yetithehimalayankitchenbaner.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.yetithehimalayankitchenbaner.model.OrderStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private UUID id;
    private UUID userId;
    private java.time.LocalDateTime orderDate;
    private java.math.BigDecimal totalAmount;
    private com.yetithehimalayankitchenbaner.model.OrderStatus status;
    private String deliveryAddress;
    private String contactPhone;
    private String notes;
    private List<OrderItemResponse> orderItems;
}
