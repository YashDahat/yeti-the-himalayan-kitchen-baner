package com.yetithehimalayankitchenbaner.service;

import com.yetithehimalayankitchenbaner.repository.TestimonialRepository;
import com.yetithehimalayankitchenbaner.model.Testimonial;
import com.yetithehimalayankitchenbaner.dto.TestimonialDto;
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TestimonialService {

    @Autowired
    private TestimonialRepository testimonialRepository;

    public List<TestimonialDto> getAllApprovedTestimonials() {
        return testimonialRepository.findByApproved(true).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TestimonialDto> getAllTestimonials() {
        return testimonialRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TestimonialDto getTestimonialById(UUID id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with id: " + id));
        return convertToDto(testimonial);
    }

    public TestimonialDto createTestimonial(TestimonialDto testimonialDto) {
        Testimonial testimonial = convertToEntity(testimonialDto);
        testimonial.setCreatedAt(LocalDateTime.now());
        testimonial.setApproved(false); // Default to false
        Testimonial savedTestimonial = testimonialRepository.save(testimonial);
        return convertToDto(savedTestimonial);
    }

    public TestimonialDto updateTestimonial(UUID id, TestimonialDto testimonialDto) {
        Testimonial existingTestimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with id: " + id));

        existingTestimonial.setAuthorName(testimonialDto.getAuthorName());
        existingTestimonial.setContent(testimonialDto.getContent());
        existingTestimonial.setRating(testimonialDto.getRating());
        existingTestimonial.setApproved(testimonialDto.getApproved());

        Testimonial updatedTestimonial = testimonialRepository.save(existingTestimonial);
        return convertToDto(updatedTestimonial);
    }

    public TestimonialDto approveTestimonial(UUID id) {
        Testimonial existingTestimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with id: " + id));

        existingTestimonial.setApproved(true);
        Testimonial approvedTestimonial = testimonialRepository.save(existingTestimonial);
        return convertToDto(approvedTestimonial);
    }

    public void deleteTestimonial(UUID id) {
        if (!testimonialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Testimonial not found with id: " + id);
        }
        testimonialRepository.deleteById(id);
    }

    private TestimonialDto convertToDto(Testimonial testimonial) {
        return TestimonialDto.builder()
                .id(testimonial.getId())
                .authorName(testimonial.getAuthorName())
                .content(testimonial.getContent())
                .rating(testimonial.getRating())
                .createdAt(testimonial.getCreatedAt())
                .approved(testimonial.getApproved())
                .build();
    }

    private Testimonial convertToEntity(TestimonialDto testimonialDto) {
        Testimonial testimonial = new Testimonial();
        testimonial.setId(testimonialDto.getId()); // ID might be null for new testimonials
        testimonial.setAuthorName(testimonialDto.getAuthorName());
        testimonial.setContent(testimonialDto.getContent());
        testimonial.setRating(testimonialDto.getRating());
        testimonial.setCreatedAt(testimonialDto.getCreatedAt());
        testimonial.setApproved(testimonialDto.getApproved());
        return testimonial;
    }
}