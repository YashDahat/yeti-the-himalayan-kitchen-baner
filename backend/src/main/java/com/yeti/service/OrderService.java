package com.yeti.service;

import com.yeti.model.Order;
import com.yeti.model.OrderItem;
import com.yeti.model.MenuItem;
import com.yeti.model.User;
import com.yeti.model.Order.OrderStatus;
import com.yeti.model.Order.OrderType;
import com.yeti.model.Order.PaymentStatus;
import com.yeti.repository.MenuItemRepository;
import com.yeti.repository.OrderRepository;
import com.yeti.repository.UserRepository;
import com.yeti.dto.OrderCreateRequest;
import com.yeti.dto.OrderItemRequest;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new order based on the provided request.
     *
     * @param request The DTO containing order details.
     * @param userId The ID of the user placing the order.
     * @return The created Order entity.
     * @throws EntityNotFoundException if the user or any menu item is not found.
     * @throws IllegalArgumentException if order items are empty or quantities are invalid.
     */
    @Transactional
    public Order createOrder(OrderCreateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING); // Initial status
        order.setPaymentStatus(PaymentStatus.PENDING); // Initial payment status
        order.setOrderType(request.orderType());
        order.setDeliveryAddress(request.deliveryAddress()); // Can be null for TAKEAWAY

        BigDecimal totalAmount = BigDecimal.ZERO;
        Set<OrderItem> orderItems = new HashSet<>();

        for (OrderItemRequest itemRequest : request.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.menuItemId())
                    .orElseThrow(() -> new EntityNotFoundException("Menu item not found with ID: " + itemRequest.menuItemId()));

            if (itemRequest.quantity() <= 0) {
                throw new IllegalArgumentException("Quantity for menu item " + menuItem.getName() + " must be positive.");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPriceAtOrder(menuItem.getPrice()); // Capture price at the time of order
            orderItems.add(orderItem);

            totalAmount = totalAmount.add(menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    /**
     * Retrieves an order by its ID.
     *
     * @param orderId The ID of the order to retrieve.
     * @return The Order entity.
     * @throws EntityNotFoundException if the order is not found.
     */
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
    }

    /**
     * Retrieves all orders for a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of Order entities.
     * @throws EntityNotFoundException if the user is not found.
     */
    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return orderRepository.findByUser(user);
    }

    /**
     * Retrieves all orders in the system. (Typically for administrative use)
     *
     * @return A list of all Order entities.
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Updates the status of an existing order.
     *
     * @param orderId The ID of the order to update.
     * @param newStatus The new status for the order.
     * @return The updated Order entity.
     * @throws EntityNotFoundException if the order is not found.
     */
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Confirms the payment for an order, updating its payment status and payment ID.
     *
     * @param orderId The ID of the order to confirm payment for.
     * @param paymentId The payment gateway transaction ID (e.g., Razorpay payment ID).
     * @return The updated Order entity.
     * @throws EntityNotFoundException if the order is not found.
     * @throws IllegalStateException if the order is not in a PENDING payment status.
     */
    @Transactional
    public Order confirmOrderPayment(Long orderId, String paymentId) {
        Order order = getOrderById(orderId);

        if (order.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment for order " + orderId + " is not in PENDING status.");
        }

        order.setPaymentId(paymentId);
        order.setPaymentStatus(PaymentStatus.PAID);
        // Optionally, update order status to CONFIRMED if payment is successful
        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
        }
        return orderRepository.save(order);
    }

    /**
     * Marks an order's payment as failed.
     *
     * @param orderId The ID of the order.
     * @return The updated Order entity.
     * @throws EntityNotFoundException if the order is not found.
     */
    @Transactional
    public Order failOrderPayment(Long orderId) {
        Order order = getOrderById(orderId);
        order.setPaymentStatus(PaymentStatus.FAILED);
        // Optionally, set order status to CANCELLED or keep PENDING for retry
        // For now, let's keep it PENDING if payment failed, allowing user to retry
        return orderRepository.save(order);
    }
}