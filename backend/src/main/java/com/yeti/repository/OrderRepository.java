package com.yeti.repository;

import com.yeti.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    /**
     * Finds all orders associated with a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of orders belonging to the user.
     */
    List<Order> findByUserId(Long userId);
}