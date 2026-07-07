package com.yetithehimalayankitchenbaner.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private UUID orderItemId;
    private UUID menuItemId;
    private String menuItemName;
    private int quantity;
    private BigDecimal priceAtOrder;
}
