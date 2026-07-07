package com.yetithehimalayankitchenbaner.repository;

import com.yetithehimalayankitchenbaner.model.MenuItem;
import com.yetithehimalayankitchenbaner.model.MenuItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {
    List<MenuItem> findByCategory(MenuItemCategory category);
}