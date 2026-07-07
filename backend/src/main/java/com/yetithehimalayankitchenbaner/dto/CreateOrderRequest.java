package com.yetithehimalayankitchenbaner.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.yetithehimalayankitchenbaner.dto.OrderItemRequest;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private List<OrderItemRequest> orderItems;
    private String deliveryAddress;
    private String contactPhone;
    private String notes;
}
