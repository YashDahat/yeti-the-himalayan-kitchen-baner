package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.TestimonialDto;
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import com.yetithehimalayankitchenbaner.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/testimonials")
public class AdminTestimonialController {

    @Autowired
    private TestimonialService testimonialService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TestimonialDto>> getAllTestimonials() {
        List<TestimonialDto> testimonials = testimonialService.getAllTestimonials();
        return ResponseEntity.ok(testimonials);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestimonialDto> getTestimonialById(@PathVariable UUID id) {
        try {
            TestimonialDto testimonial = testimonialService.getTestimonialById(id);
            return ResponseEntity.ok(testimonial);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestimonialDto> createTestimonial(@RequestBody TestimonialDto testimonialDto) {
        TestimonialDto createdTestimonial = testimonialService.createTestimonial(testimonialDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTestimonial);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestimonialDto> updateTestimonial(@PathVariable UUID id, @RequestBody TestimonialDto testimonialDto) {
        try {
            TestimonialDto updatedTestimonial = testimonialService.updateTestimonial(id, testimonialDto);
            return ResponseEntity.ok(updatedTestimonial);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestimonialDto> approveTestimonial(@PathVariable UUID id) {
        try {
            TestimonialDto approvedTestimonial = testimonialService.approveTestimonial(id);
            return ResponseEntity.ok(approvedTestimonial);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable UUID id) {
        try {
            testimonialService.deleteTestimonial(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}