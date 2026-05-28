package com.yeti.service;

import com.yeti.model.MenuCategory;
import com.yeti.model.MenuItem;
import com.yeti.repository.MenuCategoryRepository; // This repository is assumed to exist.
import com.yeti.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    @Autowired
    public MenuService(MenuItemRepository menuItemRepository, MenuCategoryRepository menuCategoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.menuCategoryRepository = menuCategoryRepository;
    }

    /**
     * Retrieves all menu categories.
     * @return A list of all menu categories.
     */
    public List<MenuCategory> findAllCategories() {
        return menuCategoryRepository.findAll();
    }

    /**
     * Retrieves a menu category by its ID.
     * @param id The ID of the menu category.
     * @return An Optional containing the menu category if found, or empty otherwise.
     */
    public Optional<MenuCategory> findCategoryById(Long id) {
        return menuCategoryRepository.findById(id);
    }

    /**
     * Retrieves all menu items.
     * @return A list of all menu items.
     */
    public List<MenuItem> findAllMenuItems() {
        return menuItemRepository.findAll();
    }

    /**
     * Retrieves a menu item by its ID.
     * @param id The ID of the menu item.
     * @return An Optional containing the menu item if found, or empty otherwise.
     */
    public Optional<MenuItem> findMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    /**
     * Retrieves all menu items belonging to a specific category.
     * This method assumes that MenuItemRepository has a method defined as:
     * `List<MenuItem> findByCategory_Id(Long categoryId);`
     * @param categoryId The ID of the category.
     * @return A list of menu items in the specified category.
     */
    public List<MenuItem> findMenuItemsByCategoryId(Long categoryId) {
        return menuItemRepository.findByCategory_Id(categoryId);
    }
}