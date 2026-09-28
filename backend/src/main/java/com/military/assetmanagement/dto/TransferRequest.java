package com.military.assetmanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TransferRequest {
    @NotNull(message = "Source Base ID is required")
    private Long fromBaseId;

    @NotNull(message = "Destination Base ID is required")
    private Long toBaseId;

    @NotNull(message = "Equipment Type ID is required")
    private Long equipmentTypeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private LocalDate transferDate;

    @NotBlank(message = "Reference number is required")
    private String referenceNumber;
}
