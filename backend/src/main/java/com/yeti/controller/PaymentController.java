package com.yeti.controller;

import com.yeti.exception.PaymentException;
import com.yeti.exception.ResourceNotFoundException;
import com.yeti.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller to handle payment initiation and callbacks from Razorpay.
 * Exposes endpoints for initiating payments and processing Razorpay webhook notifications.
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    // Inject Razorpay Key ID from application properties.
    // This key ID is public and needed by the frontend to initialize the Razorpay checkout.
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    /**
     * Constructs a PaymentController with the necessary PaymentService.
     *
     * @param paymentService The service responsible for payment logic.
     */
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * DTO for initiating a payment request.
     */
    public record PaymentInitiateRequest(Long orderId) {}

    /**
     * DTO for the response after initiating a payment,
     * containing details needed by the frontend to open Razorpay checkout.
     */
    public record PaymentInitiateResponse(String razorpayOrderId, double amount, String currency, String razorpayKeyId) {}

    /**
     * Initiates a payment process for a given order.
     * The frontend calls this endpoint to get the Razorpay order details
     * before opening the Razorpay checkout popup.
     *
     * @param request Contains the order ID for which payment needs to be initiated.
     * @return ResponseEntity with Razorpay order details if successful, or an error status.
     */
    @PostMapping("/initiate")
    public ResponseEntity<PaymentInitiateResponse> initiatePayment(@RequestBody PaymentInitiateRequest request) {
        try {
            // Call the payment service to create a Razorpay order
            Map<String, Object> paymentDetails = paymentService.initiatePayment(request.orderId());

            // The amount returned from PaymentService is expected to be in INR (double)
            PaymentInitiateResponse response = new PaymentInitiateResponse(
                    (String) paymentDetails.get("razorpayOrderId"),
                    (double) paymentDetails.get("amount"),
                    (String) paymentDetails.get("currency"),
                    razorpayKeyId
            );
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            // If the specified order is not found
            System.err.println("Payment initiation failed: Order not found for ID " + request.orderId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (PaymentException e) {
            // Specific payment-related errors (e.g., order already paid, invalid amount, Razorpay API error)
            System.err.println("Payment initiation failed for order " + request.orderId() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Return 400 with no body or a specific error DTO
        } catch (Exception e) {
            // Catch any other unexpected internal server errors
            System.err.println("Internal server error during payment initiation for order " + request.orderId() + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Handles the Razorpay webhook callback for payment status updates.
     * Razorpay sends payment success/failure notifications to this endpoint.
     * It's crucial to verify the signature to ensure the callback is from Razorpay.
     *
     * @param razorpaySignature The X-Razorpay-Signature header for verification.
     * @param payload The raw JSON payload from Razorpay, containing payment event details.
     * @return ResponseEntity indicating successful processing or an error.
     */
    @PostMapping("/callback")
    public ResponseEntity<String> handleRazorpayCallback(
            @RequestHeader("X-Razorpay-Signature") String razorpaySignature,
            @RequestBody String payload) {
        try {
            // Delegate to the payment service to verify the signature and process the callback
            paymentService.handlePaymentCallback(payload, razorpaySignature);
            
            // Razorpay expects a 200 OK response for successful webhook processing.
            // This prevents Razorpay from retrying the webhook.
            return ResponseEntity.ok("Payment callback processed successfully");
        } catch (PaymentException e) {
            // Log the error. For security reasons (e.g., invalid signature),
            // it's often better to return a non-200 status (like 400 Bad Request)
            // to indicate a problem, even though Razorpay might retry.
            System.err.println("Error processing Razorpay payment callback: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing payment callback: " + e.getMessage());
        } catch (Exception e) {
            // Catch any other unexpected internal server errors during callback processing
            System.err.println("Internal server error during Razorpay payment callback: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
}