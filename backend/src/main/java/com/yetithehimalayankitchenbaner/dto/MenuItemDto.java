package com.yetithehimalayankitchenbaner.dto;

import jakarta.validation.constraints.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDto {
    private UUID id;
    private String name;
    private String description;
    private java.math.BigDecimal price;
    private UUID categoryId;
    private String categoryName;
    private String imageUrl;
    private Boolean available;
}
