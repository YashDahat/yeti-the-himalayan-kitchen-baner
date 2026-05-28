package com.yeti.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000) // Allow for longer descriptions
    private String description;

    @Column(nullable = false, precision = 10, scale = 2) // Precision for currency
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private MenuCategory category;

    @Column(nullable = false)
    private boolean available = true; // Whether the item is currently available

    @Column(name = "spicy_level")
    private Integer spicyLevel; // e.g., 1-5, null if not spicy

    @Column(nullable = false)
    private boolean vegetarian = false;

    @Column(nullable = false)
    private boolean vegan = false;
}