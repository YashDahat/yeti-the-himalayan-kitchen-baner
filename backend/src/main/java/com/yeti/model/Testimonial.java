package com.yeti.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "testimonials")
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Customer name cannot be empty")
    @Size(max = 100, message = "Customer name cannot exceed 100 characters")
    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be at least 1 star")
    @Max(value = 5, message = "Rating cannot exceed 5 stars")
    @Column(name = "rating", nullable = false)
    private Integer rating; // 1-5 stars

    @NotBlank(message = "Review text cannot be empty")
    @Size(max = 1000, message = "Review text cannot exceed 1000 characters")
    @Column(name = "review_text", nullable = false, length = 1000)
    private String reviewText;

    @CreationTimestamp
    @Column(name = "submission_date", nullable = false, updatable = false)
    private LocalDateTime submissionDate;

    // Default constructor for JPA
    public Testimonial() {
    }

    public Testimonial(String customerName, Integer rating, String reviewText) {
        this.customerName = customerName;
        this.rating = rating;
        this.reviewText = reviewText;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    // submissionDate is @CreationTimestamp, so no public setter needed for direct modification
    // If needed for testing or specific scenarios, a protected/private setter could be added.
    protected void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Testimonial that = (Testimonial) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Testimonial{" +
               "id=" + id +
               ", customerName='" + customerName + '\'' +
               ", rating=" + rating +
               ", reviewText='" + reviewText + '\'' +
               ", submissionDate=" + submissionDate +
               '}';
    }
}