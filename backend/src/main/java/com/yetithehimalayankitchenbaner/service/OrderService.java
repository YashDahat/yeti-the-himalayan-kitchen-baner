package com.yetithehimalayankitchenbaner.service;

import com.yetithehimalayankitchenbaner.repository.OrderRepository;
import com.yetithehimalayankitchenbaner.repository.OrderItemRepository;
import com.yetithehimalayankitchenbaner.model.Order;
import com.yetithehimalayankitchenbaner.model.OrderItem;
import com.yetithehimalayankitchenbaner.model.OrderStatus;
import com.yetithehimalayankitchenbaner.model.MenuItem; // Assuming MenuItem is needed for price/name
import com.yetithehimalayankitchenbaner.model.User; // Assuming UserService returns User
import com.yetithehimalayankitchenbaner.dto.CreateOrderRequest;
import com.yetithehimalayankitchenbaner.dto.OrderResponse;
import com.yetithehimalayankitchenbaner.dto.OrderItemResponse;
import com.yetithehimalayankitchenbaner.dto.OrderItemRequest;
import com.yetithehimalayankitchenbaner.dto.MenuItemDto; // From menu-backend
import com.yetithehimalayankitchenbaner.dto.PaymentOrderResponse; // From payment-backend
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.yetithehimalayankitchenbaner.service.UserService;
import com.yetithehimalayankitchenbaner.service.MenuService;
import com.yetithehimalayankitchenbaner.service.PaymentService;
import com.yetithehimalayankitchenbaner.model.User;
import com.yetithehimalayankitchenbaner.dto.MenuItemDto;
import com.yetithehimalayankitchenbaner.dto.PaymentOrderResponse;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserService userService; // Assuming this service exists
    private final MenuService menuService; // Assuming this service exists
    private final PaymentService paymentService; // Assuming this service exists

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        UserService userService,
                        MenuService menuService,
                        PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userService = userService;
        this.menuService = menuService;
        this.paymentService = paymentService;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, UUID userId) {
        // 1. Validate that the userId exists
        // Assuming userService.loadUserByUsername returns a User object or null if not found
        // The User model implements UserDetails, so this is consistent with typical Spring Security usage.
        User user = (User) userService.loadUserByUsername(userId.toString());
        if (user == null) {
            throw new ResourceNotFoundException("User with ID " + userId + " not found.");
        }

        // 2. Initialize totalAmount
        BigDecimal totalAmount = BigDecimal.ZERO;

        // 3. Create a new Order entity
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setContactPhone(request.getContactPhone());
        order.setNotes(request.getNotes());

        // 4. Create a List<OrderItem> to store the order items
        List<OrderItem> orderItems = new java.util.ArrayList<>();

        // 5. For each OrderItemRequest in request.getOrderItems():
        for (OrderItemRequest itemRequest : request.getOrderItems()) {
            // a. Call menuService.getMenuItemById()
            MenuItemDto menuItemDto = menuService.getMenuItemById(itemRequest.getMenuItemId());
            // b. If MenuItemDto is not found, throw ResourceNotFoundException
            if (menuItemDto == null) {
                throw new ResourceNotFoundException("Menu item with ID " + itemRequest.getMenuItemId() + " not found.");
            }
            // c. If itemRequest.getQuantity() is less than 1, throw IllegalArgumentException
            if (itemRequest.getQuantity() < 1) {
                throw new IllegalArgumentException("Quantity for menu item " + menuItemDto.getName() + " must be at least 1.");
            }
            // d. Calculate the item's subtotal
            BigDecimal itemSubtotal = menuItemDto.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            // e. Add the item's subtotal to totalAmount
            totalAmount = totalAmount.add(itemSubtotal);

            // f. Create an OrderItem entity
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order); // Link to the current order
            orderItem.setMenuItemId(itemRequest.getMenuItemId());
            orderItem.setMenuItemName(menuItemDto.getName()); // Denormalized name
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtOrder(menuItemDto.getPrice()); // Price at the time of order

            // g. Add the OrderItem to the list
            orderItems.add(orderItem);
        }

        // 6. Set order.setTotalAmount(totalAmount)
        order.setTotalAmount(totalAmount);
        // 7. Set order.setOrderItems(orderItems)
        order.setOrderItems(orderItems);

        // 8. Save the Order entity
        Order savedOrder = orderRepository.save(order);

        // 9. Call paymentService.createPaymentOrder
        // This call is for initiating payment, but the OrderResponse doesn't include payment details.
        // We just make the call as specified.
        PaymentOrderResponse paymentResponse = paymentService.createPaymentOrder(savedOrder.getId(), totalAmount);

        // 10. Map the saved Order and its OrderItems to an OrderResponse DTO
        // 11. Return the OrderResponse
        return toOrderResponse(savedOrder);
    }

    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found."));
        return toOrderResponse(order);
    }

    public List<OrderResponse> getOrdersByUserId(UUID userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found."));

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return toOrderResponse(updatedOrder);
    }

    @Transactional
    public OrderResponse cancelOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " not found."));

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order cannot be cancelled in its current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order cancelledOrder = orderRepository.save(order);
        return toOrderResponse(cancelledOrder);
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::toOrderItemResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .contactPhone(order.getContactPhone())
                .notes(order.getNotes())
                .orderItems(itemResponses)
                .build();
    }

    private OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        return OrderItemResponse.builder()
                .orderItemId(orderItem.getId())
                .menuItemId(orderItem.getMenuItemId())
                .menuItemName(orderItem.getMenuItemName())
                .quantity(orderItem.getQuantity())
                .priceAtOrder(orderItem.getPriceAtOrder())
                .build();
    }
}