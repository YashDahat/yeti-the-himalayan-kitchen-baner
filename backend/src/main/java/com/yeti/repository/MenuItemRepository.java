package com.yeti.repository;

import com.yeti.model.MenuItem;
import com.yeti.model.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    /**
     * Finds all menu items belonging to a specific category.
     *
     * @param category The category to filter by.
     * @return A list of MenuItem entities.
     */
    List<MenuItem> findByCategory(MenuCategory category);

    /**
     * Finds all menu items that are marked as featured.
     *
     * @param isFeatured A boolean indicating whether to find featured items.
     * @return A list of MenuItem entities.
     */
    List<MenuItem> findByIsFeatured(boolean isFeatured);

    /**
     * Finds all menu items that are currently available.
     *
     * @param isAvailable A boolean indicating whether to find available items.
     * @return A list of MenuItem entities.
     */
    List<MenuItem> findByIsAvailable(boolean isAvailable);
}