package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.PaymentOrderResponse;
import com.yetithehimalayankitchenbaner.dto.PaymentVerificationRequest;
import com.yetithehimalayankitchenbaner.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    public ResponseEntity<PaymentOrderResponse> initiatePayment(
            @RequestParam UUID orderId,
            @RequestParam BigDecimal amount) {
        PaymentOrderResponse response = paymentService.createPaymentOrder(orderId, amount);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        boolean isVerified = paymentService.verifyPaymentSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (isVerified) {
            return new ResponseEntity<>("Payment verified successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Payment verification failed", HttpStatus.BAD_REQUEST);
        }
    }
}