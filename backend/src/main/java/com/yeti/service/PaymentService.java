package com.yeti.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.yeti.exception.PaymentProcessingException;
import com.yeti.model.OrderStatus;
import com.yeti.repository.OrderRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {

    private final String razorpayKeyId;
    private final String razorpayKeySecret;
    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;

    public PaymentService(OrderRepository orderRepository,
                          @Value("${razorpay.key.id}") String razorpayKeyId,
                          @Value("${razorpay.key.secret}") String razorpayKeySecret) throws RazorpayException {
        this.orderRepository = orderRepository;
        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    /**
     * Creates a new Razorpay order for a given application order.
     * The amount is converted to the smallest currency unit (paise for INR).
     *
     * @param orderId The ID of the application's order.
     * @return A map containing Razorpay order details (id, amount, currency, status, key_id).
     * @throws PaymentProcessingException if the order is not found or there's an issue creating the Razorpay order.
     */
    public Map<String, Object> createRazorpayOrder(Long orderId) throws PaymentProcessingException {
        Optional<com.yeti.model.Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new PaymentProcessingException("Order not found with ID: " + orderId);
        }
        com.yeti.model.Order appOrder = optionalOrder.get();

        // Razorpay amount is in the smallest currency unit (e.g., paise for INR)
        // Convert BigDecimal amount to long in paise
        long amountInPaise = appOrder.getTotalAmount().multiply(new BigDecimal("100")).longValue();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise); // amount in smallest currency unit
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_rcptid_" + appOrder.getId());
        orderRequest.put("payment_capture", 1); // Auto capture payment

        try {
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            // Update the application's order with Razorpay order ID
            appOrder.setRazorpayOrderId(razorpayOrder.get("id"));
            appOrder.setOrderStatus(OrderStatus.PENDING_PAYMENT); // Set status to pending payment
            orderRepository.save(appOrder);

            Map<String, Object> response = new HashMap<>();
            response.put("id", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));
            response.put("status", razorpayOrder.get("status"));
            response.put("key_id", razorpayKeyId); // Send key_id to frontend for checkout

            return response;
        } catch (RazorpayException e) {
            throw new PaymentProcessingException("Failed to create Razorpay order for application order ID " + orderId + ": " + e.getMessage(), e);
        }
    }

    /**
     * Verifies the Razorpay payment signature received from the frontend webhook/callback.
     * If the signature is valid, the application's order status is updated to PAID.
     *
     * @param razorpayOrderId The order ID received from Razorpay.
     * @param razorpayPaymentId The payment ID received from Razorpay.
     * @param razorpaySignature The signature received from Razorpay.
     * @return true if the signature is valid and payment is processed, false otherwise.
     * @throws PaymentProcessingException if there's an issue during signature verification or order update.
     */
    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws PaymentProcessingException {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isSignatureValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isSignatureValid) {
                // Find the application's order by Razorpay Order ID and update its status
                Optional<com.yeti.model.Order> optionalOrder = orderRepository.findByRazorpayOrderId(razorpayOrderId);
                if (optionalOrder.isPresent()) {
                    com.yeti.model.Order appOrder = optionalOrder.get();
                    appOrder.setRazorpayPaymentId(razorpayPaymentId); // Store payment ID
                    appOrder.setOrderStatus(OrderStatus.PAID); // Mark as paid
                    orderRepository.save(appOrder);
                } else {
                    // Log or handle case where Razorpay order ID doesn't match an internal order
                    throw new PaymentProcessingException("No application order found for Razorpay Order ID: " + razorpayOrderId);
                }
            }
            return isSignatureValid;
        } catch (RazorpayException e) {
            throw new PaymentProcessingException("Failed to verify Razorpay payment signature: " + e.getMessage(), e);
        }
    }

    /**
     * Fetches a Razorpay payment by its ID directly from Razorpay.
     * This can be used to check the status of a payment directly with Razorpay for reconciliation or status updates.
     *
     * @param paymentId The Razorpay payment ID.
     * @return A map containing payment details.
     * @throws PaymentProcessingException if the payment cannot be fetched.
     */
    public Map<String, Object> fetchPayment(String paymentId) throws PaymentProcessingException {
        try {
            com.razorpay.Payment payment = razorpayClient.payments.fetch(paymentId);
            return payment.toMap();
        } catch (RazorpayException e) {
            throw new PaymentProcessingException("Failed to fetch Razorpay payment with ID " + paymentId + ": " + e.getMessage(), e);
        }
    }
}