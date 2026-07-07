package com.yetithehimalayankitchenbaner.service;

import com.yetithehimalayankitchenbaner.dto.OrderResponse;
import com.yetithehimalayankitchenbaner.dto.PaymentOrderResponse;
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import com.yetithehimalayankitchenbaner.model.OrderStatus;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import com.yetithehimalayankitchenbaner.service.OrderService;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final OrderService orderService;

    @Autowired
    public PaymentService(OrderService orderService) {
        this.orderService = orderService;
    }

    @Transactional
    public PaymentOrderResponse createPaymentOrder(UUID orderId, BigDecimal amount) {
        OrderResponse order = orderService.getOrderById(orderId);

        if (order == null) {
            throw new ResourceNotFoundException("Order not found with ID: " + orderId);
        }

        // Ensure the amount from frontend matches the actual order total
        if (order.getTotalAmount() != null && order.getTotalAmount().compareTo(amount) != 0) {
            throw new IllegalArgumentException("Amount mismatch for order ID: " + orderId);
        }

        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            // Razorpay amounts are in the smallest currency unit (e.g., paise for INR)
            orderRequest.put("amount", amount.multiply(new BigDecimal("100")).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", orderId.toString()); // Our internal order ID as receipt
            orderRequest.put("payment_capture", 1); // Auto capture payment

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            return PaymentOrderResponse.builder()
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .amount(amount)
                    .currency(razorpayOrder.get("currency"))
                    .receipt(razorpayOrder.get("receipt"))
                    .key(razorpayKeyId)
                    .build();

        } catch (RazorpayException e) {
            // Log the exception for debugging
            System.err.println("Error creating Razorpay order: " + e.getMessage());
            throw new RuntimeException("Failed to create payment order with Razorpay: " + e.getMessage(), e);
        }
    }

    @Transactional
    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);
            boolean isSignatureValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if (isSignatureValid) {
                // Fetch the Razorpay order to get our internal orderId from the receipt
                RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                com.razorpay.Order fetchedRazorpayOrder = razorpayClient.orders.fetch(razorpayOrderId);
                String receipt = fetchedRazorpayOrder.get("receipt");
                UUID internalOrderId = UUID.fromString(receipt);

                orderService.updateOrderStatus(internalOrderId, OrderStatus.CONFIRMED);
                return true;
            } else {
                System.err.println("Invalid Razorpay payment signature for order ID: " + razorpayOrderId);
                return false;
            }
        } catch (RazorpayException e) {
            System.err.println("Error verifying Razorpay payment signature or fetching order: " + e.getMessage());
            // Depending on policy, you might want to throw a specific exception here
            return false;
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid UUID format in receipt from Razorpay order: " + e.getMessage());
            return false;
        } catch (ResourceNotFoundException e) {
            System.err.println("Order not found during payment verification for receipt: " + e.getMessage());
            return false;
        }
    }
}