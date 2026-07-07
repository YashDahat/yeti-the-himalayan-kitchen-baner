package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.BlogPostDto;
import com.yetithehimalayankitchenbaner.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/blog")
public class AdminBlogController {

    private final BlogService blogService;

    @Autowired
    public AdminBlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogPostDto>> getAllBlogPosts() {
        List<BlogPostDto> blogPosts = blogService.getAllBlogPosts();
        return ResponseEntity.ok(blogPosts);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPostDto> getBlogPostById(@PathVariable UUID id) {
        BlogPostDto blogPost = blogService.getBlogPostById(id);
        return ResponseEntity.ok(blogPost);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPostDto> createBlogPost(@Valid @RequestBody BlogPostDto blogPostDto) {
        BlogPostDto createdBlogPost = blogService.createBlogPost(blogPostDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBlogPost);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPostDto> updateBlogPost(@PathVariable UUID id, @Valid @RequestBody BlogPostDto blogPostDto) {
        BlogPostDto updatedBlogPost = blogService.updateBlogPost(id, blogPostDto);
        return ResponseEntity.ok(updatedBlogPost);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBlogPost(@PathVariable UUID id) {
        blogService.deleteBlogPost(id);
        return ResponseEntity.noContent().build();
    }
}