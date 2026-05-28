package com.yeti.controller;

import com.yeti.model.MenuCategory;
import com.yeti.model.MenuItem;
import com.yeti.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    /**
     * Retrieves all menu items, optionally filtered by category.
     *
     * @param categoryId Optional ID of the menu category to filter by.
     * @return A list of MenuItem objects.
     */
    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getAllMenuItems(@RequestParam(required = false) Long categoryId) {
        List<MenuItem> menuItems;
        if (categoryId != null) {
            menuItems = menuService.getMenuItemsByCategoryId(categoryId);
        } else {
            menuItems = menuService.getAllMenuItems();
        }
        return ResponseEntity.ok(menuItems);
    }

    /**
     * Retrieves a single menu item by its ID.
     *
     * @param id The ID of the menu item.
     * @return The MenuItem object if found, otherwise a 404 Not Found response.
     */
    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> menuItem = menuService.getMenuItemById(id);
        return menuItem.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Retrieves all available menu categories.
     *
     * @return A list of MenuCategory objects.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategory>> getAllMenuCategories() {
        List<MenuCategory> categories = menuService.getAllMenuCategories();
        return ResponseEntity.ok(categories);
    }
}