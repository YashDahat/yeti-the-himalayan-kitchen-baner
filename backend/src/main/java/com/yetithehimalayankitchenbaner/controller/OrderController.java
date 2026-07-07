package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.CreateOrderRequest;
import com.yetithehimalayankitchenbaner.dto.OrderResponse;
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import com.yetithehimalayankitchenbaner.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        // Extract userId from AuthenticationPrincipal UserDetails.
        // Given OrderService.createOrder expects a UUID userId, and UserDetails.getUsername()
        // is the primary identifier, we assume it provides a string representation of the UUID.
        // This is a necessary interpretation to reconcile the types in the provided dependencies.
        UUID userId = UUID.fromString(principal.getUsername());
        OrderResponse orderResponse = orderService.createOrder(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderResponse);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrdersByUserId(
            @AuthenticationPrincipal UserDetails principal) {
        // Extract userId from AuthenticationPrincipal UserDetails.
        // Assuming principal.getUsername() returns a string that can be parsed as a UUID.
        UUID userId = UUID.fromString(principal.getUsername());
        List<OrderResponse> orderResponses = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable UUID orderId,
            @AuthenticationPrincipal UserDetails principal) {
        // Extract userId from AuthenticationPrincipal UserDetails.
        // Assuming principal.getUsername() returns a string that can be parsed as a UUID.
        UUID authenticatedUserId = UUID.fromString(principal.getUsername());

        OrderResponse orderResponse = orderService.getOrderById(orderId);

        // Ensure the order belongs to the authenticated customer.
        if (!orderResponse.getUserId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You are not authorized to view this order.");
        }
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable UUID orderId,
            @AuthenticationPrincipal UserDetails principal) {
        // Extract userId from AuthenticationPrincipal UserDetails.
        // Assuming principal.getUsername() returns a string that can be parsed as a UUID.
        UUID authenticatedUserId = UUID.fromString(principal.getUsername());

        OrderResponse orderResponse = orderService.getOrderById(orderId);

        // Ensure the order belongs to the authenticated customer.
        if (!orderResponse.getUserId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You are not authorized to cancel this order.");
        }

        OrderResponse updatedOrderResponse = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(updatedOrderResponse);
    }
}