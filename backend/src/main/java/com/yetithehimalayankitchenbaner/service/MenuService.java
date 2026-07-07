package com.yetithehimalayankitchenbaner.service;

import com.yetithehimalayankitchenbaner.dto.MenuItemDto;
import com.yetithehimalayankitchenbaner.exception.ResourceNotFoundException;
import com.yetithehimalayankitchenbaner.model.MenuItem;
import com.yetithehimalayankitchenbaner.model.MenuItemCategory;
import com.yetithehimalayankitchenbaner.repository.MenuItemCategoryRepository;
import com.yetithehimalayankitchenbaner.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final MenuItemCategoryRepository menuItemCategoryRepository;

    @Autowired
    public MenuService(MenuItemRepository menuItemRepository, MenuItemCategoryRepository menuItemCategoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.menuItemCategoryRepository = menuItemCategoryRepository;
    }

    // Helper to map MenuItem to MenuItemDto
    private MenuItemDto mapToDto(MenuItem menuItem) {
        return MenuItemDto.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .description(menuItem.getDescription())
                .price(menuItem.getPrice())
                // MenuItemCategory is an enum and does not have a UUID ID.
                // As per the instruction for MenuItemDto, categoryId is present.
                // For mapping from MenuItem (which has an enum category), we cannot derive a UUID.
                // This field will be null when mapping from MenuItem to MenuItemDto.
                .categoryId(null)
                .categoryName(menuItem.getCategory() != null ? menuItem.getCategory().getName() : null)
                .imageUrl(menuItem.getImageUrl())
                .available(menuItem.isAvailable())
                .build();
    }

    // Helper to map MenuItemDto to MenuItem entity (for create/update)
    // This method assumes MenuItemCategory is an entity managed by MenuItemCategoryRepository
    // and that MenuItem.setCategory can accept such an entity.
    // This is a direct consequence of following the service instruction despite potential model contradictions
    // where MenuItemCategory is defined as an enum but treated as an entity in the service logic.
    private MenuItem mapToEntity(MenuItemDto menuItemDto, MenuItem existingMenuItem) {
        if (existingMenuItem == null) {
            existingMenuItem = new MenuItem();
        }

        existingMenuItem.setName(menuItemDto.getName());
        existingMenuItem.setDescription(menuItemDto.getDescription());
        existingMenuItem.setPrice(menuItemDto.getPrice());
        existingMenuItem.setImageUrl(menuItemDto.getImageUrl());
        existingMenuItem.setAvailable(menuItemDto.getAvailable());

        UUID categoryId = menuItemDto.getCategoryId();
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null for menu item creation/update.");
        }

        // The instruction specifies finding MenuItemCategory by ID using MenuItemCategoryRepository.
        // This code assumes MenuItemCategoryRepository.findById returns a MenuItemCategory instance
        // that can be used by MenuItem.setCategory().
        MenuItemCategory category = menuItemCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item category not found with ID: " + categoryId));
        existingMenuItem.setCategory(category);

        return existingMenuItem;
    }


    // Menu Item Operations

    public List<MenuItemDto> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MenuItemDto getMenuItemById(UUID id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID: " + id));
        return mapToDto(menuItem);
    }

    public List<MenuItemDto> getMenuItemsByCategory(UUID categoryId) {
        // The instruction specifies finding MenuItemCategory by ID using MenuItemCategoryRepository.
        // This code assumes MenuItemCategoryRepository.findById returns a MenuItemCategory instance
        // that can be used by MenuItemRepository.findByCategory().
        MenuItemCategory category = menuItemCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item category not found with ID: " + categoryId));

        return menuItemRepository.findByCategory(category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public MenuItemDto createMenuItem(MenuItemDto menuItemDto) {
        MenuItem menuItem = mapToEntity(menuItemDto, null);
        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return mapToDto(savedMenuItem);
    }

    public MenuItemDto updateMenuItem(UUID id, MenuItemDto menuItemDto) {
        MenuItem existingMenuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID: " + id));

        MenuItem updatedMenuItem = mapToEntity(menuItemDto, existingMenuItem);
        MenuItem savedMenuItem = menuItemRepository.save(updatedMenuItem);
        return mapToDto(savedMenuItem);
    }

    public void deleteMenuItem(UUID id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with ID: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    // Menu Category Operations

    public List<MenuItemCategory> getAllMenuItemCategories() {
        // The instruction specifies that category operations accept and return MenuItemCategory entities.
        // This code assumes MenuItemCategoryRepository.findAll() returns a List of MenuItemCategory instances.
        return menuItemCategoryRepository.findAll();
    }

    public MenuItemCategory getMenuItemCategoryById(UUID id) {
        // The instruction specifies that category operations accept and return MenuItemCategory entities.
        // This code assumes MenuItemCategoryRepository.findById() returns a MenuItemCategory instance.
        return menuItemCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item category not found with ID: " + id));
    }

    public MenuItemCategory createMenuItemCategory(MenuItemCategory category) {
        // The instruction specifies that category operations accept and return MenuItemCategory entities.
        // This code assumes MenuItemCategory is an entity that can be saved by JpaRepository.
        return menuItemCategoryRepository.save(category);
    }

    public MenuItemCategory updateMenuItemCategory(UUID id, MenuItemCategory category) {
        // The instruction specifies that category operations accept and return MenuItemCategory entities
        // and that the 'name' field should be updated.
        // This code assumes MenuItemCategory is an entity with a mutable 'name' field and can be saved.
        MenuItemCategory existingCategory = menuItemCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item category not found with ID: " + id));

        existingCategory.setName(category.getName()); // This line assumes MenuItemCategory has a setName method.
        return menuItemCategoryRepository.save(existingCategory);
    }

    public void deleteMenuItemCategory(UUID id) {
        // The instruction specifies that category operations accept and return MenuItemCategory entities.
        // This code assumes MenuItemCategoryRepository can delete by ID.
        if (!menuItemCategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item category not found with ID: " + id);
        }
        menuItemCategoryRepository.deleteById(id);
    }
}