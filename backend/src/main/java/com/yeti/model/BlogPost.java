package com.yeti.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "blog_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 255)
    private String slug; // For friendly URLs, e.g., "himalayan-food-festival-2023"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 100)
    private String author; // e.g., "Yeti Team" or "Guest Writer"

    @Column(name = "publish_date", nullable = false)
    private LocalDateTime publishDate;

    @Column(name = "image_url", length = 500)
    private String imageUrl; // URL for a featured image

    @Column(length = 255)
    private String tags; // Comma-separated tags, e.g., "food,events,himalayan,culture"

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        publishDate = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}