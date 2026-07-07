package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.TestimonialDto;
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import com.yetithehimalayankitchenbaner.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/testimonials")
public class TestimonialController {

    @Autowired
    private TestimonialService testimonialService;

    @GetMapping("/approved")
    public ResponseEntity<List<TestimonialDto>> getAllApprovedTestimonials() {
        List<TestimonialDto> testimonials = testimonialService.getAllApprovedTestimonials();
        return ResponseEntity.ok(testimonials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestimonialDto> getTestimonialById(@PathVariable UUID id) {
        try {
            TestimonialDto testimonial = testimonialService.getTestimonialById(id);
            return ResponseEntity.ok(testimonial);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}