package com.yeti.controller;

import com.yeti.model.Order;
import com.yeti.model.OrderItem;
import com.yeti.model.User;
import com.yeti.service.OrderService;
import com.yeti.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller to handle creating and retrieving customer food orders.
 * Provides endpoints for authenticated users to place orders, view their own orders,
 * and for administrators to view all orders.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    /**
     * DTO for an item within an order creation request.
     */
    public record OrderItemRequest(
            @NotNull(message = "Menu item ID cannot be null")
            Long menuItemId,
            @Min(value = 1, message = "Quantity must be at least 1")
            int quantity
    ) {}

    /**
     * DTO for creating a new order.
     */
    public record CreateOrderRequest(
            @NotNull(message = "Order items cannot be null")
            List<OrderItemRequest> items,
            @NotBlank(message = "Delivery address cannot be blank")
            String deliveryAddress,
            @NotBlank(message = "Payment method cannot be blank")
            String paymentMethod // e.g., "RAZORPAY", "COD"
    ) {}

    /**
     * DTO for representing an order item in a response.
     */
    public record OrderItemResponse(
            Long orderItemId,
            Long menuItemId,
            String menuItemName,
            BigDecimal price,
            int quantity
    ) {
        public OrderItemResponse(OrderItem orderItem) {
            this(
                orderItem.getId(),
                orderItem.getMenuItem().getId(),
                orderItem.getMenuItem().getName(),
                orderItem.getPrice(),
                orderItem.getQuantity()
            );
        }
    }

    /**
     * DTO for representing an order in a response.
     */
    public record OrderResponse(
            Long orderId,
            Long userId,
            String userName,
            List<OrderItemResponse> items,
            BigDecimal totalAmount,
            String deliveryAddress,
            String status, // e.g., PENDING, CONFIRMED, DELIVERED, CANCELLED
            String paymentStatus, // e.g., PENDING, PAID, FAILED
            String paymentMethod,
            LocalDateTime orderDate
    ) {
        public OrderResponse(Order order) {
            this(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getOrderItems().stream().map(OrderItemResponse::new).collect(Collectors.toList()),
                order.getTotalAmount(),
                order.getDeliveryAddress(),
                order.getStatus().name(),
                order.getPaymentStatus().name(),
                order.getPaymentMethod(),
                order.getOrderDate()
            );
        }
    }

    /**
     * Creates a new food order for the authenticated user.
     *
     * @param request The order creation request containing items, delivery address, and payment method.
     * @param principal The authenticated user's principal.
     * @return A ResponseEntity containing the created order's details.
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request, Principal principal) {
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getName()));

        Order createdOrder = orderService.createOrder(user, request.items(), request.deliveryAddress(), request.paymentMethod());
        return new ResponseEntity<>(new OrderResponse(createdOrder), HttpStatus.CREATED);
    }

    /**
     * Retrieves a specific order by its ID.
     * Only the order owner or an ADMIN can access this.
     *
     * @param orderId The ID of the order to retrieve.
     * @param principal The authenticated user's principal.
     * @return A ResponseEntity containing the order's details.
     * @throws ResponseStatusException if the order is not found or the user does not have permission.
     */
    @GetMapping("/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId, Principal principal) {
        User currentUser = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getName()));

        Order order = orderService.getOrderById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found with ID: " + orderId));

        // Check if the current user is the owner of the order or has ADMIN role
        // Assuming User model has a getRoles() method that returns a collection of role names (e.g., Set<String>)
        if (!order.getUser().getId().equals(currentUser.getId()) && !currentUser.getRoles().contains("ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to view this order.");
        }

        return ResponseEntity.ok(new OrderResponse(order));
    }

    /**
     * Retrieves all orders placed by the authenticated user.
     *
     * @param principal The authenticated user's principal.
     * @return A ResponseEntity containing a list of the user's orders.
     */
    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Principal principal) {
        User user = userService.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getName()));

        List<Order> orders = orderService.getOrdersByUser(user);
        List<OrderResponse> orderResponses = orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderResponses);
    }

    /**
     * Retrieves all orders in the system.
     * This endpoint is restricted to users with the 'ADMIN' role.
     *
     * @return A ResponseEntity containing a list of all orders.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderResponse> orderResponses = orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderResponses);
    }
}