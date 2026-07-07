package com.yetithehimalayankitchenbaner.repository;

import com.yetithehimalayankitchenbaner.model.Order;
import com.yetithehimalayankitchenbaner.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserId(UUID userId);
    List<Order> findByStatus(OrderStatus status);
}