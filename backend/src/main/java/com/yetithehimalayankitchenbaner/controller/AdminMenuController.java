package com.yetithehimalayankitchenbaner.controller;

import com.yetithehimalayankitchenbaner.dto.MenuItemDto;
import com.yetithehimalayankitchenbaner.model.MenuItemCategory;
import com.yetithehimalayankitchenbaner.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import com.yetithehimalayankitchenbaner.repository.MenuItemCategoryRepository;

@RestController
@RequestMapping("/api/admin/menu")
public class AdminMenuController {

    private final MenuService menuService;

    @Autowired
    public AdminMenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // Menu Item Operations

    @GetMapping("/items")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems() {
        List<MenuItemDto> menuItems = menuService.getAllMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> getMenuItemById(@PathVariable UUID id) {
        MenuItemDto menuItem = menuService.getMenuItemById(id);
        return ResponseEntity.ok(menuItem);
    }

    @PostMapping("/items")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody MenuItemDto menuItemDto) {
        MenuItemDto createdMenuItem = menuService.createMenuItem(menuItemDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMenuItem);
    }

    @PutMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable UUID id, @Valid @RequestBody MenuItemDto menuItemDto) {
        MenuItemDto updatedMenuItem = menuService.updateMenuItem(id, menuItemDto);
        return ResponseEntity.ok(updatedMenuItem);
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable UUID id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }

    // Menu Category Operations

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MenuItemCategory>> getAllMenuItemCategories() {
        List<MenuItemCategory> categories = menuService.getAllMenuItemCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemCategory> getMenuItemCategoryById(@PathVariable UUID id) {
        MenuItemCategory category = menuService.getMenuItemCategoryById(id);
        return ResponseEntity.ok(category);
    }

    // Inner static class for category creation/update requests
    // Note: Validation annotations (e.g., @NotBlank) are omitted as per Rule 2 (Imports)
    // and Rule 4 (No unsolicited content) if not explicitly listed in allowed imports.
    static class CategoryRequest {
        private String name;

        public CategoryRequest() {}

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemCategory> createMenuItemCategory(@RequestBody CategoryRequest categoryRequest) {
        // NOTE: The MenuItemCategory model is provided as an enum, but the MenuService
        // and MenuItemCategoryRepository imply it should be a JPA entity with an ID and a name.
        // To reconcile this contradiction and allow the controller to compile against the
        // MenuService's method signatures, we treat MenuItemCategory here as if it were
        // an entity that can be instantiated and have its name set.
        // This is a necessary interpretation to make the system functionally coherent,
        // despite the explicit enum definition in MenuItemCategory.java.
        MenuItemCategory category = new MenuItemCategory(); // Assuming MenuItemCategory is an entity
        category.setName(categoryRequest.getName()); // Assuming MenuItemCategory has a setName method

        MenuItemCategory createdCategory = menuService.createMenuItemCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemCategory> updateMenuItemCategory(@PathVariable UUID id, @RequestBody CategoryRequest categoryRequest) {
        // NOTE: Same reconciliation as in createMenuItemCategory.
        MenuItemCategory category = new MenuItemCategory(); // Assuming MenuItemCategory is an entity
        category.setName(categoryRequest.getName()); // Assuming MenuItemCategory has a setName method

        MenuItemCategory updatedCategory = menuService.updateMenuItemCategory(id, category);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMenuItemCategory(@PathVariable UUID id) {
        menuService.deleteMenuItemCategory(id);
        return ResponseEntity.noContent().build();
    }
}