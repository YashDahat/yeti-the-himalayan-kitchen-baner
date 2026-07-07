package com.yetithehimalayankitchenbaner.config;

import com.yetithehimalayankitchenbaner.model.MenuItem;
import com.yetithehimalayankitchenbaner.model.MenuItemCategory;
import com.yetithehimalayankitchenbaner.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    public DataSeeder(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (menuItemRepository.count() == 0) {
            seedMenuItems();
        }
    }

    private void seedMenuItems() {
        List<MenuItem> menuItems = Arrays.asList(
            createMenuItem("Chicken Momo", "Steamed chicken dumplings served with spicy chutney.", new BigDecimal("250.00"), "https://example.com/chicken-momo.jpg", true, MenuItemCategory.NAME),
            createMenuItem("Veg Thukpa", "Noodle soup with mixed vegetables and Himalayan spices.", new BigDecimal("200.00"), "https://example.com/veg-thukpa.jpg", true, MenuItemCategory.ID),
            createMenuItem("Paneer Chilli", "Fried paneer cubes tossed in spicy Indo-Chinese sauce.", new BigDecimal("300.00"), "https://example.com/paneer-chilli.jpg", true, MenuItemCategory.NAME),
            createMenuItem("Aloo Chop", "Spiced potato patties, deep-fried and served with sauce.", new BigDecimal("150.00"), "https://example.com/aloo-chop.jpg", true, MenuItemCategory.ID),
            createMenuItem("Mutton Curry", "Slow-cooked mutton in rich gravy with traditional spices.", new BigDecimal("450.00"), "https://example.com/mutton-curry.jpg", true, MenuItemCategory.NAME)
        );
        menuItemRepository.saveAll(menuItems);
    }

    private MenuItem createMenuItem(String name, String description, BigDecimal price, String imageUrl, boolean available, MenuItemCategory category) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setImageUrl(imageUrl);
        item.setAvailable(available);
        item.setCategory(category);
        return item;
    }
}