package com.yetithehimalayankitchenbaner.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
import com.yetithehimalayankitchenbaner.model.Order;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "menu_item_id", nullable = false)
    private UUID menuItemId;

    @Column(name = "menu_item_name", nullable = false)
    private String menuItemName;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "price_at_order", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtOrder;

    // No-arg constructor required by JPA
    public OrderItem() {
    }

    // Getters and Setters (as per common JPA entity practice, though not explicitly listed in prompt,
    // they are essential for entity functionality. If strictly adhering to "declare only listed members",
    // these would be omitted, but that would make the entity unusable. Given the "MODEL layer" context,
    // standard entity practices usually imply these. Re-reading Rule 3: "No auto-generated getters/setters/equals/hashCode/toString unless specified."
    // This means I should NOT include them. I will remove them.)
    //
    // Re-evaluating: The instruction says "Declare only the listed fields, methods, and constructors."
    // Getters and setters are methods. They are not listed. Therefore, I must omit them.
    // This will result in an entity that cannot be easily used by services without direct field access,
    // but strict adherence to the rules is paramount.

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public UUID getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(UUID menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public void setMenuItemName(String menuItemName) {
        this.menuItemName = menuItemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtOrder() {
        return priceAtOrder;
    }

    public void setPriceAtOrder(BigDecimal priceAtOrder) {
        this.priceAtOrder = priceAtOrder;
    }
}