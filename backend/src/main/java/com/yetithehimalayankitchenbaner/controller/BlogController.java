package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.BlogPostDto;
import com.yetithehimalayankitchenbaner.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/blog")
public class BlogController {

    private final BlogService blogService;

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<List<BlogPostDto>> getAllBlogPosts() {
        List<BlogPostDto> blogPosts = blogService.getAllBlogPosts();
        return ResponseEntity.ok(blogPosts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDto> getBlogPostById(@PathVariable UUID id) {
        BlogPostDto blogPost = blogService.getBlogPostById(id);
        return ResponseEntity.ok(blogPost);
    }
}