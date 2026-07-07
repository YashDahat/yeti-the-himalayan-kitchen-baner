package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.OrderResponse;
import com.yetithehimalayankitchenbaner.model.OrderStatus;
import com.yetithehimalayankitchenbaner.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orderResponses = orderService.getAllOrders();
        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID orderId) {
        OrderResponse orderResponse = orderService.getOrderById(orderId);
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> statusUpdate) {
        String newStatusString = statusUpdate.get("status");
        if (newStatusString == null || newStatusString.trim().isEmpty()) {
            throw new IllegalArgumentException("Status field is required in the request body.");
        }
        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(newStatusString.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + newStatusString + ". Valid statuses are: " + java.util.Arrays.toString(OrderStatus.values()));
        }

        OrderResponse updatedOrderResponse = orderService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(updatedOrderResponse);
    }
}