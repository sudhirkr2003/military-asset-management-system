package com.military.assetmanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AssignmentRequest {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotBlank(message = "Personnel name is required")
    private String personnelName;

    @NotBlank(message = "Personnel ID/Rank is required")
    private String personnelId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private LocalDate assignedDate;
}
